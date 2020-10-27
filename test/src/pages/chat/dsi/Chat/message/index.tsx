import React from 'react';
import './message.less';
import { Avatar } from 'antd';
import { isSameDay, parseISO, format } from 'date-fns';


function Message(props) {
  const message = props.message || {};
  // const messageTime = parseISO(message.sentAt);
  // const now = new Date();
  // let formaStr = 'yyyy-MM-dd HH:mm';
  // if (isSameDay(messageTime, now)) {
  //   formaStr = 'HH:mm';
  // }
  // const sentAt = format(messageTime, formaStr);
  const sentAt = "2020-12-11 1:02:50";
  let sys = <div className="message message-sys">{message.content}</div>
  let normal = <div className="message">
    <div className="sent-time">{sentAt}</div>
    {
      message.from===2?(<div className="message-info">
        <Avatar cssClass="avatar" size="36" url={message.senderAvatar}></Avatar>
        <div className="message-body">
          <div className="sender-name">{message.senderName}</div>
          <div className="bubble">{message.content}</div>
        </div>
      </div>):(<div className="message-info reverse" >
        <Avatar cssClass="avatar" size="36" url={message.senderAvatar}></Avatar>
        <div className="message-body">
          <div className="sender-name self">{message.senderName}</div>
          <div className="bubble">{message.content}</div>
        </div>
      </div>)
    }
    
  </div>
  return (
    message.type === 'sys' ? sys : normal
  );
}

export default Message;