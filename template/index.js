import KoaAppliction from 'bitorjs/koa';
import koaBody from 'koa-body'; //koa-bodyparser内置Request Body的解析器, 支持x-www-form-urlencoded, application/json等格式的请求体，但不支持form-data的请求体,，需要借助 formidable 这个库，也可以直接使用 koa-body 支持multipart，urlencoded和json请求体
import koaStatic from 'koa-static'; // 配置静态文件服务的中间件
import staticCache from 'koa-static-cache';
import koaJWT from 'koa-jwt'; //JWT(Json Web Tokens)
import koaHelmet from 'koa-helmet'; //增加如Strict-Transport-Security, X-Frame-Options, X-Frame-Options等网络安全HTTP头
import koaCompress from 'koa-compress'; // 启用类似Gzip的压缩技术减少传输内容
import koaCors from 'koa2-cors';
import koaValidator from 'koa-middle-validator';
import path from 'path';
import logger from '@/middleware/logger';
import JWT from '@/middleware/jwt';
import Oss from '@/middleware/oss-alibaba';
import Robot from '@/middleware/robot-wechat';
import BuildQueue from '@/middleware/build-queue';
import LogQueue from '@/middleware/log-queue';
import Schedule from '@/middleware/schedule';
import RobotTuring from '@/middleware/robot-turing';
import ChatSocket from './socket/chatSocket';
import VideoSocket from './socket/videoSocket';
import PeerSocket from './socket/peerSocket';
import P2PSocket from './socket/p2pSocket';

const config = require('./config/index.env.js');

const _ = require('lodash')
const validator = require('validator')

const getUploadFileExt = require('./utils/getUploadFileExt');
const getUploadFileName = require('./utils/getUploadFileName');
const checkDirExist = require('./utils/checkDirExist');
const getUploadDirName = require('./utils/getUploadDirName');

const app = new KoaAppliction();
app.watch(require.context("./config", true, /.*\.js$/))
app.watch(require.context("./app", true, /.*\.js$/));




let client = app => {
  app.on('error', async (err, ctx) => {
    if (401 == err.status) {
      ctx.fail('无权限', 401)
    } else {
      throw err;
    }
  })
  
  app.use(async (ctx, next) => {
    // 错误处理
    try{
      await next()
    }catch(err){
      if (401 == err.status) {
        ctx.fail('登录过期',100001 )
      } else {
        throw err;
      }
    }

  });

  app.use(async (ctx, next)=>{
    // 添加操作方法
    ctx.success = (entry, other={
      code:0, //  0 操作成功，其它码为操作失败的码
      message: 'success',
    }) =>{
      ctx.status = 200;
      ctx.body = {
        status: true,
        entry,
        ...other,
      }
    }

    ctx.fail = (message="fail",code=-1) => {

      ctx.status = 200;
      ctx.body = {
        status: false,
        code,
        message,
      }
    }

    await next();
  })
  app.use(LogQueue({}, app));
  app.use(BuildQueue({}, app));
  app.use(Schedule({}, app))
  app.use(logger(app.$config.logger));
  app.use(JWT(app.$config.jwt));
  app.use(Oss(app.$config.oss));
  app.use(Robot(app.$config.robot));
  app.use(RobotTuring(app))

  app.use(koaValidator({
    errorFormatter: (param, message, value) => {
      return {
        param,
        message,
        value,
      }
    },
    customValidators: {
      isEmail: value => /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value),
      isMobile: value => /^1[3|4|5|7|8]\d{9}$/.test(value),
      isString: value => _.isString(value),
      isNumber: value => !isNaN(Number(value)),
      isObject: value => _.isObject(value),
      isJson: value => Object.prototype.toString.call(value).toLowerCase() === '[object object]',
      isArray: value => _.isArray(value),
      inArray: (param, ...args) => {
        const validatorName = args[0]
        return _.every(param, (item) => {
          switch (validatorName) {
            case 'isEmail': return /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(item)
            case 'isMobile': return /^1[3|4|5|7|8]\d{9}$/.test(item)
            case 'isString': return _.isString(item)
            case 'isNumber': return _.isNumber(item)
            case 'isObject': return _.isObject(item)
            case 'isArray': return _.isArray(item)
            case 'isBoolean':
              switch (typeof item) {
                case 'string': return item === 'true' || item === 'false'
                case 'boolean': return item === true || item === false
                default: return false
              }
            default:
              return validator[validatorName].call(this, item)
          }
        })
      },
      isBoolean: (value) => {
        switch (typeof value) {
          case 'string':
            return value === 'true' || value === 'false'
          case 'boolean':
            return value === true || value === false
          default:
            return false
        }
      },
      custom: (value, callback) => {
        if (typeof value !== 'undefined') {
          return callback(value)
        }
        return false
      },
    },
  })); // this line must be immediately after any of the bodyParser middlewares!
  



  // app.use(koaHelmet());
  app.use(koaCors({
    origin: function (ctx) {
      
      const whiteList = app.$config.allowOrigin;//; //可跨域白名单
      let url = ctx.request.headers.origin;
      if(url) {
        ctx.info(url);
      } else if(ctx.header.referer){
        url = ctx.header.referer.substr(0,ctx.header.referer.length - 1);
      }
      // console.log(url, app.$config)
      if(whiteList.includes(url)){
          return url //注意，这里域名末尾不能带/，否则不成功，所以在之前我把/通过substr干掉了
      }
      return 'http://localhost:8000';
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization', 'Refresh-Token'],
    maxAge: 5,///指定本次预检请求的有效期，单位为秒。
    credentials: true,// //是否允许发送Cookie
    allowMethods: app.$config.allowMethods,
    allowHeaders: app.$config.allowHeaders,
  }));
  
  app.use(koaCompress({
    // filter: function (content_type) {////只有在请求的content-type中有gzip类型，我们才会考虑压缩，因为zlib是压缩成gzip类型的
    //   return /text/i.test(content_type)
    // },
    threshold: 2048,////阀值，当数据超过2kb的时候，可以压缩
    flush: require('zlib').Z_SYNC_FLUSH
  }));

  
  app.use(koaStatic(app.$config.staticDir));
  //使用此方法拦截所有请求看token是否正确（此方法写在静态资源加载之后，不然静态资源不能访问）
  app.use(koaJWT({
    secret: app.$config.jwt.secret,
  }).unless({// 免登路由白名单
    path: app.$config.jwt.whiteList,
  }));
  app.use(async(ctx, next)=>{
    ctx.refreshToken();
    await next()
  })
  app.use(koaBody({
    multipart: true, // 支持文件上传
    // encoding: 'gzip',
    // jsonStrict: false, // for json
    parsedMethods: app.$config.allowMethods,
    formidable: {
      uploadDir: app.$config.uploadDir, // 设置文件上传目录
      keepExtensions: true, // 保持文件的后缀
      maxFieldsSize: 2 * 1024 * 1024, // 文件上传大小
      onFileBegin: (name, file) => { // 文件上传前的设置
        if (file.size === 0) return false;
        // 获取文件后缀
        const ext = getUploadFileExt(file.name);
        // 最终要保存到的文件夹目录
        const dirName = getUploadDirName();
        const dir = path.join(app.$config.uploadDir, `${dirName}`);
        // 检查文件夹是否存在如果不存在则新建文件夹
        checkDirExist(dir);
        // 获取文件名称
        const fileName = getUploadFileName(ext);
        // 重新覆盖 file.path 属性
        file.path = `${dir}/${fileName}`;
        // app.context.uploadpath = app.context.uploadpath ? app.context.uploadpath : {};
        // app.context.uploadpath[name] = `${dirName}/${fileName}`;
      },
      onError: (err) => {
        console.log(err);
      }
    }
  }));
  


}

// app.start(client, app.$config.port);
app.start(client, false);

// const server = require('http').Server(app.callback());
// const server = require('http').createServer(app.callback());
const server = require('https').createServer({
  key:require("fs").readFileSync(path.join(process.cwd(),'keys/key.pem')),
  cert:require("fs").readFileSync(path.join(process.cwd(),'keys/cert.pem'))
},app.callback());

// ChatSocket(app, server);
// VideoSocket(app, server);

// PeerSocket(app, server )
P2PSocket(app, server )

app.server  = server;

server.listen(app.$config.port)


