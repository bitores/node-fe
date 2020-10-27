const webpack = require('webpack')
const WebpackMerge = require('webpack-merge');
const WebpackShellPlugin = require('webpack-shell-plugin');
const base = require('./webpack.base');
// var OpenBrowserPlugin = require('open-browser-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

const cwd = process.cwd();

// the path(s) that should be cleaned
// the clean options to use
let cleanOptions = {
  root: cwd,
  exclude: ['shared.js'],
  verbose: true,
  dry: false
}

module.exports = WebpackMerge(base, {
  mode: 'development',
  plugins: [
    // new CleanWebpackPlugin(cleanOptions),
    // new OpenBrowserPlugin({ url: 'http://localhost:1029' }),
    /* HMR plugin */
    new webpack.HotModuleReplacementPlugin(),
    /* 当 HMR 替换时在浏览器控制台输出对用户更友好的模块名字信息 */
    new webpack.NamedModulesPlugin(),
    new WebpackShellPlugin({
      onBuildEnd: [
        `npm run dev`
      ]
    })
  ]
});