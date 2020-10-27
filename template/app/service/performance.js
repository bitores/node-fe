import Model from '../models';
const { Op, sequelize, Performance} = Model;

export default class {
  async list(params) {
    let where = {}
    if(params.title)
    {
      where.title = {[Op.like]:`%${params.title}%`};
    }
    const page = parseInt(params.page)||1;
    const pageSize = parseInt(params.pageSize)||100;

    return await Performance.findAndCountAll({
      offset:(page - 1) * pageSize,
      limit:pageSize,
      where,
      order:[
        [
          'at', "DESC"
        ],
        
      ]
    });
  }

  async detail(params) {
    let where = {}
    if(params.id)
    {
      where.id = params.id;
    }

    return Performance.findOne({
      where
    });
  }


  async add(params) {

    return Performance.create({
      title: params.title,
      url: params.url,
      timing: params.timing,
      traceurl: params.traceurl,
      shot: params.shot,
      at: new Date(),
    })
  }

  async edit(params, userInfo) {
    return  await Performance.update({
      title: params.title,
      content: params.content,
      brief: params.brief,
      head_img: params.url,
      type: params.type,
      tags: params.tags,
      keyword: params.keyword,
      classify: params.classify, 
    },{
      where:{
        id: params.id,
        author: userInfo.name
      }
    })
  }

  async del(params) {

    return Performance.destroy({
      where:{
        id: params.id
      }
    })

  }
}