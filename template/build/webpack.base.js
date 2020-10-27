var path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const BuildDonw = require('./BuildDone');
var nodeExternals = require('webpack-node-externals');

const cwd = process.cwd();
const babel = require(path.join(cwd, '.babelrc.js'));

// externals是决定的是以哪种模式去加载所引入的额外的包
// 1.作用
// 首先webpack提供这个==externals==选项作用是==从打包的bundle文件中排除依赖==。
// 换句话说就是让在项目中通过import引入的依赖在打包的时候不会打包到bundle包中去，
// 而是通过script的方式去访问这些依赖。

// 2.将全局变量转为commonJS模块
// 通过webpack的externals配置项，将全局变量包装成 commomJS模块
// 通过 requier(xxx); // 这是一种模块依赖

// 不同环境设置externals方式
// 如果你的代码想运行在Node环境中，那么你需要在external中添加前缀commonjs2或者commonjs

// externals:{
//   react:'commonjs2 react',
//   jquery:'commonjs2 jquery'
// }
// 如果需要requirejs等符合AMD规范的环境中加载，那就要添加amd

// externals:{
//   react:'amd React',
//   jquery:'amd jQuery'
// }
// 如果要在浏览器中运行，那么不用添加什么前缀，默认设置就是global。

// externals:{
//   react:'React',
//   jquery:'jQuery'
// }
// 也可以这样

// https://www.cnblogs.com/skylor/p/7008756.html 【webpack整理】
module.exports = {
  entry: './index.js',
  // entry: {
  //   "dist/server":'./index.js',
  //   "plugins/chalktalk/dist/index": './plugins/chalktalk',
  //   "plugins/live-media/dist/index": './plugins/live-media',
  // },
  context: cwd,
  output: {
    filename: 'server.js',
    // filename: '[name].js',
    path: path.resolve(cwd, 'dist'),
    // libraryTarget: 'commonjs', // window|var|umd|amd|commonjs|jsonp
  },
  externals: [
    {
      './config/index.env.js': 'commonjs ./config/index.env.js'
    },
    nodeExternals({
      // whitelist: Object.keys(require('../package.json')['dependencies']),
    })
  ],//
  target: 'node',
  // 增加node配置_externals(),//nodeModules,//
  // 官方文档：这些选项可以配置是否 polyfill 或 mock 某些 Node.js全局变量和模块。这可以使最初为 Node.js 环境编写的代码，在其他环境（如浏览器）中运行。
  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    setImmediate: false,
    __filename: false,
    __dirname: false,
  },
  resolve: {
    extensions: [
      '.js','.node'//'.json', //'.mjs',
    ],
    alias: {
      '@': path.resolve(cwd)
    }
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: "babel-loader",
      options: babel
    },
    {
      test: /\.node$/,
      loader: "file-loader"
    }
      // {
      //   test: /\.mjs$/,
      //   include: /node_modules/,
      //   type: 'javascript/auto'
      // }
    ]
  },
  watchOptions: {
    ignored: [path.resolve(cwd, './dist/**/*.*'), 'node_modules']
  },
  plugins:[
    new CopyPlugin({
      patterns: [
        { from: './shell', to: 'shell' },
        // { from: './web', to: 'web' },
        { from: './config', to: 'config' },
      ],
    }),
    new BuildDonw({})
  ]
};