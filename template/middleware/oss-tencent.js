const COS = require('cos-nodejs-sdk-v5');
const fs = require('fs');
const path = require('path');


export default (config)=>{
  
  return async (ctx, next)=>{

    var client = new COS({
        SecretId: config.SecretId,
        SecretKey: config.SecretKey
    });

    async function addFileToOSSSync(dist, src){
        var files = fs.readdirSync(src);
        files.forEach(function(file){
          var _src = path.join(src , file),
              _dist = path.join(dist , file);
          var st = fs.statSync( _src);
              // 判断是否为文件
          if( st.isFile()){
            try{
              await client.sliceUploadFile({
                Bucket: config.Bucket,
                Region: config.Region,
                Key: _dist,
                FilePath: _src
            });
            } catch(e) {
              ctx.error('上传文件失败',e)
            }
          }
          // 如果是目录则递归调用自身
          else if( st.isDirectory() ){
            // 创建目录？自动创建目录？
            addFileToOSSSync( _dist, _src);
          }
        })
      }
    
      // 增:上传
      ctx.upOssFile = async (distFile, srcFile)=>{
    
        return  await client.sliceUploadFile({
            Bucket: config.Bucket,
            Region: config.Region,
            Key: distFile,
            FilePath: srcFile
        });
      }
    
      ctx.upOssDir = async (dist, src)=>{
        
        return await addFileToOSSSync(dist, src);
      }
      // 删,改：
      ctx.deleteOssFile = async (key)=>{
    
        return await client.deleteObject({
            Bucket: config.Bucket,
            Region: config.Region,
            Key: key
        });
      }
      // 查：列表 list get
      ctx.listOssFile = async ()=>{
    
        return await client.getBucket({
            Bucket: config.Bucket,
            Region: config.Region,
        });
      }
    
    //   ctx.getOssFile = async (...args)=>{
    
    //     return await client.get(...args);
    //   }
      
    //   // 同一个 bucket 内拷贝， 或同一个 region 内
    //   ctx.copyOssFile = async (...args)=>{
    
    //     return await client.copy(...args);
    //   }


    await next();
  }
}