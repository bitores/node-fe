import Model from '../models';
const { Op, sequelize, CalendarList, CalendarType } = Model;

export default class {

  async list(params) {
    let where = {};
    // if(params.name) {
    //   where.name = params.name;
    // }
    const d = new Date();
    return await CalendarList.findAll({
      raw: true,
      attributes:[
        'id','c_time','c_desc',
        [sequelize.col('listCalendar.c_desc'), 'c_type']
      ],
      where:{
        [Op.and]: [
          sequelize.where(sequelize.fn("YEAR", sequelize.col('c_time')), params.year||d.getFullYear()),
          sequelize.where(sequelize.fn("MONTH", sequelize.col('c_time')), params.month||d.getMonth()+1),
        ]
      },
      include:[
        {
          model: CalendarType,
          as: 'listCalendar'
        }
      ]
      // attributes:[
      //   "id","name","uuid",
      //   ['t_timer', 'time'],
      //   ['t_type', 'type'],
      //   ['t_desc', 'desc']
      // ]
    });
  }

  async typeList(params) {
    return await CalendarType.findAll({
      where:{}
    });
  }

  async add(params) {
    return await CalendarList.create({
      c_type_id: params.type,
      c_desc: params.name,
      c_time: new Date(params.time) 
    })
  }

  // async scheduleOne(params) {
  //   let where = {};
  //   if(params.id) {
  //     where.id = params.id;
  //   }
    
  //   return await ToolSchedule.findOne({
  //     where,
  //     attributes:[
  //       "id","name","uuid",
  //       ['t_timer', 'time'],
  //       ['t_type', 'type'],
  //       ['t_desc', 'desc']
  //     ]
  //   });
  // }

  // async scheduleAdd(params) {
  //   const one = await ToolSchedule.findOne({
  //     where:{
  //       name: params.name,
  //     }
  //   })

  //   if(!one) {
  //     return ToolSchedule.create({

  //       name: params.name,
  //       t_type: params.type,
  //       t_timer: params.time,
  //       t_desc: params.desc
  //     })
  //   }

  //   return false;
  // }

  // async scheduleDel(params) {

  //   return ToolSchedule.destroy({
  //     where: {
  //       id:  params.id,
  //     }
  //   })
    
  // }

  // async scheduleStart(params) {

  //   const one =  ToolSchedule.findOne({
  //     where: {
  //       id:  params.id,
  //     }
  //   })

  //   if(one) {
  //     return ToolSchedule.update({
  //       uuid: params.uuid
  //     },{
  //       where:{
  //         id:  params.id,
  //       }
  //     })
  //   }
    
  //   return false;
  // }

}