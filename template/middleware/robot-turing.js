const axios = require('axios')


export default (app, options)=>{


// 史上最全面聊天机器人总结，图灵、思知、小爱、小微，作者已接入到自己的开源IM项目中使用
// https://blog.csdn.net/xmcy001122/article/details/103921991?utm_medium=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-1.channel_param&depth_1-utm_source=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-1.channel_param

  const keys = app.$config.turingKeys;
  app.context.replay = async (text)=>{

    try {
      // 免费版个人每天 100 次，标准版 99 一个月，每天 1000 次
      const {data:{intent, results}} = await axios.post('http://openapi.tuling123.com/openapi/api/v2',{
        "reqType": 0,  //# 输入类型 0-文本, 1-图片, 2-音频
        "perception":  //# 信息参数
        {
            "inputText":  //# 文本信息
            {
                "text": text
            },

            "selfInfo":  //# 用户参数
            {
                "location":
                {
                    "city": "深圳",  //# 所在城市
                    "province": "广东",  //# 省份
                    "street": "红花岭路"  //# 街道
                }
            }
        },
        "userInfo":
        {
            "apiKey": keys[0],// ,  //# 改为自己申请的key
            "userId": "0001"  //# 用户唯一标识(随便填, 非密钥)
        }
      })

      if(4003 === intent.code) {
        const key = keys.shift();
        keys.push(key);
      }

      return results
    } catch (err) {
      
    }
    
    
    // 5000	无解析结果
    // 6000	暂不支持该功能
    // 4000	请求参数格式错误
    // 4001	加密方式错误
    // 4002	无功能权限
    // 4003	该apikey没有可用请求次数
    // 4005	无功能权限
    // 4007	apikey不合法
    // 4100	userid获取失败
    // 4200	上传格式错误
    // 4300	批量操作超过限制
    // 4400	没有上传合法userid
    // 4500	userid申请个数超过限制
    // 4600	输入内容为空
    // 4602	输入文本内容超长(上限150)
    // 7002	上传信息失败
    // 8008	服务器错误
    // 0	上传成功
  }

  return async (ctx, next)=>{
    await next();
  }
}