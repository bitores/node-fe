import Model from '../models';
const { sequelize, Op, Users, Product, ProductUserRole, Roles} = Model;
import crypto from 'crypto';
import utility from 'utility';

export default class {
  async register(params) {
    let salt = crypto.randomBytes(30).toString('hex');
    let password_sha = utility.sha1(params.password + salt);

    return await Users.findOrCreate({
      where: {
        login_name: params.username,
      },
      defaults: {
        login_name: params.username,
        login_pwd: password_sha,
        salt: salt
      }
    })
  }

  async login(params) {
    const one = await Users.findOne({
      where: {
        login_name: params.username,
      }
    })
    
    if (one) {
      let password_sha = utility.sha1(params.password + one.salt);
      return await Users.findOne({
        where: {
          login_name: params.username,
          login_pwd: password_sha
        }
      })
    }

    return null;
  }

  async getUserRole({username, sysname}){
    
    let users = await Users.findAll({
      raw: true,
      // subQuery: false,
      where:{
        login_name: username
      },
      attributes:[
        "id","real_name","cdcard","mobile","is_in","login_name",
        [sequelize.col('product.id'), 'product_id'],
        [sequelize.col('product.product_name'), 'product_name'],
        [sequelize.col('product.role2.id'), 'role_id'],
        [sequelize.col('product.role2.role_alias'), 'role_alias'],
        [sequelize.col('product.role2.role_name'), 'role_name'],
      ],
      include:[
        {
          required: true,
          model: Product,
          as: 'product',
          attributes:[],
          where: {
            product_alias: sysname
          },
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
                attributes:[]
              }
            }
          ]
        },
      ],
    })

    return users&&users[0] 
  }

  async getUserList(params){
    let where = {};
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

    return await Users.findAll({
      where
    });
  }

  async add(params) {
    // 启动事务
    

    const user = await Users.findOne({
      where:{
        [Op.or]:[
          {cdcard: params.cdcard},
          {login_name: params.login_name},
          {mobile: params.mobile}
        ]
      }
    });

    if(user===null) {
      let salt = crypto.randomBytes(30).toString('hex');
      let password_sha = utility.sha1(params.password + salt);

      return Users.create({
        real_name: params.real_name,
        cdcard: params.cdcard,
        mobile: params.mobile,
        in_time: params.in_time,
        out_time: params.out_time,
        is_in: params.is_in,
        login_name: params.login_name,
        login_pwd: password_sha,
        login_count: params.login_count,
        salt
      })
    }

    return false;
  }

  async edit(params) {

    let salt , password_sha;
    if(params.password) {
      salt = crypto.randomBytes(30).toString('hex');
      password_sha = utility.sha1(params.password + salt);
    }
    // 启动事务
    return Users.update({
      // ...params,
      real_name: params.real_name,
      cdcard: params.cdcard,
      mobile: params.mobile,
      in_time: params.in_time,
      out_time: params.out_time,
      is_in: params.is_in,
      login_name: params.login_name,
      login_pwd: password_sha,
      salt,
    },{
      where:{
        id: params.id
      }
    });
  }

  async del(params) {
    const isUsed = await ProductUserRole.findOne({
      where:{
        user_id: params.id
      }
    })

    if(isUsed === null) {
      return Users.destroy({
        where:{
          id: params.id
        }
      });
    } 
    
    return false;
  }
}