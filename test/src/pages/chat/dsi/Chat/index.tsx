import React, {  useEffect, useState, useRef } from 'react';
import SideBar from './side-bar/index';
import  './style.less';
import { SmileOutlined, HomeOutlined, SettingFilled, UserAddOutlined } from '@ant-design/icons';
import { Space } from 'antd';
import socket from 'socket.io-client'
import Group from './group';
import User from './user';
import Message from './message';


const bRef  = React.createRef();
export default ({
  // =[],
  // selectedGroup={},
  users=[],
  onTyping,
  
  

})=>{
  // console.log(props)
  const [connStatus, setConnStatus] = useState(false);
  const [chatMessages, setMsgCache] = useState([]);
  const [message, setMessage] = useState('');
  const msgRef = useRef([]);
  const [typing, setTyping] = useState('');
  const [chatTitle, setChatTitle] = useState('');
  const [oClient, setClient]  = useState({});
  const [onlinePanelActive,  setOnlinePanelActive] = useState(false);
  const  [selectedGroup, setSelGroup] = useState({})
  const [onlineUers, setOnlineUsers] = useState([]);
  const [chatGroups, setChatGroups] = useState([]);


  useEffect(()=>{
    const client = socket('ws://localhost:1030',{
      path:'/chat',
      forceNode:true,
      transportOptions: {
        polling: {
          extraHeaders: {
            Authorization: `Bearer ${localStorage.token}`
          }
        }
      },
      extraHeaders: {
        Authorization: `Bearer ${localStorage.token}`
      }
    })

    client.on('error', function(data){
      console.log(data + ' - error'); //reconnect_error
    })



    client.on('exception', (data) => {
      console.log('exception is', data);
      const { errcode } = data;
      if (errcode === 'ACCESS_TOKEN_EXPIRED' || errcode === 'ACCESS_TOKEN_REQUIRED') {
        // this.history.push('/login');
        console.log('重新登录')
      }
    });

    client.on('authenticated', () => {
      //do other things
      console.log('authenticated')
    })
    .on('unauthorized', (msg) => {
      console.log(`unauthorized: ${JSON.stringify(msg.data)}`);
      throw new Error(msg.data.type);
    })

    client.on('unauthorized', (error, callback) => {
      console.error(error,'sdf')
      if (error.data.type == 'UnauthorizedError' || error.data.code == 'invalid_token') {
        // redirect user to login page perhaps or execute callback:
        callback();
        console.log('User token has expired');
      }
    });

    client.on('connect', function(){
      console.log('connection')
      setConnStatus(true)

      
      client.emit('get-my-rooms');

      client.on('onlineusers', users => {
        console.log('在线用户',users)
        const onlineUers = users.map(item => {
          return {
            id: item.id,
            name: item.name,
            avatar: item.avatar,
          };
        });

        setOnlineUsers(onlineUers)
      });

      client.on('chatgroups', groups => {
        // this.setState({
        //   chatGroups: groups,
        // });
        // if (groups.length > 0) {
        //   const [selectedGroup] = groups;
        //   if (!selectedGroup) {
        //     return;
        //   }
        //   this.setState({
        //     selectedGroup,
        //   });
        //   socket.emit('joinRoom', {name: selectedGroup.name, groupId: selectedGroup.id });
        // }
        console.log(groups)
        const ids = Object.values(groups);
        setChatGroups(ids.map(id=>({
          id,
          name: id,
          lastMessage: id,
          time: '2020-7-12 23:11:00'
        })))
      });

      client.on('message', data=>{
        msgRef.current.push(data);
        setMsgCache([...msgRef.current])
        bRef.current.scrollIntoView();
      });

      client.on('userin', (user) => {
        msgRef.current.push({
          type: 'sys',
          sentAt: new Date().toISOString(),
          content: `${user.name} 进入群聊`
        });
        setMsgCache([...msgRef.current])
        bRef.current.scrollIntoView();
      });
  
      client.on('useronline', (user) => {
        msgRef.current.push({
          type: 'sys',
          sentAt: new Date().toISOString(),
          content: `${user.name} 上线`
        });
        setMsgCache([...msgRef.current])
        bRef.current.scrollIntoView();
      });

      client.on('userleave', (user) => {
        msgRef.current.push({
          type: 'sys',
          sentAt: new Date().toISOString(),
          content: `${user.name} 退出群聊`
        });
        setMsgCache([...msgRef.current])
        bRef.current.scrollIntoView();
      });

      client.on('useroffline', (user) => {
        msgRef.current.push({
          type: 'sys',
          sentAt: new Date().toISOString(),
          content: `${user.name} 下线`
        });
        setMsgCache([...msgRef.current])
        bRef.current.scrollIntoView();
      });

      client.on('typing', (user)=>{
        setTyping(`${user.name} 正在输入中`)
        setTimeout(()=>{
          setTyping('')
        }, 1000)
      })

      client.on('close', ()=>{
        setConnStatus(false)
      });

    });

    client.on('disconnect', ()=>{
      console.log('disconnect')
      // client.close();// 断开
      setConnStatus(false)
    })
    setClient(client);

    return ()=>client.close();
  },[])

  useEffect(()=>{


    function onKeyPress(e){
        if(e.keyCode === 13) {
          // emit 
          e.preventDefault();
          // oClient.send(message)
          oClient.emit('message', selectedGroup.id, message);
          setMessage('')
          console.log(message)
        } else {
          oClient.emit('typing')
        }
    }

    document.addEventListener('keypress', onKeyPress);
    return ()=>{
      
      document.removeEventListener('keypress', onKeyPress);
    }
  },[oClient, message])
  
  
  const typingEle = typing ? <div className="note">{typing}</div> : '';

  const listItems = chatGroups.map((group) => {
    return <Group
        key={group.id}
        currentId={selectedGroup.id}
        group={group}
        click={(e)=>{
          // e.nam e, e.id
          console.log(e)
          setSelGroup(e)
          setChatTitle(e.name)
          oClient.emit('get-all-users', e.id)
        }}/>;
  });

  // const chatTitle = selectedGroup.name;

  const messages = chatMessages.filter(message => message.sentAt).map((message, index) => {
    return <Message key={index + 1} message={message} />;
  });

  // const onlineUers = ;

  return (<div className="react-ui-chat">
  <SideBar/>
  <section className="column-middle">
    <section className="search-bar">
      {/* <input type="text" /> */}
    </section>
    <ul className="chat-list">
      {listItems}
    </ul>
  </section>
  <div className="chat-body">
    <section className="header">
      <h2>{chatTitle}（{onlineUers.length}）</h2>
      <UserAddOutlined onClick={()=>{
        setOnlinePanelActive(!onlinePanelActive)
      }}/>
    </section>
    <section className="body-container">
      <section className="body">
        {typingEle}
        <section className="messages" id="messageList">
          {messages}
          <p ref={bRef}/>
        </section>
        <section className="footer">
          <div className="action-bar">
            <Space>
              <SmileOutlined />
              <HomeOutlined />
              <SettingFilled />
            </Space>
            
          </div>
          <textarea
            className="message-box"
            onChange={(e)=>{
              setMessage(e.target.value)
            }}
            />
        </section>
        
      </section>
      <section
        className={onlinePanelActive ? 'online-users online-users-active' : 'online-users'}
        onClick={(event) => event.stopPropagation()}>
        <ul>
          {
            onlineUers.map(user => {
              return <User className="user" key={user.id} user={user}  />
            })
          }
        </ul>
      </section>
    </section>
    
  </div>
</div>)
}