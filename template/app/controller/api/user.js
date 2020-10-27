import {
  Controller,
  Get,
  Post,
  Put,
  Middleware
} from 'bitorjs';

@Controller('/user')
export default class {

  @Get('/getAuthority')
  async getAuthority(ctx, next) {
    const userParams = ctx.getUser();
    const sysName = ctx.header['sys-name'];
    const entry = await ctx.$service.user.getUserRole({username: userParams.name, password: userParams.passwd, sysname: sysName});

    if(entry){
      ctx.success(entry)
    } else {
      ctx.fail()
    }
  }

  @Get("/list")
  async list(ctx, next) {
    const entry = await ctx.$service.user.getUserList(ctx.request.query);

    if(entry){
      ctx.success(entry)
    } else {
      ctx.fail()
    }
  }

  @Post("/add")
  async add(ctx, next) {
    const entry = await ctx.$service.user.add(ctx.request.body);

    if(entry){
      ctx.success(entry)
    } else {
      ctx.fail()
    }
  }

  @Post("/edit")
  async edit(ctx, next) {
    const entry = await ctx.$service.user.edit(ctx.request.body);

    if(entry){
      ctx.success(entry)
    } else {
      ctx.fail()
    }
  }

  @Post("/del")
  async del(ctx, next) {
    const entry = await ctx.$service.user.del(ctx.request.body);

    if(entry){
      ctx.success(entry)
    } else {
      ctx.fail()
    }
  }

}