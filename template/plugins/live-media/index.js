import NodeMedia from './src';
// const NodeMedia = require('./src')

export default (app, options)=>{
  app.watch(require.context("./app", true, /.*\.js$/));


  var nms = new NodeMedia(app.$config.liveMedia)
  nms.run()
}