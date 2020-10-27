const fs = require('fs');
const pkg = require('../package.json'); 

function BuildDone(options) {
  // 使用 options 设置插件实例……
}

BuildDone.prototype.apply = function(compiler) {
  compiler.plugin('done', function() {
    console.log('build done!');
    const data = {
      
    };
    ['name', 'version','author','description', "main", "script","dependencies"].map(k=>{
      data[k] = pkg[k];
    })
    data.main = "./server.js";
    data.script =  {
      start: "pm2 start ./server.js",
      serve: "npm run start",
      server: "npm run start"
    }
    
    fs.writeFile('./dist/package.json',
    
    JSON.stringify(data, null, "\t")
    ,function(err,){
      if(err){
        console.log(err)
      }
    })

  });
};

module.exports = BuildDone;