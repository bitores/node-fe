
import {
  Controller,
  Get,
  Post,
  Put,
  Middleware
} from 'bitorjs';
const fs = require('fs');
const path = require('path')
import Axios from 'axios';
const puppeteer = require('puppeteer');
const uuid = require('uuid');
var request = require('request');
const pinyin = require('pinyin');


var WxCheckDomain = require('../../lib/wx-check-domain.js');

@Controller('/tool')
export default class {

  @Post("/upload-file")
  async uploadFile(ctx, next){
    const file = ctx.request.files.file;
    const config = ctx.app.$config;
    // console.log()
    const url = file.path.replace(config.staticDir,`http://localhost:${config.port}`);
    ctx.success(url)

    // const ret = await ctx.upOssFile(`test/${file.name}`,file.path);
    
    // if(ret) {
    //   ctx.success({
    //     name: file.name,
    //     status: "done",
    //     thumbUrl: ret.url,
    //     url: ret.url
    //   })
    // } else {
    //   ctx.fail('文件上传失败')
    // }
    
  }

  @Post("/upload-files")
  async uploadFiles(ctx, next){
    console.log(ctx.request.files)
    let files = ctx.request.files["file[]"];
    if(!Array.isArray(files)) {
      files = [files];
    }
    const urls = files.map(file=>{
       const config = ctx.app.$config;
    // console.log()
        return file.path.replace(config.staticDir,`http://localhost:${config.port}`);

        // return {
        //   name: file.name,
        //   status: "done",
        //   thumbUrl: url,
        //   url: url
        // }
    })
   
    ctx.success(urls)
  }

  @Get('/download/file')
  async downloadUrl(ctx, next) {
    const params = ctx.request.query;
    const {url} = params;
    ctx.set('Content-disposition','attachment;filename='+path.basename(url))
    ctx.body = request(url);
  }

  @Get("/badjs")
  async badjs(ctx, next){
    ctx.error("badjs",ctx.request.query)
    ctx.success();
  }

  @Post("/badjs")
  async badjs(ctx, next){
    // ctx.error("badjs",ctx.request.query)
    ctx.success();
  }

  @Get('/schedule/list')
  async scheduleList(ctx, next){
    const ret = await  ctx.$service.tool.scheduleList(ctx.request.query);
    if(ret) {
      ctx.success(ret)
    } else {
      ctx.fail('获取失败')
    }
  }

  @Post('/schedule/add')
  async scheduleAdd(ctx, next){
    const ret = await  ctx.$service.tool.scheduleAdd(ctx.request.body);
    if(ret) {
      ctx.success(ret)
    } else {
      ctx.fail('添加失败')
    }
  }

  @Post('/schedule/del')
  async scheduleDel(ctx, next){
    const ret = await  ctx.$service.tool.scheduleDel(ctx.request.body);
    if(ret) {
      ctx.success(ret)
    } else {
      ctx.fail('删除失败')
    }
  }

  @Post('/schedule/start')
  async scheduleStart(ctx, next){
    const schedule = await ctx.$service.tool.scheduleOne(ctx.request.body);
    if(schedule) {
      
      const time = schedule.getDataValue('time');
      const type = schedule.getDataValue('type');
      let uuid = '';
      switch(type) {
        case 1: {
          uuid = await ctx.cronJob(time);
        }break;
        case 2: {
          console.log('...date', time)
          uuid = await ctx.dateJob(time,()=>{
            console.log('=== dateJob')
            // 执行指定事件，事件后台写好，前台指定
            
            // 已执行写入数据库

          });
        }break;
        case 3: {
          const  times = time.split(',');
          uuid = await ctx.rangeJob({
            start: times[0],
            end: times[1],
            rule: times[2]
          });
        }break;
      }

      console.log(uuid)
      if(uuid) {
        const ret = await  ctx.$service.tool.scheduleStart({
          ...ctx.request.body,
          uuid,
        });
        if(ret) {
          ctx.success(ret)
        }
      }

      ctx.success(uuid)
      return false;
    }
    

    ctx.fail('开启失败')
  }

    // 二维码-活码
    @Get('/qr/h/:key')
    async qr(ctx, next){
      const ret = await ctx.$service.tool.getQrData(ctx.params);
      console.log(ret,'===', ret.expire)
      if(ret) {
        if(ret.expire && ret.expire.getTime()<new Date().getTime()){
          ctx.status = 200;
          ctx.body = '<h1>二维码失效</h1>'
        } else {
          // 跳转
          ctx.status = 302;
          ctx.res.setHeader('Location',ret.url);
          ctx.res.end();
        }
        
      } else {
        ctx.body = '过期失效 或 不存在'
      }
    }

  @Get('/qr/list')
  async qrList(ctx, next){
    const entry = await ctx.$service.tool.getQrDataList(ctx.request.query)

    if(entry) {
      ctx.success(entry.rows,{
        totalRecordSize: entry.count
      })
    } else {
      ctx.fail('添加失败')
    }
  }



  @Post('/qr/add')
  async addQr(ctx, next){
    const ret = await ctx.$service.tool.addQr({
      ...ctx.request.body,
      uuid: uuid.v1().replace(/-/g,'')
    })

    if(ret) {
      ctx.success()
    } else {
      ctx.fail('添加失败')
    }
  }

  @Post('/qr/edit')
  async editQr(ctx, next){
    const ret = await ctx.$service.tool.editQr(ctx.request.body)

    if(ret) {
      ctx.success()
    } else {
      ctx.fail('编辑失败')
    }
  }

  @Post('/qr/del')
  async delQr(ctx, next){
    const ret = await ctx.$service.tool.delQr(ctx.request.body)

    if(ret) {
      ctx.success()
    } else {
      ctx.fail('删除失败')
    }
  }

  @Get('/wx-domain/list')
  async listWxDomain(ctx,next){
    const entry = await ctx.$service.tool.listWxDomain(ctx.request.query);
    if(entry) {
      ctx.success(entry.rows,{
        totalRecordSize: entry.count
      })
    } else {
      ctx.fail('添加失败')
    }
  }

  @Post('/wx-domain/add')
  async addWxDomain(ctx,next){
    const entry = await ctx.$service.tool.addWxDomain(ctx.request.body)
    if(entry) {
      ctx.success()
    } else {
      ctx.fail()
    }
  }

  @Post('/wx-domain/sync')
  async syncWxDomainData(ctx, next) {
    // https://weixin110.qq.com/cgi-bin/mmspamsupport-bin/announcebanurlcgi?time=2020-08-17
    const entry = await ctx.$service.tool.syncWxDomainData({})
    if(entry) {
      ctx.success(entry)
    } else {
      ctx.fail('同步失败')
    }
  }

  @Post('/wx-domain/check')
  async wxCheckDomain(ctx, next){
    const appid = ctx.$config.wx_domain.appid;
    const appsecret = ctx.$config.wx_domain.appsecret;

    const checker = new WxCheckDomain(appid, appsecret);

    const params = ctx.request.body || {};
    try {
      const res = await checker.check(params.url);

      const wxRes = await ctx.$service.tool.checkWxDomain({id:params.id, code: res.code});

      if(res.code === 0) {
        ctx.success(res.code,{message:'域名或链接正常'})
      } else {
        ctx.success(res.code, {message:'域名或链接禁用'})
      }
    } catch (err) {
      ctx.fail(err)
    }
  }

  @Get('/word/list')
  async wordList(ctx, next){
    const params = ctx.request.query;
    
    const entry = await ctx.$service.tool.queryCollectList(params)

    if(entry) {
      ctx.success(entry.rows,{
        totalRecordSize: entry.count
      })
    } else {
      ctx.fail('添加失败')
    }
  }

  @Post('/word/batchcollect')
  async batchcollect(ctx,  next) {
    const params = ctx.request.body;

    ctx.success({
      wd: params.wd,
      py: pinyin(params.wd, {
        style: pinyin.STYLE_TONE2, // 设置拼音风格
        heteronym: false // 多音字
      })
    })
  }

  @Post('/word/collect')
  async collect(ctx,  next) {
    const params = ctx.request.body;

    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();

    console.log(params)
    await page.goto(`https://hanyu.baidu.com/zici/s?wd=${params.wd}`, {
      waitUntil: 'networkidle0'
    });

    
    // $ 获取单个元素, $eval 获取单个元素属性
    // $$ 获取多个元素，$$eval 获取多个元素属性
    const word = await page.$eval("#word_bishun",el=>el.src)

    const pinyin = await page.$eval("#pinyin", el=>{
      return {
        py: el.querySelector('b').innerText,
        mp3: el.querySelector('a').getAttribute('url'),
      }
    })

    console.log(pinyin)
    const entry = await ctx.$service.tool.collectWord({
      wd: params.wd,
      gif: word,
      py: pinyin.py,
      mp3: pinyin.mp3 
    })

    if(entry) {
      ctx.success()
    } else {
      ctx.fail()
    }
  }

}