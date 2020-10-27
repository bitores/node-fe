const axios = require('axios');
const crypto = require('crypto');

const sign = (secret, content) => {
  const str = crypto.createHmac('sha256', secret).update(content)
    .digest()
    .toString('base64');
  return encodeURIComponent(str);
}

/**
 * 企业微信群机器人 WebHook：用于支持企业微信群机器人消息发送
 * 
 * 官方文档：https://work.weixin.qq.com/help?person_id=1&doc_id=13376
 */
class ChatBot {
  /**
   * 机器人工厂，所有的消息推送项目都会调用 this.webhook 接口进行发送
   * 
   * @param {String} options.webhook 完整的接口地址
   * @param {String} options.baseUrl 接口地址
   * @param {String} options.accessToken accessToken
   * @param {String} options.secret secret
   * @param {*} options.httpclient 例如 urllib / axios
   */
  constructor(options) {
    options = options || {};
    if (!options.webhook && !(options.accessToken && options.baseUrl)) {
      throw new Error('Lack for arguments!');
    }
    this.httpclient = options.httpclient || axios;
    // 优先使用 options.webhook
    // 次之将由 options.baseUrl 和 options.accessToken 组合成一个 webhook 地址
    this.webhook = options.webhook || `${options.baseUrl}?key=${options.accessToken}`;
    this.secret = options.secret;
  }

  /**
   * 发送企业微信群消息
   * 
   * @param {Object} content 发动的消息对象
   * @return {Promise} 
   */
  send(content) {
    const { httpclient } = this;
    let signStr = '';
    if (this.secret) {
      const timestamp = Date.now();
      signStr = '&timestamp=' + timestamp + '&sign=' + sign(this.secret, timestamp + '\n' + this.secret);
    }
    return httpclient.request(this.webhook + signStr, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(content)
    });
  }

  /**
   * 发送纯文本消息，支持@群内成员
   * 
   * @param {String} content 消息内容
   * @param {Object} at 群内@成员的手机号 ["13800001111","@all"]
   * @return {Promise}
   */
  text(content, at) {
    at = at || [];
    return this.send({
      msgtype: 'text',
      text: {
        content,
        mentioned_mobile_list: at,
      }
    });
  }

  /**
   * 发送Markdown消息
   * 
   * @param {String} text 消息内容(支持Markdown)
   * @return {Promise}
   */
  markdown(content, at) {
    at = at || {};
    return this.send({
      msgtype: 'markdown',
      markdown: {
        content
      },
      at
    });
  }


  /**
   * 发送单个图文链接
   * 
   * @param {String} DATA 图片内容的base64编码
   * @param {String} MD5 图片内容（base64编码前）的md5值
   * @return {Promise}
   */
  image(DATA, MD5) {
    return this.send({
      msgtype: 'image',
      image:{
        "base64": DATA,
        "md5": MD5
      }
    });
  }


  /**
   * 图文类型
   * 
   * @param {String} article.title 标题
   * @param {String} article.description 描述
   * @param {String} article.url 点击后跳转的链接。
   * @param {String} article.picurl 图文消息的图片链接,支持JPG、PNG格式，较好的效果为大图 1068*455，小图150*150。
   * @return {Promise}
   */
  feedCard(articles=[]) {
    return this.send({
      msgtype: 'news',
      news: {
        articles
      }
    });
  }
}

export default (config)=>{
    const robot = new ChatBot({
      baseUrl: 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send',
      accessToken: config.token
    })

    return async (ctx, next)=>{
      // 使用方法 ctx.robot.send(option)
      ctx.robot = robot;

      await next();
    }
}

