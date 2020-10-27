import React from 'react';
import { Avatar } from 'antd';
import './user.less';

function User(props) {
  const user = props.user || {};
  return (
    <li className="user-item" key={user.id}>
      <Avatar src={user.avatar}/>
      <span className="nick-name">{user.name}</span>
    </li>
  );
}

export default User;