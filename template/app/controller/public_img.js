import {
  Controller,
  Get,
  Post,
  Middleware
} from 'bitorjs-decorators';
const fs = require('fs');
const path = require('path');

@Controller('/public/img')
export default class {
  // 防盗链
  @Get('/test')
  async test(ctx, next){
    console.log(ctx.request.query)
    // 直接访问 ctx.request.header.referer为空，但
    if(ctx.request.header.referer) {
      var s=ctx.request.header.referer.split('://')[1]
      
      if(s.includes(ctx.request.host)){
        var data=null;
        data=fs.createReadStream(path.join(process.cwd(),'public','1-1@3x.png')); 
      }else{
        var data=null;
        data=fs.createReadStream(path.join(process.cwd(),'public','1-2@3x.png'));
      }
    }

    ctx.body=data
  }

  @Get('/show/:imgname')
  async show(ctx, next){
    console.log(ctx.params)
    // 直接访问 ctx.request.header.referer为空，但
    var data=null;
    if(ctx.request.header.referer) {
      var s=ctx.request.header.referer.split('://')[1]
      
      if(s.includes(ctx.request.host)){
        data=fs.createReadStream(path.join(process.cwd(),'public',ctx.params.imgname)); 
      }
    }

    if(data===null) {
      data=fs.createReadStream(path.join(process.cwd(),'public','1-2@3x.png'));
    }

    ctx.body=data
  }

  @Get('*')
  async c(ctx, next) {
    // ctx.redirect('/');
    return ctx.body = '无数据'
  }
}