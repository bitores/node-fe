import {
  Controller,
  Get,
  Post,
  Put,
  Middleware
} from 'bitorjs';

@Controller('/menu')
export default class {
  @Get('/side')
  async side(ctx, next){
    const entry = await ctx.$service.menu.side(ctx.request.query);
    if(entry){
      ctx.success(entry)
    } else {
      ctx.fail()
    }
  }
  @Get("/list")
  async list(ctx, next) {
    const entry = await ctx.$service.menu.list(ctx.request.query);
    if(entry){
      ctx.success(entry)
    } else {
      ctx.fail()
    }
  }

  @Post("add")
  async add(ctx, next) {
    const entry = await ctx.$service.menu.add(ctx.request.body);

    if(entry){
      ctx.success(entry)
    } else {
      ctx.fail()
    }
  }

  @Post("edit")
  async edit(ctx, next) {
    const entry = await ctx.$service.menu.edit(ctx.request.body);

    if(entry){
      ctx.success(entry)
    } else {
      ctx.fail()
    }
  }

  @Post("del")
  async del(ctx, next) {
    const entry = await ctx.$service.menu.del(ctx.request.body);

    if(entry){
      ctx.success(entry)
    } else {
      ctx.fail()
    }
  }
 
}