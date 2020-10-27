import React from 'react';
import { Avatar } from 'antd';
import { SettingOutlined, WechatOutlined } from '@ant-design/icons';
import './side-bar.less';

class SideBar extends React.Component {
  // history
  // dispatch

  constructor(props) {
    super(props);
    this.dispatch = props.dispatch;
    this.history = props.history || {};

    this.state = {
      menusVisible: false,
      profilePanelVisible: false,
      avatarPanelVisible: false,
      name: '',
      email: '',
    };

    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const { nickName, email, avatar } = JSON.parse(userStr);
        this.state.name = nickName;
        this.state.email = email;
        this.state.avatar = avatar;
        this.state.selectedAvatarUrl = avatar;
      } catch (err) {
        console.error('parse json string failed:', err);
      }
    }

    this.handleClickSettingIcon = this.handleClickSettingIcon.bind(this);
    this.handleClickMenu = this.handleClickMenu.bind(this);
    this.handleClickAvatar = this.handleClickAvatar.bind(this);
    this.hidePanels = this.hidePanels.bind(this);
    this.handleClickProfilePanel = this.handleClickProfilePanel.bind(this);
    this.handleOpenAvatarPanel = this.handleOpenAvatarPanel.bind(this);
    this.handleSelectAvatar = this.handleSelectAvatar.bind(this);
  }

  componentWillMount() {
    window.addEventListener('click', this.hidePanels);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.hidePanels);
  }

  handleClickSettingIcon(ev) {
    ev.stopPropagation();
    this.setState({
      menusVisible: !this.state.menusVisible,
    });
  }

  handleClickAvatar(ev) {
    ev.stopPropagation();
    this.setState({
      profilePanelVisible: !this.state.profilePanelVisible,
    });
  }

  handleClickMenu(ev) {
    const { id } = ev.target.dataset;
    if (id === 'logout') {
      localStorage.clear();
      this.history.replace('/login');
    }
  }

  handleClickProfilePanel(ev) {
    ev.stopPropagation();
  }

  hidePanels() {
    this.setState({
      menusVisible: false,
      profilePanelVisible: false,
      avatarPanelVisible: false,
    });
  }

  handleOpenAvatarPanel(ev) {
    ev.stopPropagation();
    this.setState({
      profilePanelVisible: false,
      avatarPanelVisible: true,
    });
  }

  async handleSelectAvatar(ev) {
    ev.stopPropagation();
    const { url } = ev.target.dataset;
    this.setState({
      selectedAvatarUrl: url,
    });
    try {
      await put('/user/avatar', {
        avatar: url,
      });
      this.setState({
        avatar: url,
      });
      this.dispatch(changeAvatar(url));
    } catch (err) {
      console.error('update avatar failed:', err);
    }
  }

  render() {
    const selectedAvatarUrl = this.state.selectedAvatarUrl;
    const avatars = [1, 2, 3, 4, 5].map(item => `avatar${item}.png`).map((url, index) => {
      return <li key={index+1} className={url === selectedAvatarUrl ? 'avatar-item selected' : 'avatar-item'}>
        <Avatar url={url} onClick={this.handleSelectAvatar} />
      </li>
    });

    return (
      <section className="side-action-bar">
        <div className="icons">
          <Avatar
              // cssClass="my-avatar"
              src={this.state.avatar}
              onClick={this.handleClickAvatar} />
          <span className="nick-name">{this.state.name}</span>
          <WechatOutlined />
        </div>
        <SettingOutlined onClick={this.handleClickSettingIcon}/>
        <ul
            className={this.state.menusVisible ? 'menus menus-visible' : 'menus'}
            onClick={this.handleClickMenu}>
            {/* <li data-id="setting">设置</li> */}
          <li data-id="logout">退出</li>
        </ul>

        <aside
            className={this.state.profilePanelVisible ? 'profile-panel active' : 'profile-panel'}
            onClick={this.handleClickProfilePanel}>
          <div className="row row-1">
            <div>
              <div className="nick-name">{this.state.name}</div>
              <div>邮箱：{this.state.email}</div>
            </div>
            <div>
              <Avatar src={this.state.avatar} onClick={this.handleOpenAvatarPanel} />
            </div>
          </div>
        </aside>

        <aside
            className={this.state.avatarPanelVisible ? 'panel-avatar active' : 'panel-avatar'}>
          <ul className="avatars">
            {avatars}
          </ul>
        </aside>
      </section>
    );
  }
}

export default SideBar;