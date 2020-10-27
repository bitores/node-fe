const WebpackMerge = require('webpack-merge');
const WebpackShellPlugin = require('webpack-shell-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const base = require('./webpack.base');

const cwd = process.cwd();

// the clean options to use
let cleanOptions = {
  // root: cwd,
  cleanOnceBeforeBuildPatterns: ['**/*','!node_modules/**'],
  verbose: true,
  dry: false
}


module.exports = WebpackMerge(base, {
  mode: 'production',
  plugins: [
    // new CleanWebpackPlugin(cleanOptions),
    new WebpackShellPlugin({
      onBuildEnd: [
        // `cd ./dist`,
        // 'npm install --dependencies',
        // "node server.js",
        // "mkdir -p ./dist/xxx"
        // "echo "
        // + require('../package.json')
        // + " >> ./dist/package.json"
      ]
    })
  ]
});