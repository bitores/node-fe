import {
  Controller,
  Get,
  Post,
  Put,
  Middleware
} from 'bitorjs';

@Controller('/product')
export default class {

  @Get("/list")
  async list(ctx, next) {
    const entry = await ctx.$service.product.list(ctx.request.query);
    if(entry){
      ctx.success(entry)
    } else {
      ctx.fail()
    }
  }

  @Get("/users")
  async users(ctx, next) {
    const entry = await ctx.$service.product.users(ctx.request.query);
    if(entry){
      ctx.success(entry)
    } else {
      ctx.fail()
    }
  }

  @Post("add")
  async add(ctx, next) {
    const entry = await ctx.$service.product.add(ctx.request.body);

    if(entry){
      ctx.success(entry)
    } else {
      ctx.fail()
    }
  }

  @Post("edit")
  async edit(ctx, next) {
    const entry = await ctx.$service.product.edit(ctx.request.body);

    if(entry){
      ctx.success(entry)
    } else {
      ctx.fail()
    }
  }

  @Post("del")
  async del(ctx, next) {
    const entry = await ctx.$service.product.del(ctx.request.body);

    if(entry){
      ctx.success(entry)
    } else {
      ctx.fail()
    }
  }
 
  @Post("addUser")
  async addUser(ctx, next) {
    const entry = await ctx.$service.product.addUser(ctx.request.body);

    if(entry){
      ctx.success(entry)
    } else {
      ctx.fail()
    }
  }

  @Post("editUser")
  async editUser(ctx, next) {
    const entry = await ctx.$service.product.editUser(ctx.request.body);

    if(entry){
      ctx.success(entry)
    } else {
      ctx.fail()
    }
  }

  @Post("delUser")
  async delUser(ctx, next) {
    const entry = await ctx.$service.product.delUser(ctx.request.body);

    if(entry){
      ctx.success(entry)
    } else {
      ctx.fail()
    }
  }
}