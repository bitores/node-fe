import {
  Controller,
  Get,
  Post,
  Put,
  Middleware
} from 'bitorjs';
import checkBody from '@/app/middleware/check-body'
@Controller('/')
export default class {
  @Get('/isLogin')
  async isLogin(ctx,next){
    ctx.success();
  }

  @Post("/reg-user")
  async reg(ctx, next) {
    const entry = await ctx.$service.user.register(ctx.request.body);

    if(entry){
      ctx.success(entry)
    } else {
      ctx.fail('注册失败')
    }
  }

  @Post('/login')
  @Middleware(checkBody({
    
    'password': {
      notEmpty: true,
      matches: {
        // options: ['example', 'i'] // pass options to the validator with the options property as an array
        // options: [/example/i] // matches also accepts the full expression in the first parameter
      },
      errorMessage: 'Invalid Password' // Error message for the parameter
    },
    'username': { //
      // optional: true, // 可选项
      notEmpty: true,
      isLength: {
        options: [{ min: 2, max: 10 }],
        errorMessage: 'Must be between 2 and 10 chars long' // Error message for the validator, takes precedent over parameter message
      },
      errorMessage: 'Invalid User Name'
    }
    
  }))
  async login(ctx, next) {
    
    const entry = await ctx.$service.user.login(ctx.request.body);

    if(entry){
      let body = ctx.request.body;
   
      const token = ctx.sign(body.username, body.password);
      // const token = ctx.sign2({
      //   ...body,
      //   a: 1,
      //   b: 2
      // });

      entry.setDataValue('token', token);
    
      ctx.cookies.set('token', token, {
        maxAge: 1000 * 60 * 60 * 2,
        httpOnly: true,
      })
      ctx.success(entry)
    } else {
      ctx.fail('登录失败')
    }

  }
}