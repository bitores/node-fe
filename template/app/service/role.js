import Model from '../models';
const { Op, sequelize, Roles, ProductRole, ProductUserRole, Product } = Model;

export default class {
  constructor(){
    
  }
  async roleList(params) {
    let where = {};
    if(params.role_name) {
      where.role_name = params.role_name;
    }
    

    let data = await Roles.findAll({
      where
    });


    return data;
  }

  async productRoleList(params) {

    let where = {}

    if(params.role_name)
    {
      where.role_name = {[Op.like]:`%${params.role_name}%`};
    }

    let pwhere = {};
    if(params.product_id){
      pwhere.id = params.product_id;
    }

    let data = await Roles.findAll({
      raw: true,
      where,
      attributes:[
      'id','role_name','role_alias',
      [sequelize.col('rProduct.product_name'), 'product_name'],
      [sequelize.col('rProduct.id'), 'product_id'],],
      include:[
        {
          model: Product,
          as: 'rProduct',
          attributes:[],
          where: pwhere,
        },
        
      ],
    });


    return data;
  }


  async addProductRole(params) {
    const product_role = await ProductRole.findOne({
      where:{
        role_id: params.role_id,
        product_id: params.product_id,
      }
    })

    if(!product_role) {
      return ProductRole.create({
        ...params
      })
    }

    return false;
  }

  async editProductRole(params) {
    return  ProductRole.update({
      role_id: params.role_id,
      product_id: params.product_id,
    },{
      where:{
        role_id: params.role_id,
        product_id: params.product_id,
      }
    })
  }

  async delProductRole(params) {
    const isUsed = await ProductUserRole.findOne({
      where:{
        role_id: params.role_id,
        product_id: params.product_id
      }
    })

    if(isUsed===null) {
      return ProductRole.destroy({
        where:{
          role_id: params.role_id,
          product_id: params.product_id,
        }
      })
    }

    return false;
  }

  async addOrgRole(params) {
  
    
    const orgRole =  await Roles.findOne({
      where:{
        [Op.or]:[
          {role_name: params.role_name},
          {role_alias: params.role_alias},
        ]
      }
    })

    if(orgRole===null){
      return  Roles.create({
        role_name: params.role_name,
        role_alias: params.role_alias,
      })
    }

    return false;
  }

  async editOrgRole(params) {
    const user = await Roles.findOne({
      where:{
        [Op.or]:[
          {role_name: params.role_name},
          {role_alias: params.role_alias},
        ]
      },
    })

    if(user) {
      return  Roles.update({
        role_name: params.role_name,
        role_alias: params.role_alias,
      },{
        where:{
          id: params.id
        }
      })
    } 

    return false;
  }

  async delOrgRole(params) {
    const isUsed = await ProductUserRole.findOne({
      where:{
        role_id: params.id
      }
    })

    if(isUsed === null) {
      return Roles.destroy({
        where:{
          id: params.id
        }
      })
    }
    
    return false;
  }

}