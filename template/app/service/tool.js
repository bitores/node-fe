import Model from '../models';
const moment = require('moment')
const axios = require('axios')
const { Op, sequelize, ToolSchedule , ToolQr, ToolWxDomain, HanYu} = Model;

export default class {

  async scheduleList(params) {
    let where = {};
    if(params.name) {
      where.name = params.name;
    }
    
    return await ToolSchedule.findAll({
      where,
      attributes:[
        "id","name","uuid",
        ['t_timer', 'time'],
        ['t_type', 'type'],
        ['t_desc', 'desc']
      ]
    });
  }

  async scheduleOne(params) {
    let where = {};
    if(params.id) {
      where.id = params.id;
    }
    
    return await ToolSchedule.findOne({
      where,
      attributes:[
        "id","name","uuid",
        ['t_timer', 'time'],
        ['t_type', 'type'],
        ['t_desc', 'desc']
      ]
    });
  }

  async scheduleAdd(params) {
    const one = await ToolSchedule.findOne({
      where:{
        name: params.name,
      }
    })

    if(!one) {
      return ToolSchedule.create({

        name: params.name,
        t_type: params.type,
        t_timer: params.time,
        t_desc: params.desc
      })
    }

    return false;
  }

  async scheduleDel(params) {

    return ToolSchedule.destroy({
      where: {
        id:  params.id,
      }
    })
    
  }

  async scheduleStart(params) {

    const one =  ToolSchedule.findOne({
      where: {
        id:  params.id,
      }
    })

    if(one) {
      return ToolSchedule.update({
        uuid: params.uuid
      },{
        where:{
          id:  params.id,
        }
      })
    }
    
    return false;
  }

  async getQrData(params){
    const one = await ToolQr.findOne({
      where: {
        slut: params.key
      }
    });
    const count = one.getDataValue("view_count");
    return one.update({view_count: 1+count});

    // return one;
  }

  async getQrDataList(params){
    let where = {}

    const page = parseInt(params.page)||1;
    const pageSize = parseInt(params.pageSize)||100;

    return ToolQr.findAndCountAll({
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

  async addQr(params){
    return ToolQr.findOrCreate({
      defaults:{
        slut: params.uuid,
        url: params.url,
        qr_desc: params.name,
        at: new Date(),
        expire: params.expire?new Date(params.expire):null
      },
      where:{
        slut: params.uuid
      }
    })
  }

  async editQr(params){
    return ToolQr.update({
      qr_desc: params.name,
      url: params.url,
    },{
      where:{
        id: params.id
      }
    })
  }

  async delQr(params){
    return ToolQr.destroy({

      where:{
        id: params.id
      }
    })
  }

  // wx domain
  async listWxDomain(params) {

    let where = {}

    if(params.title) where.title = params.title;
    if(params.url) where.url = {[Op.like]:`%${params.url}%`};
    if(params.way) where.title = params.way;

    const page = parseInt(params.page)||1;
    const pageSize = parseInt(params.pageSize)||100;

    return ToolWxDomain.findAndCountAll({
      offset:(page - 1) * pageSize,
      limit:pageSize,
      where,
      order:[
        // 第一顺序是build 顺序
        [
          'id', "DESC"
        ],
        
      ]
    });
  }

  async addWxDomain(params){
    return ToolWxDomain.create({

        title: params.title,
        url: params.url,
        at: new Date(),
        way: 0,
        is_disabled: 0,
        update_at: new Date()
      
    })
  }

  async syncWxDomainData(params){
    // 获取时间， + 明天
    const latest = await ToolWxDomain.findOne({
      limit:1,
      order:[
        // 第一顺序是build 顺序
        [
          'id', "DESC"
        ],
      ]
    });

    const latestDate = latest.getDataValue("at");
    const tomorrow = moment().add(1, 'days').format('YYYY-MM-DD');
    let count = 0;
    const allData = [];
    const allPromise = [];
    let date = moment(latestDate).add(count,'days').format("YYYY-MM-DD")
    for (; date !== tomorrow; count++, date = moment(latestDate).add(count,'days').format("YYYY-MM-DD")) {
      // console.log(date);

      // (async (date)=>{
        const {data} = await axios.get(`https://weixin110.qq.com/cgi-bin/mmspamsupport-bin/announcebanurlcgi?time=${date}`);
        // .then(({data})=>{
          // console.log(date)
          if(0 === data.ret) {
            const entry = data.data||[];
            
            allPromise.push(...entry.map(async item=>{
              // const day = date;
              // console.log('--', date)
              // return (async ()=>{
                return await ToolWxDomain.findOrCreate({
                  defaults:{
                    title: item.title,
                    url: item.url,
                    at: date,
                    update_at:date,
                    way: 0,
                    is_disabled: 1
                  },
                  where:{
                    url: item.url
                  }
                })
              // })
            }))
            // console.log('-', res)
            // resolve(res);
          } else {
            // reject();
          }
      // })(date)
      // }))
    }

    return await Promise.all(allPromise);
  }

  async checkWxDomain(params) {
    return ToolWxDomain.update({
      is_disabled: params.code===0?0: 1,
      update_at: new Date()
    },{
      where:{
        id: params.id
      }
    })
  }

  async queryCollectList(params) {
    let where = {};

    const page = parseInt(params.page)||1;
    const pageSize = parseInt(params.pageSize)||100;

    return HanYu.findAndCountAll({
      offset:(page - 1) * pageSize,
      limit:pageSize,
      where,
      order:[
        // 第一顺序是build 顺序
        [
          'id', "DESC"
        ],
        
      ]
    });

  }

  async collectWord(params) {

    return HanYu.findOrCreate({
      defaults:params,
      where:{
        wd: params.wd
      }
    })
  }

}