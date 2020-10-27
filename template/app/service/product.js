import Model from '../models';
const { Op, sequelize, Product, ProductRole, ProductUserRole, Menus, Users, Roles } = Model;

export default class {
  async list(params) {
    let where = {}
    if(params.product_name)
    {
      where.product_name = {[Op.like]:`%${params.product_name}%`};
    }
    let data = await Product.findAll({
      where
    });
    return data;
  }

  async users(params) {
    let where = {}, pwhere = {};
    if(params.real_name) {
      where.real_name = {
        [Op.like]: `%${params.real_name}%`
      }
    }

    if(params.mobile) {
      where.mobile = {
        [Op.like]: `%${params.mobile}%`
      }
    }

    if(params.product_id) {
      pwhere.id = params.product_id;
    }

    let productRoleUsers = await Users.findAll({
      raw: true,
      // subQuery: false,
      where:{
        ...where,
      },
      attributes:[
        "id","real_name","cdcard","mobile","is_in","login_name",
        [sequelize.col('product.id'), 'product_id'],
        [sequelize.col('product.product_name'), 'product_name'],
        [sequelize.col('product.role2.id'), 'role_id'],
        [sequelize.col('product.role2.role_alias'), 'role_alias'],
        [sequelize.col('product.role2.role_name'), 'role_name'],
      ],
      // as:'xxx',
      include:[
        {
          required: true,
          model: Product,
          as: 'product',
          attributes:[],
          where:pwhere,
          through:{
            as: 'ProductRole',
            attributes:[],
            where:{
              product_id: sequelize.col('product.id'),
            },
          },
          include: [
            {
              required: true,
              model: Roles,
              as: 'role2',
              attributes:[],
              where:{
                id:{
                  [Op.col]: 'product.ProductRole.role_id' 
                },
              },
              through: {
                attributes:[],
                where:{

                }
              }
            }
          ]
        },
      ],
    })

    
    return productRoleUsers
  }


  async add(params) {
    const product = await Product.findOne({
      where:{
        [Op.or]:[
          {product_name: params.product_name},
          {product_alias: params.product_alias}
        ]
      }
    })

    if(!product) {
      return Product.create({
        product_name: params.product_name,
        product_alias: params.product_alias
      })
    }

    return false;
    // return Product.findOrCreate()
  }

  async edit(params) {
    return  Product.update({
      product_name: params.product_name,
      product_alias: params.product_alias
    },{
      where:{
        id: params.id
      }
    })
  }

  async del(params) {
    const hasUsers = await ProductUserRole.findOne({
      where:{
        product_id: params.id
      }
    })

    const hasRoles = await ProductRole.findOne({
      where: {
        product_id: params.id
      }
    })

    const hasMenus = await Menus.findOne({
      where: {
        product_id: params.id
      }
    })

    if(hasUsers===null && hasRoles===null && hasMenus===null) {
      return Product.destroy({
        where:{
          id: params.id
        }
      })
    } 

    return false;
  }

  async addUser(params) {
    // 同一用户在同一个产品仅存在一个角色
    const user = await ProductUserRole.findOne({
      where: {
        [Op.and]:[
          {product_id: params.product_id},
          {user_id: params.user_id}
        ]
        // role_id: params.role_id
      }
    })

    
    if(user===null) {
      return ProductUserRole.create({
        product_id: params.product_id,
        user_id: params.user_id,
        role_id: params.role_id
      });
    } 
    
    return false;
  }

  // async editUser(params) {

  //   return ProductUserRole.update({
  //       product_id: params.product_id,
  //       role_id: params.role_id,
  //       user_id: params.user_id
  //     },{
  //     where: {
  //       product_id: params.product_id,
  //       user_id: params.user_id
  //     }
  //   });
  // }

  async delUser(params) {

    return ProductUserRole.destroy({
      where:{
        product_id: params.product_id,
        role_id: params.role_id,
        user_id: params.user_id
      }
    });
  }
}