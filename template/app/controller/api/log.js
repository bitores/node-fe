import {
  Controller,
  Get,
  Post,
  Put,
  Middleware
} from 'bitorjs';


@Controller('/feps/log')
export default class {

  @Get("/day")
  async day(ctx, next) {

  }

  @Get("/week")
  async week(ctx, next) {

  }

  @Get("/month")
  async month(ctx, next) {

  }

  // season
  @Get("/season")
  async season(ctx, next) {

  }

  @Get("/real-time")
  async realTime(ctx, next) {
    const logs = await ctx.realTimeLog.latestLog();
    // console.log(logs)
    if(logs){
      ctx.success(logs)
    } else {
      ctx.fail('没有日志')
    }
    
  }

  @Post('/limit15')
  async limit15(){

  }

}