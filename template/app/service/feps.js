import Model from '../models';
const { Op, sequelize, FepsProducts, FepsBuild, FepsDeploy} = Model;

export default class {

  async getProducts(params){
    let where = {};
    if(params.name) {
      where.name = params.name;
    }
    return FepsProducts.findAll({
      where
    })
  }

  async getProductBuild(params){
    let where = {};
    if(params.product_id) {
      where.product_id = params.product_id;
    }
    const {page, pageSize} = params;
    const buildList = await FepsBuild.findAll({
      where,
      // offset:(page-1) * pageSize, 
      // limit: pageSize,
      include:[
        {
          
          model: FepsProducts,
          as: 'fepsproduct',
          // attributes:[],
        },
        {
          model: FepsDeploy,
          as: 'fepsdeploy',
          // attributes:[],
        }
      ],
      order:[
        // 第一顺序是build 顺序
        [
          'id', "DESC"
        ],
        // 第二顺序是 deploy 顺序
        [
          {model: FepsDeploy, as: 'fepsdeploy',}, 'id', 'DESC'
        ],
        
      ]
    })

    // return buildList;
    return buildList.map(item=>{
      let deploy = item.fepsdeploy[0]||{};
      let product = item.fepsproduct;
      return {
        id: item.id,
        build_at: item.build_at,
        build_man: item.build_man,
        tag: item.tag,
        is_current: item.is_current,
        product_id: product.id,
        product_name: product.name,
        deploy_man: deploy.deploy_man,
        deploy_desc: deploy.deploy_desc,
        deploy_at: deploy.deploy_at,
        deploy_list: item.fepsdeploy
      }
    })
  }

  async getBuildRecord(params) {
    return await FepsBuild.findOne({
      where:{
        id: params.id,
      },
      attributes:[
        "tag",
        [sequelize.col("fepsproduct.name"), 'productName']
      ],
      include:[
        {
          model: FepsProducts,
          as: 'fepsproduct',
          attributes:[],
        }
      ]
    })
  }

  async deploy(params, userInfo){
    const buildRecord = await FepsBuild.findOne({
      where:{
        id: params.id,
      }
    })
    
    await FepsBuild.update({
      is_current: 0
    },{
      where:{
        product_id: buildRecord.product_id,
        is_current: 1
      }
    })

    buildRecord.is_current = 1;
    buildRecord.save();

    return  FepsDeploy.create({
      deploy_desc: params.deploy_desc,
      deploy_man: userInfo.name,
      deploy_at: new Date(),
      build_id: params.id
    })
  }

  async addbuild(params){
   const products = await this.addProject({
      name: params.name
    });

    const product = products[0]||{};

    return FepsBuild.findOrCreate({
      where:{
        tag: params.tag,
        product_id: product.id,
      },
      defaults:{
        build_at: new Date(),
        build_man: params.build_man,
        tag: params.tag,
        product_id: product.id,
      }
    })
  }

  async addProject(params){

    return FepsProducts.findOrCreate({
      where:{
        name: params.name,
      },
      defaults:{
        name: params.name,
      }
    })
   
  }

  async getProductLog(params) {
    return FepsDeploy.findAll({
      raw: true,
      attributes:[
        'id','deploy_desc','deploy_man', 'deploy_at',
        [sequelize.col('fepsbuild.tag'),'tag'],
        [sequelize.col('fepsbuild.is_current'),'is_current'],
        [sequelize.col('fepsbuild.fepsproduct.name'),'product_name'],
      ],
      include:[
        {
          required: true,
          model: FepsBuild,
          as: 'fepsbuild',
          attributes:[],
          include:[
            {
              model: FepsProducts,
              as: 'fepsproduct',
              attributes:[],
              where:{
                id: params.product_id,
              }
            }
          ]
        }
      ],
      order:[
        ['id', "DESC"]
      ]
    })
  }
}