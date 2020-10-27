// var qn = require('qiniu');
// var qn = require('qn');
 
// var client = qn.create({
//   accessKey: 'your access key',
//   secretKey: 'your secret key',
//   bucket: 'your bucket name',
//   origin: 'http://{bucket}.u.qiniudn.com',
//   // timeout: 3600000, // default rpc timeout: one hour, optional
//   // if your app outside of China, please set `uploadURL` to `http://up.qiniug.com/`
//   // uploadURL: 'http://up.qiniu.com/',
// });
 
// // upload a file with custom key
// client.uploadFile(filepath, {key: 'qn/lib/client.js'}, function (err, result) {
//   console.log(result);
//   // {
//   //   hash: 'FhGbwBlFASLrZp2d16Am2bP5A9Ut',
//   //   key: 'qn/lib/client.js',
//   //   url: 'http://qtestbucket.qiniudn.com/qn/lib/client.js'
//   //   "x:ctime": "1378150371",
//   //   "x:filename": "client.js",
//   //   "x:mtime": "1378150359",
//   //   "x:size": "21944",
//   // }
// });
 
// // upload a stream
// client.upload(fs.createReadStream(filepath), function (err, result) {
//   console.log(result);
//   // {
//   //   hash: 'FvnDEnGu6pjzxxxc5d6IlNMrbDnH',
//   //   key: 'FvnDEnGu6pjzxxxc5d6IlNMrbDnH',
//   //   url: 'http://qtestbucket.qiniudn.com/FvnDEnGu6pjzxxxc5d6IlNMrbDnH',
//   //   "x:filename": "foo.txt",
//   // }
// });
 
// // you also can upload a string or Buffer directly
// client.upload('哈哈', {key: 'haha.txt'}, function (err, result) {
//   console.log(result);
//   // hash: 'FptOdeKmWhcYHUXa5YmNZxJC934B',
//   // key: 'haha.txt',
//   // url: 'http://qtestbucket.qiniudn.com/haha.txt',
// });
 
// // xVariables
// client.upload(filepath, { 'x:foo': 'bar' }, function (err, result) {
//   console.log(result);
//   // hash: 'FptOdeKmWhcYHUXa5YmNZxJC934B',
//   // key: 'foobar.txt',
//   // url: 'http://qtestbucket.qiniudn.com/foobar.txt',
//   // x:foo: 'bar'
// });

export default (config)=>async (ctx, next)=>{

  

  await next();
}