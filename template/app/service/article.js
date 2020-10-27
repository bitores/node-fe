import Model from '../models';
const { Op, sequelize, Articles} = Model;

export default class {
  async list(params) {
    let where = {}
    if(params.title)
    {
      where.title = {[Op.like]:`%${params.title}%`};
    }
    const page = parseInt(params.page)||1;
    const pageSize = parseInt(params.pageSize)||100;
    console.log(params)
    return Articles.findAndCountAll({
      offset:(page - 1) * pageSize,
      limit:pageSize,
      where,
      order:[
        // 第一顺序是build 顺序
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

    return Articles.findOne({
      where
    });
  }


  async add(params, userInfo) {
    const product = await Articles.findOne({
      where:{
        [Op.or]:[
          {title: params.title}
        ]
      }
    })

    if(!product) {
      return Articles.create({
        title: params.title,
        content: params.content,
        brief: params.brief,
        keyword: params.keyword,
        author: userInfo.name,
        head_img: params.url,
        type: params.type,
        tags: params.tags,
        classify: params.classify,
        at: new Date(),
      })
    }

    return false;
  }

  async edit(params, userInfo) {
    return  await Articles.update({
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

    return Articles.destroy({
      where:{
        id: params.id
      }
    })

  }
}