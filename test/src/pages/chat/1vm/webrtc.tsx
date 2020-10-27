import React, { useEffect, useMemo, useState, useRef } from 'react';
import Player from 'aliplayer-react';
import { Button, Card } from 'antd';
import WSocket from 'socket.io-client'

import './webrtc.less';

function SrcObjectVideo({ srcObject }){
  const ref = React.useRef();
  React.useEffect(() => {
    ref.current.srcObject = srcObject;
  }, [srcObject]);
  return <video ref={ref} autoPlay muted/>
}

export default ()=>{
  const [filmSource, setFilmSource] = useState("");
  const [instance, setInstance] = useState(null);
  const [remotes, setRemotes] = useState([])

  const saveRemotes = useRef();
  saveRemotes.current = (remote)=>{
    setRemotes([
      ...remotes,
      remote
    ])
  }

  // useEffect(()=>{
  //   remoteRef.current = remotes;
  // },[remotes])

  useEffect(()=>{
    // 与信令服务器的WebSocket连接
    const client = WSocket('wss://192.168.1.101:1030',{
      path:'/video',
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

    client.on('connect', function(){

      // stun和turn服务器，公共stun服务器
      var iceServer = {
        iceServers: [{urls: "stun:stun.services.mozilla.com"}], 
        sdpSemantics:'plan-b'
        // "iceServers": [{
        //     // "url": "stun:stun.l.google.com:19302"
        //     "urls": "stun:stun.voipstunt.com"
        //   }, 
          
        //   // {
        //   //     "url": "turn:numb.viagenie.ca",
        //   //     "username": "webrtc@live.com",
        //   //     "credential": "muazkh"
        //   // }
      
        // ]
      };

      const RTCPeerConnection = window.RTCPeerConnection||window.webkitRTCPeerConnection;
      // 创建PeerConnection实例 (参数为null则没有iceserver，即使没有stunserver和turnserver，仍可在局域网下通讯)
      var pc = new RTCPeerConnection(iceServer);

      // 发送ICE候选到其他客户端
      pc.onicecandidate = function(event){
          console.log('发送ICE候选到其他客户端', event)
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
      pc.onaddstream = function(event){

        saveRemotes.current(event)

      };

      // 发送offer和answer的函数，发送本地session描述
      const sendOfferFn = function(desc){
        pc.setLocalDescription(desc);
        client.emit('message',JSON.stringify({ 
            "event": "_offer",
            "data": {
                "sdp": desc
            }
        }));
      }
      const sendAnswerFn = function(desc){
          pc.setLocalDescription(desc);
          client.emit('message',JSON.stringify({ 
              "event": "_answer",
              "data": {
                  "sdp": desc
              }
          }));
      };

      //处理到来的信令
      client.on('message', res=>{
        console.log(res)
        var json = JSON.parse(res);
        console.log('onmessage: ', json);
        //如果是一个ICE的候选，则将其加入到PeerConnection中，否则设定对方的session描述为传递过来的描述
        if( json.event === "_ice_candidate" ){
            pc.addIceCandidate(new RTCIceCandidate(json.data.candidate));
        } else {
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
          // 
          
          //向PeerConnection中加入需要发送的流
          pc.addStream(stream);
          //如果是发起方则发送一个offer信令
          // if(isCaller){
              pc.createOffer(sendOfferFn, function (error) {
                  console.log('Failure callback: ' + error);
              });
          // }
      }, function(error){
          //处理媒体流创建失败错误
          console.log('getUserMedia error: ' + error);
      });
    })


    



    
    // var socket = new WebSocket("wss://192.168.1.101:3010");


    
  },[])

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


  return <div className="webrtc-container">
    <Card className="left">
      <div className="film">
      <Player
            config={config}
            onGetInstance={instance => setInstance(instance)}
        />
        {/*  */}
      </div>
      <div className="member">
        <div className="local">
          <video id="localVideo" muted autoPlay/>
        </div>
        {
          remotes.map((e, ind)=>{
            return (<div key={ind} className="remote">
              <SrcObjectVideo srcObject={e.stream}></SrcObjectVideo>
            </div>)
          })
        }
      </div>
    </Card>
    {/* <div>left</div> */}
    <div className="right">right</div>
  {/* <Button>进入聊天室</Button> */}
  <div></div>
</div>
}