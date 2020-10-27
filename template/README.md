# node-server


### 基本配置
- koa-body
    - 限制 body 大小
    - 支持各种解析 body 格式
    - 及选择存放位置
    - 文件上传参数（上传位置、文件大小，后缀等）

- koa-jwt
    - 配合 jsonwebtoken 使用
    - 
```js
 //密码加密
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';

const psdMd5 = crypto
  .createHash('md5')
  .update(user.password)
  .digest('hex');

//比较密码的md5值是否一致 若一致则生成token并返回给前端
if (user.password === psdMd5) {
  //生成token
  token = jwt.sign(user, secret, { expiresIn:  '1h' });
  //响应到前端
  ctx.body = {
    token
  }
}


//
if (/^Bearer$/i.test(scheme)) {
  try {
    //jwt.verify方法验证token是否有效
    jwt.verify(token, secret.sign, {
      complete: true
    });
  } catch (error) {
    //token过期 生成新的token
    const newToken = getToken(user);
    //将新token放入Authorization中返回给前端
    ctx.res.setHeader('Authorization', newToken);
  }
}

```

- koa2-cors
    - 解析跨域问题
    - 处理请求 headers （origin|maxAge|allowMethods|allowHeaders|credentials| maxAge|exposeHeaders）

- koa-compress
    - 启用类似Gzip的压缩技术减少传输内容

- koa-helmet 做下面这些检查：
    - clickjacking
    - 移除X-Powered-By
    - 限制只通过https
    - xss攻击过滤
    - 伪造证书攻击


### 数据库模型生成

$ sudo npm install -g sequelize-auto-v2

$ sudo npm install -g mysql2

$ sequelize-auto -h <host> -d <database> -u <user> -x [password] -p [port]  --dialect [dialect] -c [/path/to/config] -o [/path/to/models] -t [tableName] -C

https://itbilu.com/nodejs/npm/sequelize-docs-v5.html

https://itbilu.com/nodejs/npm/N1sdaHTzb.html