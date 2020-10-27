// https://babel.docschina.org/    Babel 中文网
module.exports = {
  "presets": [
    [
      // https://blog.csdn.net/qq_42606051/article/details/82589467

      // targets, useBuiltIns 等选项用于编译出兼容目标环境的代码
      // 其中 useBuiltIns 如果设为 "usage"
      // Babel 会根据实际代码中使用的 ES6/ES7 代码，以及与你指定的 targets，按需引入对应的 polyfill
      // 而无需在代码中直接引入 import '@babel/polyfill'，避免输出的包过大，同时又可以放心使用各种新语法特性。
      // preset-dev 中只会转化新的 Javascript 语法，不会转化新的 api， 如Generator / Set / Map 等
      // --原理 babel-folyfill 是修改全局的对象的原型，添加不兼容的 api 方法，或者修改不兼容的 api 方法。
      // transform-runtime 与 babel-polyfill 一样，解决不兼容的全局 api ,与 babel-polyfill 不同是它不是添加/修改全局对象。
      // 　　它是对不兼容的方法进行特殊处理，也就是添加辅助方法来做兼容。
      // 　　并且 transform-runtime 是在需要进行兼容转化时候引用。
      // 　　transform-runtime 是依赖 babel-runtime ，且辅助方法都是引用的 babel-runtime
      // preset-dev + folyfill
      "@babel/preset-env",
      {
        "targets": {
          "node": "current",
          // "browsers": [
          //   // "last 1 Chrome versions",
          //   // "Android >= 4.0", "ios >= 6", // 有问题，class 等node 语法未转换
          //   'last 2 Chrome versions', 'last 2 Safari versions', 'last 2 Firefox versions', //
          // ]
        },
        //是否将ES6的模块化语法转译成其他类型
        //参数："amd" | "umd" | "systemjs" | "commonjs" | false，默认为'commonjs'
        "modules": 'commonjs',
        //是否进行debug操作，会在控
        //是否进行debug操作，会在控制台打印出所有插件中的log，已经插件的版本
        debug: true,
        //babel / preset-env处理polyfill的方式。
        //参数：usage | entry | false，默认为false.
        "useBuiltIns": false
        // entry：在引用程序入口导入一次babel / polyfill，多次导入可能会有全局冲突或其他问题。
        // usage：自动为每个文件添加特定的polyfill
        // false：不要为每个文件自动添加polyfill，也不要将“@ babel / polyfill”导入到单个polyfill。
      }
    ]
  ],
  "plugins": [
    [
      "@babel/plugin-proposal-decorators",
      {
        "legacy": true
      }
    ],
    "@babel/plugin-proposal-export-default-from",
    "@babel/plugin-proposal-export-namespace-from",
    "@babel/plugin-syntax-export-namespace-from",
    "@babel/plugin-syntax-dynamic-import",
    "@babel/plugin-transform-spread",
    "@babel/plugin-syntax-object-rest-spread",
    ["@babel/plugin-proposal-object-rest-spread", {
      "loose": true,
      "useBuiltIns": true
    }],
    [
      "@babel/plugin-proposal-class-properties",
      {
        "loose": true
      }
    ]
  ]
}

// target : 描述您为项目配置的 支持/定位 的环境
// 　　　　browsers ：浏览器的支持情况，将返回支持浏览器列表。 会被 target.ie 覆盖
// 　　　　　　[ 'ie>=8' ]    支持 ie8 的环境
// 　　　　　　"default"     默认
// 　　　　node ：指定是 node 环境，且可以指定版本
// 　　　　safari : safari 版本
// 　　modules : 启用将 es6 转为其他模块
// 　　debug ： 是否启用 console.log　
// 　　include / exclude : 必须启用的 plugin 功能 / 不启用的 plugin 功能
// 　　uglify : 压缩代码
// 　　useBuiltIns ： 
// 　　　　false ： 引用所有的 babel-polyfill ， 在 webpack 中添加 babel-polyfill 入口处：
// 　　　　　　　   entry:[ 'babel-polyfill' , 'index.js' ] , 引用所有的 polyfill，体积变大
// 　　　　true ： 引用部分，根据配置的 preset-env 环境，引用 polyfill ，
// 　　　　　　　  在入口文件中要引用 babel-polyfill