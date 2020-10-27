import jwt from 'jsonwebtoken';

export default (config)=>{

  const sign = function sign(username, passwd){
    return jwt.sign({
      name: username,
      passwd: passwd
    }, config.secret, {
        expiresIn: config.maxAge
    });
  }

  const sign2 = function sign2(data){
    return jwt.sign(data, config.secret, {
        expiresIn: config.maxAge
    });
  }

  return async (ctx, next)=>{

    
    ctx.sign = sign;
    ctx.sign2 = sign2;

    ctx.refreshToken = ()=>{
      
      let token = null;
      if (ctx.header && ctx.header.authorization) {
        const parts = ctx.header.authorization.split(' ');
        if (parts.length === 2) {
          //取出token
          token = parts[1];
        }
      }
      if(token) {
        const {exp,  name, passwd} = jwt.decode(token);
        const cur  = new Date().getTime()/1000;
        const  ret = exp - cur;
        if( ret > 0 && ret < 60*60) {
          //  过期前 60min  内 刷新请求
          const newToken = ctx.sign(name, passwd);

          ctx.res.setHeader('Refresh-Token', `${newToken}`);
        }
      }
    }

    // ctx.verify = function verify(token ){
    //   let info = null;
    //   try{
    //     info = jwt.verify(token, config.secret, {
    //       complete: true
    //     });
    //   }catch(err){
    //     throw err;
    //   }
    
    //   return info;
    // }

    // ctx.decode = jwt.decode;

    ctx.getUser = function getUser(options={}){
      let token = null;
      if (ctx.header && ctx.header.authorization) {
        const parts = ctx.header.authorization.split(' ');
        if (parts.length === 2) {
          //取出token
          token = parts[1];
        }
      }
      return jwt.decode(token, options);
    }

    await next();
  }
}


// 1. Token设计说明
//   正常Token：Token未过期，且未达到建议更换时间。
//   濒死Token：Token未过期，已达到建议更换时间。
//   正常过期Token：Token已过期，但存在于缓存中。
//   非正常过期Token：Token已过期，不存在于缓存中。

//   过期时间
//     Token过期时间越短越安全，如设置Token过期时间15分钟，建议更换时间设置为Token前5分钟，则Token生命周期如下：

//   1. 时间 Token类型 说明
//     0-10分钟 正常Token 正常访问
//     10-15分钟 濒死Token 正常访问，返回新Token，建议使用新Token
//     >15分钟 过期Token 需校验是否正常过期。正常过期则能访问，并返回新Token；
//     非过期Token拒绝访问
//     生成一个正常Token
//     在缓存中，通过用户标识查询老Token。
//     如存在，将老Token（Token，用户标识）本条缓存设置过期时间，作为新老Token交替的过渡期。
//     将新Token以（Token，用户标识）、（用户标识，Token）一对的形式存入缓存，不设置过期时间。
//     获取一个正常Token
//       在缓存中，通过用户标识查询用户当前Token，校验该Token是否为正常Token，如正常则返回；不正常则生成一个正常Token。

// 2. 情景
//   正常Token传入
//     当正常Token请求时，返回当前Token。
//   濒死Token传入
//     当濒死Token请求时，获取一个正常Token并返回。
//   正常过期Token
//     当正常过期Token请求时，获取一个正常Token并返回。
//   非正常过期过期Token
//     当非正常过期Token请求时，返回错误信息，需重新登录。