import {
  Controller,
  Get,
  Post,
  Put,
  Middleware
} from 'bitorjs';
const puppeteer = require('puppeteer');
const uuid = require('uuid');
var archiver = require('archiver');
const fs = require('fs');
const path = require('path')

function sleep(delay) {
  return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(1)
      }, delay)
  })
}

@Controller('/feps/performance')
export default class {

  @Get('/list')
  async list(ctx,next){
    const entry = await ctx.$service.performance.list(ctx.request.query);
    if(entry){
      const config = ctx.app.$config;
      ctx.success(entry.rows.map(item=>{
        console.log(item.getDataValue("timing"))
        return {
          id: item.getDataValue('id'),
          title:item.getDataValue("title"),
          url:item.getDataValue("url"),
          shot: item.getDataValue("shot").replace(config.staticDir, `http://localhost:${config.port}`),
          timing: item.getDataValue("timing"),
          trace: item.getDataValue("traceurl").replace(config.staticDir, `http://localhost:${config.port}`),
          at: item.getDataValue('at')
        }
      }),{
        totalRecordSize: entry.count
      })
    } else {
      ctx.fail()
    }
  }
 
  @Post("/analize")
  async performanceAnalize(ctx, next){
    const params = ctx.request.body;
    
    ctx.pushTimeLog('请求进来')
    const browser = await puppeteer.launch({headless: true});
    ctx.pushTimeLog('成功启动分析器')
    const page = await browser.newPage();
    ctx.pushTimeLog('成功打开标签')

    // await page.pdf({path: 'hn.pdf', format: 'A4'});
    // 等待页面 加载完成
    // await page.waitForNavigation({
    //   waitUntil: "load",
    //   // timeout: 10000
    // })
    const config = ctx.app.$config;
    const filename = uuid.v1();
    const traceFilepath = `${config.staticDir}/${filename}.json`;
    await page.tracing.start({path: traceFilepath});
    
    await page.goto(params.url, {
      waitUntil: 'networkidle0'
    });
    console.log('打开网址')
    await page.tracing.stop();


    // // 滚动高度
    // let scrollStep = 1080;
    // // 最大滚动高度
    // let max_height = 30000;
    // let m = {prevScroll: -1, curScroll: 0}

    // while (m.prevScroll !== m.curScroll && m.curScroll < max_height) {
    //   m = await page.evaluate((scrollStep) => {
    //     if (document.scrollingElement) {
    //       let prevScroll = document.scrollingElement.scrollTop;
    //       document.scrollingElement.scrollTop = prevScroll + scrollStep; 
    //       let curScroll = document.scrollingElement.scrollTop
    //       return {prevScroll, curScroll}
    //     }
    //   }, scrollStep);

    //   await sleep(1000);
    // }

    
    
    const filepath = `${config.staticDir}/${filename}.png`;
    await page.screenshot({path: filepath, fullPage: false});
    console.log('截图成功')
    const timingStr = await page.evaluate(()=>{

      return  JSON.stringify(window.performance.timing)
    })

    const entryStr = await page.evaluate(()=>{

      return  JSON.stringify(window.performance.getEntries())
    })

    const title = await page.evaluate(()=>{
      return window.document.title;
    })

    await page.close();
    await browser.close();
    console.log('关闭分析器')
    // 数据录入
    const entry = ctx.$service.performance.add({
      shot: filepath,
      title: title,
      url: params.url,
      entries: entryStr,
      timing: timingStr,
      traceurl: traceFilepath,
    })

    // 录入结果
    ctx.success({
      shot: filepath.replace(config.staticDir, `http://localhost:${config.port}`),
      entries: entryStr,
      timing: timingStr,
      trace: traceFilepath.replace(config.staticDir, `http://localhost:${config.port}`),
      url: params.url,
      title: title
    })
    
    // 分析
    // ctx.success({
    //   shot: filepath.replace(config.staticDir, `http://localhost:${config.port}`),
    //   timing: JSON.parse(timingStr)
    // })
  }

  @Get('/download/zip')
  async downloadZip(ctx, next) {
    const params = ctx.request.query;
    const {id} = params;
    const config = ctx.app.$config;
    const item = await ctx.$service.performance.detail({
      id: id
    })
    console.log(item)


    var archive = archiver(`zip`, {
      zlib: { level: 9 } // Sets the compression level.request(url)
    });  
    archive.on('finish', function() {
      console.log('finish')
      console.log('Archive wrote %d bytes', archive.pointer());
    });
    archive.on('warning', function(err) {
      if (err.code === 'ENOENT') {
        // log warning
      } else {
        // throw error
        throw err
      }
    })

    // 明确捕获此错误    
    archive.on('error', function(err) {
      throw err;
    });

    
    ctx.status  = 200;
    const title = path.basename(item.getDataValue("title"));
    // console.log(title)
    ctx.body = archive 


    var userAgent = (ctx.req.headers['user-agent']||'').toLowerCase();
    let filename = `${title}.zip`;
    // 解决中文乱码问题
    if(userAgent.indexOf('msie') >= 0 || userAgent.indexOf('chrome') >= 0) {
      filename = encodeURIComponent(filename);
      ctx.set(`Content-disposition`,`attachment;filename=${filename}`)
    } else if(userAgent.indexOf('firefox') >= 0) {
      filename = encodeURIComponent(filename);
      // res.setHeader('Content-Disposition', 'attachment; filename*="utf8\'\'' + encodeURIComponent(filename)+'"');
      ctx.set(`Content-disposition`,`attachment;filename*="utf8\'\'${filename}"`)
    } else {
      filename = new Buffer(filename).toString('binary');
      ctx.set(`Content-disposition`,`attachment;filename=${filename}`)
      /* safari等其他非主流浏览器只能自求多福了 */
      // res.setHeader('Content-Disposition', 'attachment; filename=' + new Buffer(filename).toString('binary'));
    }

      // 可追加格式 stream/string/buffer/file等一系列方式; 目前只测试追加string、buffer
      // append a file from string
      archive.append(`<script>window.location.href="${item.getDataValue("url")}"</script>`, { name: 'index.html' })
      archive.append(item.getDataValue("timing"), { name: 'timing.json' })
      

      // append a file from buffer
      const readme = Buffer.from(`
      # 使用说明

      - 将 json 文件拖放至xx处，即可生成数据统计图
      `);
      archive.append(readme, { name: 'README.md' })
      archive.append(fs.createReadStream(item.getDataValue('shot')), { name: "shot.png" })
      // archive.file(__dirname+'/../../../web/0ac372a0-dd73-11ea-8ebd-d32e99536c90.png', { name: "0cca9250-dc78-11ea-9e33-759db7bd2db5.png" })
      archive.file(item.getDataValue("traceurl"), { name: "traceurl.json" })
      // const traceurl = item.getDataValue("traceurl").replace(config.staticDir, `http://localhost:${config.port}`)
      // await archive.append(request(traceurl), { name: path.basename(traceurl) })
      // await archive.append(request(url), { name: path.basename(url) })

      console.log('完成 start')
      archive.glob("**/*.xx") // 文件操作权限
      archive.finalize();
      console.log('完成 end')  
  }
}