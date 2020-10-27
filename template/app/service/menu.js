import Model from '../models';
const { Op, sequelize, Product, Menus} = Model;

export default class {

  async side(params){
    return Menus.findAll({
      where:{
        parent_id:{
          [Op.e]:0
        }
      },
      // attributes:[
      //   "id","menu_name","menu_path","menu_component"
      //   // [sequelize.col("pMenus.menu_name"),'pmenu_name']
      // ],
      include:[
        {
          model: Menus,
          as: 'cMenus'
        }
      ]
    })
  }

  async list(params){
    let where = {}, pwhere={};
    if(params.menu_name) {
      where.menu_name = params.menu_name;
    }
    if(params.product_id) {
      where.product_id = params.product_id;
      pwhere.id = params.product_id;
    }



    return Menus.findAll({
      raw: true,
      where,
      attributes:[
        "id","web_key","web_type","menu_name","menu_path","menu_component","parent_id","product_id",
        [sequelize.col("pMenus.menu_name"),'pmenu_name'],
        [sequelize.col("product.product_name"),'product_name'],
      ],
      include:[
        {
          model: Product,
          where:pwhere,
          attributes:[],
          as: 'product'
        },
        {
          model: Menus,
          as: 'pMenus'
        }
      ]
    })
  }

  async add(params){
    const menu = await Menus.findOne({
      where:{
        product_id:  params.product_id,
        [Op.or]:[
          {menu_name: params.menu_name},
          // {menu_path: params.menu_path}
        ]
      }
    })

    if(menu === null) {
      return Menus.create({
        name: params.name,
        menu_name: params.menu_name,
        menu_path: params.menu_path,
        menu_component: params.menu_component,
        parent_id:  params.parent_id||0,
        product_id:  params.product_id,
        web_type: params.web_type,
        web_key: params.web_key
      })
    }

    return false;
  }

  async edit(params){

    return Menus.update({

      menu_component: params.menu_component,
      menu_name: params.menu_name,
      name: params.name,
      menu_path: params.menu_path,
      web_type: params.web_type,
      web_key: params.web_key,
      // 更新不处理所属项目及上级菜单
      parent_id:  params.parent_id||0,
      // product_id:  params.product_id,
    },{
      where: {
        id:  params.id,
      }
      
    })

  }

  async del(params){

    const one = await Menus.findOne({
      where:{
        parent_id: params.id
      }
    })

    if(one===null) {
      return Menus.destroy({
        where: {
          id:  params.id,
        }
      })
    }

    return false;
  }
}