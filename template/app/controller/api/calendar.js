import {
  Controller,
  Get,
  Post,
  Put,
  Middleware
} from 'bitorjs';

@Controller('/calendar')
export default class {

  @Get('/list')
  async scheduleList(ctx, next){
    const ret = await  ctx.$service.calendar.list(ctx.request.query);
    if(ret) {
      let entry = {};
      ret.map(item=>{
        const d = new Date(item.c_time);
        const k = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
        if(!entry.hasOwnProperty(k)) {
          entry[k] = [];
        }

        entry[k].push({
          id: item.id,
          color: item.c_type,
          content: item.c_desc,
          time: item.c_time
        })
      })

      ctx.success(entry)
    } else {
      ctx.fail('获取失败')
    }
  }

  @Get('type-list')
  async typeList(ctx, next){
    const ret = await ctx.$service.calendar.typeList(ctx.request.query);
    if(ret) {
      ctx.success(ret);
    } else {
      ctx.fail('获取失败')
    }
  }

  @Post('add')
  async add(ctx, next){
    const ret = await ctx.$service.calendar.add(ctx.request.body);
    if(ret) {
      ctx.success(ret);
    } else {
      ctx.fail('添加失败')
    }
  }
}