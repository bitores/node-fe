const Queue = require('bee-queue');
const execFile = require('child_process').execFile; 
const moment = require('moment');
// 构建任务队列
export default (config, app)=>{


  const queue = new Queue("fe-build",{
    prefix: 'fe-build',
    stallInterval: 5000,
    nearTermWindow: 1200000,
    delayedDebounce: 1000,
    redis: {
      host: '127.0.0.1',
      port: 6379,
      db: 0,
      options: {}
    },
    isWorker: true,
    getEvents: true,
    sendEvents: true,
    storeJobs: true,
    ensureScripts: true,
    activateDelayedJobs: false,
    removeOnSuccess: true,
    removeOnFailure: false,
    redisScanCount: 100
  });


  queue.on('ready', async () => {
      console.log('queue now ready to start doing things');
      const queueData = await queue.checkHealth();
      console.log(queueData)
      // queue.ctx.realTimeLog.push(`${moment().format("YYYY-MM-DD HH:mm:ss")} - 队列中还有 ${queueData.waiting+queueData.active} 个任务`)

      queue.process(async (job, done) => {
        const ctx = queue.ctx;
        const queueData = await ctx.queue.checkHealth();
        const obj = job.data;
        ctx.info("开始构建新任务，参数", obj);
        const format = "MM-DD HH:mm:ss";
        const  flag = `【${obj.record.projectName} ${obj.record.tag}, by ${obj.record.actor}】:Job${job.id} `;
        ctx.realTimeLog.push(`${moment().format(format)} -${flag}开始构建, 后面还有 ${queueData.waiting} 个任务`)
        // ctx.realTimeLog.push("开始构建新任务，参数", JSON.stringify(obj))
        await new Promise((resolve, reject)=>{
          ctx.info("执行脚本：start")
          ctx.realTimeLog.push(`${moment().format(format)} -${flag}执行脚本 start`)

          const child = execFile(`${process.cwd()}/shell/build.sh`, obj.args, {}, (err, stdout, stderr)=>{
            ctx.info('脚本执行：end')
            // console.log(stdout)
            // ctx.realTimeLog.push(`常规输出 ${stdout}`)
            ctx.realTimeLog.push(`${moment().format(format)} -${flag}执行脚本 end`)
            if(err) {// Error{name, message, stack}
              ctx.error(`${moment().format(format)} -【${obj.record.projectName} ${obj.record.tag}】execFile err`)
              // ctx.realTimeLog.push(`${moment().format(format)} -${flag}execFile err`)
              return reject(err)
            } 

            if(stderr&&(/ERR/i.test(stderr))) {//string: shell 中的 git error | npm error:安装包出错，build 出错等
              ctx.error(`${moment().format(format)} -${flag}execFile stderr`)
              // ctx.realTimeLog.push(`${moment().format(format)} -${flag}execFile stderr`)
              return reject(stderr);
            }

            resolve(obj.record)
          })

          child.stdout.on('data',(chunk)=>{
            // console.log("from data",chunk)
            ctx.realTimeLog.push(`${moment().format(format)} -${flag}Progressing：${chunk}`)
          })
        })
        
        .then(async res=>{
          done();
          ctx.info(`${moment().format(format)} -${flag}构建成功`)
          ctx.realTimeLog.push(`${moment().format(format)} -${flag}构建成功`)

          if(obj.isTag) { //
            // 备份
            ctx.info(`${moment().format(format)} -${flag}备份数据`)
            ctx.realTimeLog.push(`${moment().format(format)} -${flag}备份数据中`)

            // 数据库记录信息
            ctx.info(`${moment().format(format)} -${flag}提交数据到数据库`)
            await ctx.$service.feps.addbuild({
              build_man: res.actor,
              tag: res.tag,
              name: res.projectName
            });
            ctx.realTimeLog.push(`${moment().format(format)} -${flag}数据成功入库，待发布`)
          }
          
        }).catch(err=>{
          done(err);
          ctx.error(`${moment().format(format)} -${flag}构建失败`, err)
          ctx.realTimeLog.push(`${moment().format(format)} -${flag}构建失败：`,err)
        })

      });
    });

    app.context.queue = queue;
    // queue.ctx = app.context;
  return async (ctx, next)=>{

    
    queue.ctx = ctx;
    // ctx.queue = queue;

    await next();
  }
}