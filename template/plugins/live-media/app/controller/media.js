import {
  Controller,
  Get,
  Post,
  Put,
  Middleware
} from 'bitorjs';
const _ = require('lodash');
import NodeFlvSession from '../../src/node_flv_session';


@Controller('/')
export default class {

  @Get('/live/test.flv')
  async getFlv(ctx, next){
    console.log('.........flv')

    ctx.status = 200;
    return new Promise(()=>{
      let session = new NodeFlvSession({}, ctx.req, ctx.res);
      session.run();
    })
    
    // 
    // ctx.status = 200;
    
    // ctx.set('transfer-encoding', 'chunked')
    // ctx.success()
    // next()
    // sleep(20000);
    // try {
    //   await new Promise((rev)=>{
      
    //   setTimeout(()=>rev(), 50000)
    // })
    // } catch (err) {
    //   console.log(err)
    // }
  }

  @Get('/live/test2.flv')
  async getFlv2(ctx, next){
    const res = ctx.res;
    ctx.status = 200;
    ctx.set("Content-type","text/html;charset=utf-8")
    res.write(`koa 异步 chunked 块传输<br/>`)
    return new Promise((resolve)=>{
      let i = 0;
      let timer = setInterval(()=>{
        if(i++>4) {
          clearInterval(timer);
          resolve()
          res.end();
        } else {
          res.write(`${i}<br/>`)
        }
      },2000)
    })
  }

  @Get('/media/reply')
  async getStreams(ctx, next){
    let stats = {};

    this.sessions.forEach(function (session, id) {
      if (session.constructor.name !== 'NodeRelaySession') {
        return;
      }

      let { app, name } = session.conf;

      if (!_.get(stats, [app, name])) {
        _.set(stats, [app, name], {
          relays: []
        });
      }

      _.set(stats, [app, name, 'relays'], {
        app: app,
        name: name,
        url: session.conf.ouPath,
        mode: session.conf.mode,
        id: session.id,
      });
    });

    res.json(stats);
  }

  @Post('/media/reply/pull')
  async pullStream(ctx, next){
    const {url, app, name} = ctx.request.body;
   
    if (url && app && name) {
      this.nodeEvent.emit('relayPull', url, app, name);
      // res.sendStatus(200);
      ctx.success();
    } else {
      // res.sendStatus(400);
      ctx.fail();
    }
  }

  @Post('/media/reply/push')
  async pushStream(ctx, next){
    const {url, app, name} = ctx.request.body;

    if (url && app && name) {
      this.nodeEvent.emit('relayPush', url, app, name);
      // res.sendStatus(200);
      ctx.success();
    } else {
      // res.sendStatus(400);
      ctx.fail();
    }
  }

  @Get('/media/*')
  async defs(ctx){
    ctx.body = 'not found'
  }
}