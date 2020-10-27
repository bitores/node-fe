import {
  Controller,
  Get,
  Post,
  Put,
  Middleware
} from 'bitorjs';

@Controller('/role')
export default class {

  @Get("/list")
  async roleList(ctx, next) {
    // ctx.checkQuery("xxx").notEmpty().isInt();

    const entry = await ctx.$service.role.roleList(ctx.request.query);
    if(entry){
      ctx.success(entry)
    } else {
      ctx.fail()
    }
  }

  @Get("/product/list")
  async productRoleList(ctx, next) {
    const entry = await ctx.$service.role.productRoleList(ctx.request.query);
    if(entry){
      ctx.success(entry)
    } else {
      ctx.fail()
    }
  }

  @Post("/product/add")
  async addProduct(ctx, next) {
    const entry = await ctx.$service.role.addProductRole(ctx.request.body);
    if(entry){
      ctx.success(entry)
    } else {
      ctx.fail()
    }
  }

  @Post("/product/edit")
  async editProduct(ctx, next) {
    const entry = await ctx.$service.role.editProductRole(ctx.request.body);

    if(entry){
      ctx.success(entry)
    } else {
      ctx.fail()
    }
  }

  @Post("/product/del")
  async delProduct(ctx, next) {
    const entry = await ctx.$service.role.delProductRole(ctx.request.body);

    if(entry){
      ctx.success(entry)
    } else {
      ctx.fail('已绑定过用户，不能删除')
    }
  }

  @Post("/org/add")
  async addOrg(ctx, next) {
    const entry = await ctx.$service.role.addOrgRole(ctx.request.body);

    if(entry){
      ctx.success(entry)
    } else {
      ctx.fail()
    }
  }

  @Post("/org/edit")
  async editOrg(ctx, next) {
    const entry = await ctx.$service.role.editOrgRole(ctx.request.body);

    if(entry){
      ctx.success(entry)
    } else {
      ctx.fail()
    }
  }

  @Post("/org/del")
  async delOrg(ctx, next) {
    const entry = await ctx.$service.role.delOrgRole(ctx.request.body);

    if(entry){
      ctx.success(entry)
    } else {
      ctx.fail()
    }
  }
 
}