import {
  Controller,
  Get,
  Post,
  Middleware
} from 'bitorjs-decorators';
const fs = require('fs');
const path = require('path');

@Controller('/public/log')
export default class {
  // 防盗链
  @Get('/list')
  async list(ctx, next){
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

  @Get('/*')
  async default(ctx){
    ctx.body = '暂无日志'
  }
}