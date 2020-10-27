import React, { useEffect, useMemo, useState, useRef } from 'react';
import Player from 'aliplayer-react';
import { Button, Card, Input, message } from 'antd';
import WSocket from 'socket.io-client';
import {Form} from 'react-antd-super-form';

import './index.less';
import { PhoneOutlined } from '@ant-design/icons';

export default (props)=>{
  const [filmSource, setFilmSource] = useState("http://vjs.zencdn.net/v/oceans.mp4");//https://sdk.fantasy.tv/hc.mp4https://player.alicdn.com/video/aliyunmedia.mp4
  const [filmInstance, setFilmInstance] = useState(null);
  const [pcInstance, setPcInstance] = useState(null);
  const [socketClient, setSocketClient] = useState(null);
  const [isConected, setIsConnected]  = useState(false);

  const saveRemotes = useRef();
  const sendOfferFn = useRef();
  saveRemotes.current = (remote)=>{
    setRemotes([
      ...remotes,
      remote
    ])
  }

  const playerRef = useRef();

    useEffect(()=>{
      // 与信令服务器的WebSocket连接
      const client = WSocket('wss://192.168.1.103:1030',{
        path:'/chat/p2p',
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

      setSocketClient(client)

      client.on('error', function(data){
        console.log(data + ' - error'); //reconnect_error
      })

      client.on('connect', function(){

        client.emit('join-room', props.match.params.roomId);

        // stun和turn服务器，公共stun服务器
        var iceServer = {
          iceServers: [
            {urls: "stun:stun.services.mozilla.com"}
          ], 
          sdpSemantics:'plan-b'
        };

        const RTCPeerConnection = window.RTCPeerConnection||window.webkitRTCPeerConnection;
        // 创建PeerConnection实例 (参数为null则没有iceserver，即使没有stunserver和turnserver，仍可在局域网下通讯)
        var pc = new RTCPeerConnection(iceServer);

        setPcInstance(pc)

        // 发送ICE候选到其他客户端
        pc.onicecandidate = function(event){
            console.log('1发送ICE候选到其他客户端', event)
            if (event.candidate !== null) {
              client.emit('message',JSON.stringify({
                    "event": "_ice_candidate",
                    "data": {
                        "candidate": event.candidate
                    }
                }));
            }
        };

        // 如果检测到媒体流连接到本地，将其绑定到一个video标签上输出
        pc.onaddstream = function(e){
          // saveRemotes.current(event)
          try {
            document.getElementById('remoteVideo').src = URL.createObjectURL(e.stream);//老版
          } catch (error) {
            document.getElementById('remoteVideo').srcObject = (e.stream); //新版
          }
          setIsConnected(true)
        };
        
        const sendAnswerFn = function(desc){
            console.log('anser...')
            pc.setLocalDescription(desc);
            client.emit('message',JSON.stringify({ 
                "event": "_answer",
                room: props.match.params.roomId,
                "data": {
                    "sdp": desc
                }
            }));
        };

        client.on('limitUser', res=>{
          message.error('聊天室没有其它人了')
        })

        client.on('filmUpdate', res=>{
          var json = JSON.parse(res);
          console.log(json.url)
          setFilmSource(json.url)
          playerRef.current.loadByUrl(json.url);
          playerRef.current.play();
        })

        //处理到来的信令
        client.on('message', res=>{
          console.log('----',res)
          var json = JSON.parse(res);
          //如果是一个ICE的候选，则将其加入到PeerConnection中，否则设定对方的session描述为传递过来的描述
          if( json.event === "_ice_candidate" ){
            console.log('====')
              pc.addIceCandidate(new RTCIceCandidate(json.data.candidate));
          } else {
              console.log('--==-=--=-=-=')
              pc.setRemoteDescription(new RTCSessionDescription(json.data.sdp));
              // 如果是一个offer，那么需要回复一个answer
              if(json.event === "_offer") {
                  pc.createAnswer(sendAnswerFn, function (error) {
                      console.log('Failure callback: ' + error);
                  });
              }
          }
        })

        // 获取本地音频和视频流
        navigator.webkitGetUserMedia({
          "audio": true,
          "video": true
        }, function(stream){
            //绑定本地媒体流到video标签用于输出
            try {
                document.getElementById('localVideo').src = URL.createObjectURL(stream);//老版
            } catch (error) {
                document.getElementById('localVideo').srcObject = (stream); //新版
            }
            //向PeerConnection中加入需要发送的流
            pc.addStream(stream);
            //如果是发起方则发送一个offer信令
        }, function(error){
            //处理媒体流创建失败错误
            console.log('getUserMedia error: ' + error);
        });
      })
    },[])

    // useEffect(()=>{
    //   socket
    // },[socketClient, filmInstance])

    const config = useMemo(()=>({
      // source: "//player.alicdn.com/video/aliyunmedia.mp4",
      // source: "http://localhost:8088/live/test.flv?sign=1629689121-a74dd2834e84772d59031a59c393ae85",
      source: filmSource,
      width: "100%",
      // height: "500px",
      autoplay: true,
      isLive: false,
      rePlay: false,
      playsinline: true,
      preload: true,
      controlBarVisibility: "hover",
      useH5Prism: true,
      components: [
          {
              name: "RateComponent",
              type: Player.components.RateComponent,
          }
      ]
  }),[filmSource])

  console.log('config', config.source, filmSource)
  return <div className="webrtc-container">
    <Card className="left">
      <div className="film">
      <Player
            config={config}
            onGetInstance={instance => {
              console.log('palyer', instance)
              playerRef.current = instance;
              instance.mute();
            }}
        />
      </div>
      <div>
        <Form 
          // layout="inline"
          data={(form, getValues)=>[
            {
              label: '电影名称',
              cType: Input.Search,
              key: 'url',
              placeholder:'https://player.alicdn.com/video/aliyunmedia.mp4',
              config:{
                rules:[
                  {
                    required: true,
                  }
                ]
              },
              enterButton:'更新电影',
              onSearch:()=>{

                getValues().then(({url})=>{

                  socketClient.emit('filmUpdate', JSON.stringify({
                    room: props.match.params.roomId,
                     url
                  }))
                })
              }
            },
            // {
            //   cType: Button,
            //   child: 
            //   type: 'primary',
            //   onClick:()=>{
                
                
            //   }
            // }
          ]}
        />
      </div>
      <div className="member">
        <div className="local">
          <video id="localVideo" muted autoPlay/>
        </div>
        {
          isConected&&<Button className="callsome" danger icon={<PhoneOutlined rotate style={{color: 'green'}}/>} onClick={()=>{
            pcInstance.close()
            setIsConnected(false)
          }}>
             挂电话
          </Button>
        }
        {
          !isConected&&<Button className="callsome" type="primary" icon={<PhoneOutlined rotate style={{color: 'green'}}/>} onClick={()=>{
       
                  if(pcInstance.signalingState!=='closed') {
                    pcInstance.createOffer(function(desc){
                      console.log('emit message....')
                      pcInstance.setLocalDescription(desc);
                      socketClient.emit('message',JSON.stringify({ 
                          "event": "_offer",
                          room: props.match.params.roomId,
                          "data": {
                              "sdp": desc
                          }
                      }));
                    }, function (error) {
                      console.log('Failure callback: ' + error);
                    });
                  } 
                  
          }}>
            打电话
          </Button>
        }
        
        <div className="local">
          <video id="remoteVideo" muted autoPlay/>
        </div>
      </div>
    </Card>
    <div className="right">right</div>
  <div></div>
</div>
}