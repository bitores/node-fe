
const moment = require('moment');


export default (config, app)=>{
  const redis = require('redis').createClient();
  const realTimeLog = {
    push: async (...args)=>{
      redis.rpush('real-time-log', ...args)
      redis.ltrim('real-time-log', -100, -1)
    },
    latestLog: async ()=>{
      return new Promise((resolve, reject)=>{
        redis.lrange('real-time-log', -100, -1, (err, res)=>{
          if(err) {
            reject(err)
          } else {
            resolve(res);
          }
        });
      }).catch(e=>{})
    }
  }

  //
  realTimeLog.push(`${moment().format("YYYY-MM-DD HH:mm:ss")} - 重启服务器`)
  
  app.context.realTimeLog = realTimeLog;
  app.context.pushTimeLog = (...args)=>{
    realTimeLog.push(...args.map(arg=>`${moment().format("YYYY-MM-DD HH:mm:ss")} - ${arg}`))
  }

  return async (ctx, next)=>{
    // ctx.realTimeLog = realTimeLog;
    await next();
  }
}