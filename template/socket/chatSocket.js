import IOSocket from 'socket.io';
import JWT from 'socketio-jwt';

export default (app,  server)=>{


  const io = IOSocket(server,{
    path: '/chat',
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

  // const md = (socket, next)=>{
  //   return next(new Error('Authentication error'))
  // }

  // io.use((socket, next)=>{

  //   // md(socket, next);
  //   // .on('error',(e)=>{
  //   //   console.log(e)
  //   //   next('---=======');
  //   // })
  //   return next(new Error('Authentication error'))
  // })

  // io.on('error',(err)=>{
  //   console.log(err)
  //   // if (socket) {
  //   //     socket.end();
  //   //     socket.destroy();
  //   // }
  // })

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

  io.sockets.on('echo', (m) => {
    io.sockets.emit('echo-response', m);
  });
  
  const onlineusers = [];
  io.on('connection', client => { //此处每个回调socket就是一个独立的客户端，通常会用一个公共列表数组统一管理      
    console.log(`hello! ${JSON.stringify(client.decoded_token)}`);
    console.log(client.id, io.of('/').clients)
    console.log('io.sockets.adapter.rooms:',io.sockets.adapter.rooms)

    // let ip='';
    // if(client.handshake.headers['x-forwarded-for'] != null){
    //   ip = client.handshake.headers['x-forwarded-for'];
    // }else{
    //     ip = client.handshake.address;
    // }
    // console.log(client.request.connection.remoteAddress  )

    const Index = onlineusers.findIndex(user=>user.name===client.decoded_token.name);
    if(Index!==-1) {

      onlineusers.splice(Index,1)
    }

    onlineusers.push({
      id: client.id,
      ...client.decoded_token
    })

    
    // 指定房间内在线用户
    client.on('get-all-users', (room)=>{
      io.in(room).clients((err,  clients)=>{
        console.log('所有:', clients)

        const users = clients.map(c=>{
          console.log(onlineusers, c.id)
          return onlineusers.find(user=>user.id===c)
        })

        client.emit('onlineusers', users);
      })

      // client.emit('onlineusers', onlineusers);

    })

    // 加入的分组
    client.on('get-my-rooms', ()=>{

      client.emit('chatgroups', client.rooms);
    })
    
    client.join('playground')
    io.to('playground').emit('message', {
      type: "sys",// 1自己 2别人
          content: '有人加入',
          sentAt: new Date()
    })
    //发送给自己的消息
    // client.emit('message', {
    //   userName: client.decoded_token.name,
    //   type: 1,// 1自己 2别人
    //   text: `上线了`
    // });

    client.broadcast.emit('useronline', client.decoded_token);
    
    // 连接断开，如关闭页面时触发
    client.on('disconnect', function() {
        console.log('已断开链接');
        client.broadcast.emit('useroffline', client.decoded_token);
    });

    // 监听客户端发送的消息
    client.on('message', async (room, data="") => {
        //推送给除自己外其他所有用户的消息，类似于广播
        const [{values:{text}}] = await app.context.replay(data);
        console.log('message', text)
        client.broadcast.in(room).emit('message', {
          senderName: client.decoded_token.name,
          from: 2,// 1自己 2别人
          content: data,
          sentAt: new Date()
        });
        client.emit('message', {
          senderName: client.decoded_token.name,
          from: 1,// 1自己 2别人
          content: data,
          sentAt: new Date()
        });
        client.emit('message', {
          senderName: client.decoded_token.name,
          from: 2,// 1自己 2别人
          content: text,
          sentAt: new Date()
        });
    });


    client.on('typing', ()=>{
      client.broadcast.emit('typing', client.decoded_token);
    })
    
  })

  app._io = io;
  app.context._io = io;
}