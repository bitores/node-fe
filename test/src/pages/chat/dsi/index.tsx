import React, {  useEffect, useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Input, Button, message, Space, Avatar, Comment, Tooltip } from 'antd';
import socket from 'socket.io-client'
import {Form} from 'react-antd-super-form';
import { UserOutlined } from '@ant-design/icons';
import moment from 'moment';
import Chat from './Chat';

const bRef  = React.createRef();
export default ()=>{
  const [connStatus, setConnStatus] = useState(false);
  const [msgCache, setMsgCache] = useState([]);
  const msgRef = useRef([]);
  const [client, setClient]  = useState({});

  // useEffect(()=>{

  //   let client = socket('ws://localhost:1030',{
  //     forceNode:true,
  //     transportOptions: {
  //       polling: {
  //         extraHeaders: {
  //           Authorization: `Bearer ${localStorage.token}`
  //         }
  //       }
  //     },
  //     extraHeaders: {
  //       Authorization: `Bearer ${localStorage.token}`
  //     }
  //   })

  //   setClient(client);

  //   client.on('connect', function(){
  //     setConnStatus(true)
  //     client.on('message', function(data){
  //       msgRef.current.push(data);
  //       setMsgCache([...msgRef.current])
  //       // bRef.current.scrollIntoView();
  //     });
  //     client.on('close', function(){
  //       setConnStatus(false)
  //     });
  //   });

  //   client.on('disconnect', ()=>{
  //     console.log('disconnect')
  //     client.close();
  //     setConnStatus(false)
  //   })

  //   client.on('unauthorized', (error, callback) => {
  //     if (error.data.type == 'UnauthorizedError' || error.data.code == 'invalid_token') {
  //       // redirect user to login page perhaps or execute callback:
  //       callback();
  //       message.error('登录失效');
  //       client.close();
  //       setConnStatus(false)
  //     }
  //   });

  //   return ()=>client.close()
  // },[])

  return (
  <div>
    {/* <p>{connStatus?'上线了':<Button onClick={()=>{
      client.open()
    }}>重连</Button>} </p>
    <Form 
        layout={'inline'}
        data={form=>[
          {
            cType: Input,
            placehold: '请输入',
            key: 'msg'
          },
          {
            cType: Button,
            child: '发送',
            onClick:()=>{
              const {validateFields} = form;
              validateFields().then(values=>{
                console.log(values)
                client.send(values.msg)
              })
            }
          }
        ]}
      /> */}
    {/* <Card style={{
      maxHeight: 500,
      overflow: 'scroll'
    }}>
      
      {
        msgCache.map((msg,ind)=>{
          return (<div>
 
            <Comment
              className="chat-comment"
              author={<a>{msg.userName||'游客'}</a>}
              avatar={
                <Avatar
                  src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                  alt="Han Solo"
                />
              }
              content={
                <p style={{textAlign: msg.type===2?'left':'right'}}>
                  {msg.text}
                </p>
              }
              datetime={
                <Tooltip title={moment().format('YYYY-MM-DD HH:mm:ss')}>
                  <span>{moment().fromNow()}</span>
                </Tooltip>
              }
            />
            </div>)
        })
      }
      <p  ref={bRef}></p>
    </Card> */}
    <Chat  
      chatGroups={[
        {
          id: 1,
    
        },
        {
          id: 2,
    
        },
      ]}
      users={[
        {
          id: 1
        }
      ]}
      chatMessages={[
        {
          sentAt: 123,
        },
        {
          sentAt: 123,
        },
        {
          sentAt: 123,
        },
      ]}
      // selectedGroup={{
      //   id: 2
      // }}
      chatTitle="在线-online"
      typing="正在输入"
      onGroupChange={(e)=>{
        console.log(e)
      }}
      // onKeyPress={(e)=>{
      //   if(e.keyCode === 13) {
      //     // emit 
      //     e.preventDefault();
      //   } else {
      //     console.log(client)
      //     // client.send('typing')
      //   }
      // }}
    />
    </div>)
}