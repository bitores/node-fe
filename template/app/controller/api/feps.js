import {
  Controller,
  Get,
  Post,
  Put,
  Middleware
} from 'bitorjs';
const moment = require('moment');

@Controller('/feps')
export default class {

  @Get("/products")
  async products(ctx, next) {
    const entry = await ctx.$service.feps.getProducts(ctx.request.query);
    if(entry){
       ctx.success(entry)
    }  else ctx.fail()
  }

  @Get("/build/list")
  async build_list(ctx, next) {
    // console.log(ctx.response.body)
    // ctx.robot.text("测试列表",[])
    const entry = await ctx.$service.feps.getProductBuild(ctx.request.query);
    if(entry){
      ctx.success(entry)
    }  else ctx.fail()

  }


  @Post("deploy")
  async deploy(ctx, next) {
    // 移动文件到生产环境 -- upload 当前构建版本 到 oss
    const record = await ctx.$service.feps.getBuildRecord(ctx.request.body);
    const srcDir = `${ctx.$config.deployDir}/prod/${record.getDataValue("productName")}/${record.tag}`;
    const format = "MM-DD HH:mm:ss";
    const  flag = `【${record.getDataValue("productName")} ${record.tag}, by ${ctx.getUser().name}】`;
    

    try{
      ctx.realTimeLog.push(`${moment().format(format)} -${flag}开始发布`)
      await ctx.upOssDir(`prod/${record.getDataValue("productName")}`, srcDir);

      if(record) {
        // 操作发布结果数据
        const entry = await ctx.$service.feps.deploy(ctx.request.body, ctx.getUser());

        if(entry){
          ctx.realTimeLog.push(`${moment().format(format)} -${flag}发布成功`)
          ctx.success(entry)
          return;
        } else ctx.fail("发布状态更新失败")

      } else ctx.fail("未找到指定的构建的版本")

      ctx.realTimeLog.push(`${moment().format(format)} -${flag}发布失败`)
    } catch(e){
      ctx.realTimeLog.push(`${moment().format(format)} -${flag}发布失败`)
      ctx.fail("部署时文件上传失败")
    }
  }

  @Post("addbuild")
  async addbuild(ctx, next) {
    const entry = await ctx.$service.feps.addbuild(ctx.request.body);

    if(entry){
      ctx.success(entry)
    } else ctx.fail()
  }

  @Get("/logs/list")
  async getProductLog(ctx, next) {
    const entry = await ctx.$service.feps.getProductLog(ctx.request.query);

    if(entry){
      ctx.success(entry)
    } else ctx.fail()
  }
}