import IOSocket from 'socket.io';
import JWT from 'socketio-jwt';
// import {ExpressPeerServer} from 'peer';

export default (app,  server)=>{


  const io = IOSocket(server,{
    path: '/chat/p2p',
    handlePreflightRequest: (req, res) => {
        const headers = {
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Origin": req.headers.origin, //or the specific origin you want to give access to,
            "Access-Control-Allow-Credentials": true
        };
        res.writeHead(200, headers);
        res.end();
    }
  })

 

  io.use(JWT.authorize({
    secret: app.$config.jwt.secret,
    handshake: true,
    auth_header_required: true
  }))

  io.on('authenticated', (socket) => {
    console.log("authenticated"); // new decoded token
  });

  io.on('unauthorized', (socket) => {
    console.log("unauthorized"); // new decoded token
  });

  // io.sockets.on('echo', (m) => {
  //   io.sockets.emit('echo-response', m);
  // });
  
  const onlineusers = [];
  io.on('connection', client => { //此处每个回调socket就是一个独立的客户端，通常会用一个公共列表数组统一管理      
    console.log('video 已链接');

    client.on('join-room', roomId=>{
      client.join(roomId);
    })
    
    // 连接断开，如关闭页面时触发
    client.on('disconnect', function() {
        console.log('已断开链接');
        // client.broadcast.emit('useroffline', client.decoded_token);
    });

    client.on('filmUpdate', data=>{
      console.log('offer...')
      const json = JSON.parse(data);
      io.sockets.in(json.room).emit('filmUpdate', data);
    })

  

    // 监听客户端发送的消息
    client.on('message',  data => {
        //推送给除自己外其他所有用户的消息，类似于广播
        console.log('message p2p', data)
        const json = JSON.parse(data);
        if(io.sockets.in(json.room).clients().length<2){
          client.broadcast.emit('limitUser', data);
        } else {
          client.broadcast.emit('message', data);
        }
        
    });
    
  })

  app._p2pio = io;
  app.context._p2pio = io;
}