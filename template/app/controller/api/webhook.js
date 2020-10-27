import {
  Controller,
  Post,
  Middleware
} from 'bitorjs-decorators';
const moment = require('moment');


@Controller('/webhook')
export default class {
  constructor(params){

  }

  @Post('/gitlab')
  @Middleware('GitlabPushEvent')
  async gitlab(ctx, next){
    ctx.info('gitlab webhook')
    try {
      // 构建
      await this.createJob(ctx)
      ctx.success();
    }catch(err) {
      ctx.error("失败 catch gitlab", err);
      ctx.fail("构建失败");
    }
  }

  @Post('/bitbucket')
  @Middleware('BitbucketPushEvent')
  async bitbucket(ctx, next){
    ctx.info('bitbucket webhook')
    try {
      // 构建
      await this.createJob(ctx)
      
      ctx.success();
    }catch(err) {
      ctx.error("失败 catch bitbucket", err);
      ctx.fail("构建失败");
    }
  }

  async createJob(ctx){
    const queueData = await ctx.queue.checkHealth();
    ctx.queue.createJob({
      args: ctx.buildArgs,
      record: ctx.record,
      isTag: ctx.isTag,
    }).retries(3).save().then((job) => {
      console.log(`Saved job ${job.id}`);
      // ctx.realTimeLog.push('新的任务进来')
      const obj= job.data;
      console.log(queueData)
      ctx.realTimeLog.push(`${moment().format("MM-DD HH:mm:ss")} -【${obj.record.projectName} ${obj.record.tag}, by ${obj.record.actor}】：Job${job.id} 进入任务队列，前面还有 ${queueData.waiting+queueData.active} 个任务`)
    })
  }
}