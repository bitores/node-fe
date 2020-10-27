import Sequelize from 'sequelize';
import sso_product_roles from './sso_product_roles';
import sso_product_user_role from './sso_product_user_role';
import sso_products from './sso_products';
import sso_roles from './sso_roles';
import sso_users from './sso_users';
import sso_menus from './sso_menus';
import sso_feps_products from './sso_feps_products';
import sso_feps_deploy from './sso_feps_deploy';
import sso_feps_build from './sso_feps_build';
import sso_tool_schedule from './sso_tool_schedule';
import sso_calendar_list from './sso_calendar_list';
import sso_calendar_type from './sso_calendar_type';
import sso_tool_qr from './sso_tool_qr';
import sso_articles from './sso_articles';
import sso_fe_performance from './sso_fe_performance';
import sso_tool_wxcheckdomains from './sso_tool_wxcheckdomains';
import sso_hanyu from  './sso_hanyu';


const config = global.context.$config;
const database = config.database;

// sync database before app start, defaul is false
database.syncFirst = false;

// add longtext for mysql
Sequelize.LONGTEXT = Sequelize.LONGTEXT = Sequelize.TEXT;
if (database.dialect === 'mysql') {

  Sequelize.LONGTEXT = Sequelize.LONGTEXT = 'LONGTEXT';
}

export const sequelize = new Sequelize(database.db, database.username, database.password, database);
export const DataTypes = Sequelize.DataTypes;
export const Op = Sequelize.Op;


const models = {
  sequelize: sequelize,
  Op,
  ProductRole: sso_product_roles(sequelize, DataTypes, Op),
  ProductUserRole: sso_product_user_role(sequelize, DataTypes, Op),
  Product: sso_products(sequelize, DataTypes, Op),
  Roles: sso_roles(sequelize, DataTypes, Op),
  Users: sso_users(sequelize, DataTypes, Op),
  Menus: sso_menus(sequelize, DataTypes, Op),
  // 发布系统
  FepsProducts: sso_feps_products(sequelize, DataTypes, Op),
  FepsDeploy: sso_feps_deploy(sequelize, DataTypes, Op),
  FepsBuild: sso_feps_build(sequelize, DataTypes, Op),

  //
  ToolSchedule: sso_tool_schedule(sequelize, DataTypes, Op),
  ToolQr: sso_tool_qr(sequelize, DataTypes, Op),
  ToolWxDomain: sso_tool_wxcheckdomains(sequelize, DataTypes, Op),

  //
  CalendarList: sso_calendar_list(sequelize, DataTypes, Op),
  CalendarType: sso_calendar_type(sequelize, DataTypes, Op),
  //
  Articles: sso_articles(sequelize, DataTypes, Op),
  Performance: sso_fe_performance(sequelize, DataTypes, Op),
  //
  HanYu: sso_hanyu(sequelize, DataTypes, Op),
}

// 
const {ProductRole, ProductUserRole, Product, Roles,  Users, Menus, FepsBuild, FepsDeploy, FepsProducts, ToolSchedule, CalendarList, CalendarType} = models;

//
CalendarList.belongsTo(CalendarType, {
  foreignKey: 'c_type_id',
  as: 'listCalendar'
})


//建立关联线
FepsProducts.hasMany(FepsBuild, {
  foreignKey: 'product_id',
  as: 'fepsbuild'
})

FepsBuild.belongsTo(FepsProducts, {
  foreignKey: 'product_id',
  as: 'fepsproduct'
})

FepsBuild.hasMany(FepsDeploy, {
  foreignKey: 'build_id',
  as: 'fepsdeploy'
})

FepsDeploy.belongsTo(FepsBuild, {
  foreignKey: 'build_id',
  as: 'fepsbuild'
})

// 其它
Menus.hasMany(Menus, {
  foreignKey: 'parent_id',
  // targetKey:'id',
  as: 'cMenus'
})

Menus.belongsTo(Menus, {
  foreignKey: 'parent_id',
  as: 'pMenus'
})

Product.hasMany(Menus, {
  foreignKey: 'product_id',
  // as: 'product'
})
Menus.belongsTo(Product, {
  foreignKey: 'product_id',
  as: 'product'
})


Product.belongsToMany(Roles, {
  foreignKey: 'product_id',
  targetKey: 'id',
  through:{
    model: ProductRole
  },
  as: 'pRole'
})
Roles.belongsToMany(Product, {
  foreignKey: 'role_id',
  targetKey: 'id',
  through:{
    model: ProductRole
  },
  as: 'rProduct'
})


Users.belongsToMany(Roles, {
  foreignKey: 'user_id',
  otherKey: 'role_id',
  through: {
    model: ProductUserRole
  },
  // as: 'UserRoles',
  // constraints: false
})

Roles.belongsToMany(Users, {
  foreignKey: 'role_id',
  otherKey: 'user_id',
  through: {
    model: ProductUserRole
  },
  // as: 'RoleUsers',
  // constraints: false
})

Product.belongsToMany(Roles, {
  foreignKey: 'product_id',
  otherKey: 'role_id',
  through: {
    model: ProductUserRole,
    as: "ProductRole"
  },
  as: 'role2',
  // constraints: false
})

Roles.belongsToMany(Product, {
  foreignKey: 'role_id',
  otherKey: 'product_id',
  through: {
    model: ProductUserRole,
    as: "ProductRole"
  },
  
  // constraints: false
})

Users.belongsToMany(Product, {
  foreignKey: 'user_id',
  otherKey: 'product_id',
  through: {
    model: ProductUserRole
  },
  as: 'product',
  // constraints: false
})

Product.belongsToMany(Users, {
  foreignKey: 'product_id',
  otherKey: 'user_id',
  through: {
    model: ProductUserRole,
    
  },
  // as: 'product',
  // constraints: false
})

export default models;