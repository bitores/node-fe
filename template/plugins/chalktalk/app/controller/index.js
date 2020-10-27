import {
  Controller,
  Get,
  Post,
  Put,
  Middleware
} from 'bitorjs';
const fs = require('fs');

@Controller('/')
export default class {

  @Get('ls_sketchlibs')
  async ls_sketchlibs(ctx, next){
    console.log("ls_sketchlibs")
    const res = ctx.res;
    ctx.status = 200;
    return new Promise(()=>{
      this.readDir(res, "sketchlibs", ".js");
    })
  }

  @Get('ls_sketches')
  async ls_sketches(ctx, next){
    console.log('ls_sketches')
    const res = ctx.res;
    ctx.status = 200;
    return new Promise(()=>{
      this.readDir(res, "sketches", ".js");
    })
  }


  readDir(res, dirName, extension) {
    console.log(process.cwd())
    fs.readdir(`${process.cwd()}/plugins/chalktalk/` + dirName + "/", function(err, files) {
       if (err) {
          if (err.code === "ENOENT") {
             // Directory not found, return empty string
             res.writeHead(200, { "Content-Type": "text/plain" });
          }
          else {
             res.writeHead(500, { "Content-Type": "text/plain" });
             res.write(err.message);
             console.log("error listing the " + dirName + " directory" + err);
          }
          res.end();
          return;
       }
 
       res.writeHead(200, { "Content-Type": "text/plain" });
       for (var i = 0; i < files.length; i++) {
          if (!extension || files[i].toLowerCase().endsWith(extension.toLowerCase())) {
             res.write(files[i] + "\n");
          }
       }
       res.end();
    });
 }
}