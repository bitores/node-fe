const path = require('path');
const cwd = process.cwd();
const homeDir = process.env.HOME;
module.exports = {
  env : 'development',
  port: 1030,
  cwd: cwd,
  homeDir: homeDir,
  deployDir: path.join(homeDir, '/deploy'),
  allowOrigin:['http://localhost:1030','https://192.168.1.101:1030',"https://postwoman.io", "http://demo.nodemedia.cn","https://192.168.1.101:8000","https://192.168.1.103:8000","https://localhost:8000"],
  allowMethods: ['GET', 'POST', 'DELETE','PUT','OPTIONS'],
  allowHeaders: ['Content-Type', 'Content-Length', 'Authorization', 'Accept', 'X-Requested-With','Sys-Name'],
  staticDir: path.join(cwd, 'web'),
  uploadDir: path.join(cwd, 'web/upload'),

  jwt: {
    secret: 'jwt_secret',
    maxAge: '2h', //60, "2 days", "10h", "7d", default "120ms"
    whiteList:['/login', '/reg-user', '/webhook/gitlab', '/webhook/bitbucket', '/tool/badjs', /^\/tool\/qr\/h/, '/tool/download/file', '/feps/performance/download/zip',/^\/live/, '/ls_sketches', '/ls_sketchlibs',/^\/public\/img/]//, /^((?!\/api).)*$/,'/socket.io/'
  },
  redis: {
    enable: true,
    connectOptions: null,
  },
  database: {
    // the sql dialect of the database
    // - currently supported: 'mysql', 'sqlite', 'postgres', 'mariadb'
    dialect: 'mysql',

    // custom host; default: 127.0.0.1
    host: 'localhost',

    // custom port; default: 3306
    port: 3306,


    db: 'sso',
    username: 'root',
    password: 'root',

    
    // use pooling in order to reduce db connection overload and to increase speed
    // currently only for mysql and postgresql (since v1.5.0)
    pool: {
      maxConnections: 10,
      minConnections: 0,
      maxIdleTime: 30000
    },

    timezone: '+08:00',
    define: {
      timestamps: false,
      createdAt: 'utc_create',
      updatedAt: 'utc_modified',
      charset: 'gbk',
      collate: 'utf8mb4_unicode_ci',//"utf8_general_ci",//


      dialectOptions: {
        collate: "utf8mb4_unicode_ci",//"utf8_general_ci",// 
      }

    },

    dialectOptions: {
      // if your server run on full cpu load, please set trace to false
      trace: true,
    },

    // the storage engine for 'sqlite'
    // default store into ~/.cnpmjs.org/data.sqlite
    // storage: path.join(dataDir, 'data.sqlite'),

    logging: !!process.env.SQL_DEBUG,
    collate: 'utf8_general_ci'
  },
  
  logger: {
    enable: true,
    dataDir: path.join(homeDir || path.join(__dirname), 'logs'),
    format: '[{category}.]YYYY-MM-DD[.log]',

  },

  mail: {
    
  },
//   wx_domain: {
//     appid : 'xxxxx',
//    appsecret : 'xxxxxxxxx',
//  },
//   oss: {
//     // http://bucket4f.oss-cn-beijing.aliyuncs.com/TTT/ci-test/ele.html
//     region: 'oss-cn-xxxxxxxxxxxxxxxx',
//     accessKeyId:'xxxxxxxxxxxxxxxx',
//     accessKeySecret:'xxxxxxxxxxxxxxxx',
//     //输入华东2区的bucket name
//     bucket: 'xxxxxxxxxxxxxxxx',
//     timeout: '80s',
//   },
//   robot: {
//     token: 'xxxxxxxxxxxxxxxx'
//   }
};
