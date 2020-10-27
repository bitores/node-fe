

const scpClient = require("scp2");
var Client = require("ssh2").Client;

const config = global.context.$config;
const sshServer = config.sshServer;

// var conn = new Client();
// conn
//   .on("ready", function() {
//     // rm 删除dist文件，n 是换行 换行执行 重启nginx命令 我这里是用docker重启nginx
//     conn.exec(
//       "rm -rf /var/www/yiqitong/public/theme/index/default/index/index.htmln rm -rf /var/www/yiqitong/public/h5-static",
//       function(err, stream) {
//         if (err) throw err;
//         stream
//           .on("close", function(code, signal) {
//             // 在执行shell命令后，把开始上传部署项目代码放到这里面
//             scpClient.scp(
//               "dist/index.html",
//               {
//                 host: sshServer.host,
//                 port: sshServer.port,
//                 username: sshServer.username,
//                 password: sshServer.password,
//                 path: sshServer.indexpath
//               },
//               function(err) {
//                 if (err) {
//                   console.log("发布失败");
//                   throw err;
//                 } else {
//                   scpClient.scp(
//                     "dist/h5-static/",
//                     {
//                       host: sshServer.host,
//                       port: sshServer.port,
//                       username: sshServer.username,
//                       password: sshServer.password,
//                       path: sshServer.assetspath
//                     },
//                     function(err) {
//                       if (err) {
//                         console.log("发布失败");
//                         throw err;
//                       } else {
//                         console.log(
//                           "成功发布到"
//                         );
//                       }
//                     }
//                   );
//                 }
//               }
//             );

//             conn.end();
//           })
//           .on("data", function(data) {
//             console.log("STDOUT: " + data);
//           })
//           .stderr.on("data", function(data) {
//             console.log("STDERR: " + data);
//           });
//       }
//     );
//   })
//   .connect({
//     host: sshServer.host,
//     port: sshServer.port,
//     username: sshServer.username,
//     password: sshServer.password
//   });