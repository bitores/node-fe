import {
  Controller,
  Get,
  Post,
  Put,
  Middleware
} from 'bitorjs';
import nodejieba from 'nodejieba';
import trimHtml from 'trim-html';

@Controller('/article')
export default class {

  @Get("/list")
  async list(ctx, next) {
    const entry = await ctx.$service.article.list(ctx.request.query);
    if(entry){
      ctx.success(entry.rows,{
        totalRecordSize: entry.count
      })
    } else {
      ctx.fail()
    }
  }

  @Get("/detail")
  async detail(ctx, next) {
    const entry = await ctx.$service.article.detail(ctx.request.query);
    if(entry){
      // ctx.set('Content-Type', 'application/force-download');
      // ctx.set('Content-disposition', 'attachment; filename=' + entry.title+ '.html');
      // ctx.body = entry.content;
      // ctx.status = 200;
      ctx.success(entry)
    } else {
      ctx.fail()
    }
  }

  @Post("add")
  async add(ctx, next) {
    const params = this.handBody(ctx.request.body)
    
    const entry = await ctx.$service.article.add(params,ctx.getUser());

    if(entry){
      ctx.success(entry)
    } else {
      ctx.fail()
    }
  }

  @Post("edit")
  async edit(ctx, next) {
    const params = this.handBody(ctx.request.body)
    const [entry] = await ctx.$service.article.edit(params,ctx.getUser());
    console.log(entry)
    if(entry){
      ctx.success()
    } else {
      ctx.fail('内容不变')
    }
  }

  @Post("del")
  async del(ctx, next) {
    const entry = await ctx.$service.article.del(ctx.request.body);

    if(entry){
      ctx.success(entry)
    } else {
      ctx.fail()
    }
  }
  

  handBody(params){
    // var nodejieba = require("nodejieba");
    // 生成关键词
    nodejieba.load({
      // dict: 主词典，带权重和词性标签，建议使用默认词典。
      // hmmDict: 隐式马尔科夫模型，建议使用默认词典。
      // userDict: 用户词典，建议自己根据需要定制。
      // idfDict: 关键词抽取所需的idf信息。
      // stopWordDict: 关键词抽取所需的停用词列表。
      // dict: nodejieba.DEFAULT_DICT,
      // hmmDict: nodejieba.DEFAULT_HMM_DICT,
      // userDict: './test/testdata/userdict.utf8',
      // idfDict: nodejieba.DEFAULT_IDF_DICT,
      // stopWordDict: nodejieba.DEFAULT_STOP_WORD_DICT,
      // stopWordDict: './stopwords.dat'
    })
    const kws = nodejieba.extract(params.content, 6);
    // 生成摘要
    var trim = trimHtml(params.html, { preserveTags: false, limit: 200 });

    return {
      ...params,
      keyword: kws.reduce((ret, item)=>{
        return ret+=`,${item.word}`
      },""),
      brief: trim.html
    }
  }

  
}