const OSS = require('ali-oss');
const path = require('path');
const fs = require('fs');
const mime = require('mime');


export default (config={})=>{
  
  // 配置如 region: 'oss-cn-hangzhou-internal'  需要在阿里服务器内网中使用，如果没有 -internal 则为外网中使用
  const client = new OSS(config);


  function addFileToOSSSync(dist, src){
    let ret  =[];
    var files = fs.readdirSync(src);
    files.forEach(file=>{
      var _src = path.join(src , file),
          _dist = path.join(dist , file);
      var st = fs.statSync( _src);
          // 判断是否为文件
      if( st.isFile()){
        ret.push({
          dist: _dist,
          src: _src,
        })
      } else if( st.isDirectory() ){
        // 创建目录？自动创建目录？
        let r = addFileToOSSSync( _dist, _src);
        ret.push(...r);
      }
    })

    return ret;
  }

  const upOssFile = async (distFile, srcFile)=>{

    return  await client.put(distFile, srcFile);
  }

  const upOssDir = async (dist, src)=>{
    const upfiles = addFileToOSSSync(dist, src);
    for (let index = 0, len = upfiles.length; index < len; index++) {
      const file = upfiles[index];
      try {
        await client.put(file.dist, file.src);
      } catch (error) {
        throw error;
      }
    }
    return true;
  }
  // 删,改：
  const deleteOssFile = async (...args)=>{

    return await client.delete(...args);
  }
  // 查：列表 list get
  const listOssFile = async (...args)=>{

    return await client.list(...args);
  }

  const getOssFile = async (...args)=>{

    return await client.get(...args);
  }
  
  // 同一个 bucket 内拷贝， 或同一个 region 内
  const copyOssFile = async (...args)=>{

    return await client.copy(...args);
  }

  return async (ctx, next)=>{
    ctx.upOssFile = upOssFile;

    ctx.upOssDir = upOssDir
    // 删,改：
    ctx.deleteOssFile = deleteOssFile;
    // 查：列表 list get
    ctx.listOssFile = listOssFile;

    ctx.getOssFile = getOssFile;
    
    // 同一个 bucket 内拷贝， 或同一个 region 内
    ctx.copyOssFile = copyOssFile;


    // 增:上传
    
    await next();
  }

}