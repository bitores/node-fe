import React from 'react';
import moment from 'moment';
import { Avatar } from 'antd';
import './group.less';


class Group extends React.Component {

  constructor(props) {
    super(props);
    this.handleClickGroup = this.handleClickGroup.bind(this);
  }

  handleClickGroup(ev) {
    this.props.click(this.props.group);
  }

  render() {
    const props = this.props;
    const group = props.group || {};
    const currentId = props.currentId || 0;
    let time = '';
    if (group.time) {
      // const lastMessageTime = parseISO(group.time);
      // let formaStr = 'yyyy-MM-dd';
      // if (isSameDay(lastMessageTime, new Date())) {
      //   formaStr = 'HH:mm';
      // }
      // time = format(lastMessageTime, formaStr);
      time="2020-07-11 10:20:10"
    }
    return (
      <li
          className={currentId === group.id ? 'chat-item chat-item-active' : 'chat-item'}
          key={group.id}
          onClick={this.handleClickGroup}>
        <Avatar/>
        <div className="chat-info">
          <h3 className="chat-name-wrapper">
            <span className="chat-name">{group.name}</span>
            <span className="time">{moment(group.time).fromNow()}</span>
          </h3>
          <p className="last-message">{group.lastMessage}</p>
        </div>
      </li>
    );
  }
}

export default Group;