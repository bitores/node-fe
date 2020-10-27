// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const path = require('path');
const fs = require('fs');
const { REACT_APP_ENV } = process.env;

export default defineConfig({
  publicPath: './',
  base: '/',
  hash: true,
  history: {type:"hash"},
  antd: {
    // dark: true, // 开启暗色主题
    // compact: true, // 开启紧凑主题
  },
  dva: {
    hmr: true,
  },
  
  devServer:{
    host:'0.0.0.0',
    port: 8000,
    https: {
      // key:fs.readFileSync(path.join(process.cwd(),'config/keys/key.pem')),
      // cert:fs.readFileSync(path.join(process.cwd(),'config/keys/cert.pem'))
      key:'config/keys/key.pem',
      cert:'config/keys/cert.pem'
    },

  },
  locale: {
    // default zh-CN
    default: 'zh-CN',
    // default true, when it is true, will use `navigator.language` overwrite default
    antd: false,
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
    // welcome: '@/pages/Welcome'
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/user',
      component: '../layouts/UserLayout',
      routes: [
        {
          name: 'login',
          path: '/user/login',
          component: './user/login',
        },
        {
          name: 'github.login',
          path: '/user/login/github',
          component: './user/login/github',
        },
        // {
        //   name: 'register-result',
        //   icon: 'smile',
        //   path: '/user/register-result',
        //   component: './user/register-result',
        // },
        {
          name: 'register',
          icon: 'smile',
          path: '/user/register',
          component: './user/register',
        },
      ],
    },
    {
      path: '/',
      component: '../layouts/SecurityLayout',
      routes: [
        {
          path: '/',
          component: '../layouts/BasicLayout',
          authority: ['SUPER_ADMIN','ORG_ADMIN'],
          routes: [
            {
              path: '/',
              redirect: '/home',
            },
            {
              name: '日历',
              path: '/home',
              hideInBreadcrumb: true,
              icon: 'OrderedList',
              component: './home/Calendar',
            },
            {
              path: '/sys',
              name: '系统',
              icon: 'setting',
              routes:[
                {
                  path: '/sys/setting',
                  name: '基本设置',
                  routes: [
                    
                  ]
                },
                {
                  path: '/sys/rms',
                  name: '权限管理',
                  routes:[
                    
                    {
                      path: '/sys/rms/ops',
                      name: '操作管理',
                      component: './sys/rms/ops'
                    },
                    {
                      path: '/sys/rms/resource',
                      name: '资源管理',
                      component: './sys/rms/resource'
                    },
                    {
                      path: '/sys/rms/roles',
                      name: '角色管理',
                    },
                    {
                      path: '/sys/rms/role-rihgth',
                      name: '角色权限管理',
                    },
                    {
                      path: '/sys/rms/role-user',
                      name: '角色用户管理',
                    },
                    {
                      path: '/sys/rms/user-role',
                      name: '用户角色管理',
                    },
                  ]
                },
                {
                  path: '/sys/xxx',
                  name: '租户管理',
                },
                {
                  path: '/sys/xxx',
                  name: '项目管理',
                },
                {
                  path: '/sys/org',
                  name: '组织架构',
                  routes:[
                    {
                      path: '/sys/org/dept', //department
                      name: '部门管理',
                    },
                    {
                      path: '/sys/org/pos', // position
                      name: '职位管理',
                    },
                  ]
                },
                {
                  path: '/sys/users',
                  name: '用户管理',
                },
                {
                  path: '/sys/logs',
                  name: '日志管理',
                  routes:[
                    {
                      path:'/sys/logs/login',
                      name: '登录日志',
                    },
                    {
                      path:'/sys/logs/opt',
                      name: '操作日志',
                    },
                  ]
                }
              ]
            },
            {
              path: '/resource',
              name: '资源管理',
              icon: 'setting',
              authority: ['SUPER_ADMIN', 'PROD_ADMIN'],
              routes:[
                {
                  name: '用户列表',
                  path: '/resource/users/index',
                  component: './manager/users/index',
                  authority: ['SUPER_ADMIN','ORG_ADMIN'],
                },
                {
                  name: '角色列表',
                  path: '/resource/roles/index',
                  component: './manager/roles/index',
                  authority: ['SUPER_ADMIN'],
                },
                {
                  name: '产品列表',
                  path: '/resource/products/index',
                  component: './manager/products/index',
                  authority: ['SUPER_ADMIN'],
                }
              ]
            },
            {
              path: '/product',  
              name: '项目',
              icon: 'project', 
              hideInMenu: true,           
              authority: ['SUPER_ADMIN'],
              routes:[
                {
                  name: '列表',
                  path: '/product/list',
                  component: './manager/products/product',
                  authority: ['SUPER_ADMIN'],
                },

                {
                  name: '用户分配',
                  path: '/product/users',
                  component: './manager/users/product',
                  authority: ['SUPER_ADMIN'],
                },
                
                {
                  name: '角色分配',
                  path: '/product/roles',
                  component: './manager/roles/product',
                  authority: ['SUPER_ADMIN'],
                },

                {
                  name: '菜单分配',
                  path: '/product/menus',
                  component: "./manager/menus/product",
                  authority: ['SUPER_ADMIN'],
                },
              ]
            },
            // {
            //   name: 'menus',
            //   icon: 'menu',
            //   path: '/menus',
            //   authority: ['SUPER_ADMIN'],
            //   routes:[
                
            //   ]
            // },
            {
              name: '前端',
              icon: 'tool',
              path: '/fe',
              // hideInMenu: true,
              // hideChildrenInMenu: true,
              // hideInBreadcrumb: true,
              authority: ['SUPER_ADMIN'],
              dynamic: true,
              hideInBreadcrumb: false,
              routes:[
                {
                  name: '部署列表',
                  icon: 'ci',
                  path: '/fe/feps/list/0',
                  // redirect: '/fe/feps/list/0',
                  authority: ['SUPER_ADMIN'],
                  hideChildrenInMenu: true,
                  routes:[
                    // 子菜单选中，但父菜单依然高亮
                    {
                      name:'部署列表',
                      // hideInMenu: true,
                      path: '/fe/feps/list/:productId?',
                      component: './fe/feps/products',
                      authority: ['SUPER_ADMIN'],
                    },
                    {
                      name: '项目部署日志',
                      // hideInMenu: true,
                      path: '/fe/feps/logs/:productId?',
                      component: './fe/feps/logs',
                      authority: ['SUPER_ADMIN'],
                    },
                  ]
                },

                
                {
                  name: '实时日志',
                  path: '/fe/feps/log/real-time',
                  icon: 'FieldTime',
                  component: './fe/feps/build-log',
                  authority: ['SUPER_ADMIN'],
                },
                {
                  name: '性能监测',
                  icon: 'lineChart',
                  path: '/fe/performance',
                  component:'./fe/performance/index',
                },
                {
                  name: 'files',
                  icon: 'file',
                  path: '/fe/files',
                  component: './fe/files',
                },
                {
                  name: 'bugs',
                  icon: 'bug',
                  path: '/fe/warning',
                  component:'./fe/bugs/index',
                },
                {
                  name: '设计器',
                  icon: 'global',
                  hideInBreadcrumb: true,
                  path: '/fe/design',
                  routes:[
                    {
                      name: '快站设计0',
                      icon: 'global',
                      hideInBreadcrumb: true,
                      path: '/fe/design/kuaizhan0',
                      component: './fe/design/kuaizhan0/index'
                    },
                    {
                      name: '快站设计1',
                      icon: 'global',
                      hideInBreadcrumb: true,
                      path: '/fe/design/kuaizhan1',
                      component: './fe/design/kuaizhan1/index'
                    },
                    {
                      name: '快站设计2',
                      icon: 'global',
                      hideInBreadcrumb: true,
                      path: '/fe/design/kuaizhan2',
                      component: './fe/design/kuaizhan2/index'
                    }
                  ]
                  
                },
           
              ]
            },
            // {
            //   name: 'articles',
            //   icon: 'snippets',
            //   path: '/fe/articles',
            //   component: './fe/articles/list',
            //   authority: ['SUPER_ADMIN'],
            // },
            // {
            //   name: 'articles.create',
            //   icon: 'snippets',
            //   path: '/fe/article/create',
            //   hideInMenu: true,
            //   component: './fe/articles/create',
            //   authority: ['SUPER_ADMIN'],
            // },
            // 文档管理
            {
              path: '/posts',
              name: '文档管理',
              // redirect: '/posts/list',
              icon: 'form',
              hideInBreadcrumb: true,
              // component: PageView,
              // meta: { title: '文章', icon: 'form' },
              routes: [
                {
                  name: '文档列表',
                  path: '/posts/list',
                  
                  // component: './articles/list',
                  // component: () => import('@/views/post/PostList'),
                  // meta: { title: '所有文章', hiddenHeaderContent: false }
                  hideChildrenInMenu: true,
                  routes:[
                    {
                      name: '文档列表',
                      path: '/posts/list',
                      
                      component: './articles/list',
                    },
                    {
                      name: '详情',
                      path: '/posts/list/:id',
                      
                      // hideInMenu: true,
                      component: './articles/detail',
                    }
                  ]
                },
                // {
                //   path: '/posts/detail/:id',
                //   name: '详情',
                //   hideInMenu: true,
                //   component: './articles/detail',
                //   // component: () => import('@/views/post/PostList'),
                //   // meta: { title: '所有文章', hiddenHeaderContent: false }
                // },
                {
                  path: '/posts/write',
                  name: '写文章',
                  component: './articles/create',
                  // component: () => import('@/views/post/PostEdit'),
                  // meta: { title: '写文章', hiddenHeaderContent: false, keepAlive: false }
                },
                {
                  path: '/posts/write/:id',
                  component: './articles/create',
                  // component: () => import('@/views/post/PostEdit'),
                  // meta: { title: '写文章', hiddenHeaderContent: false, keepAlive: false }
                },
                // {
                //   path: '/categories',
                //   name: 'CategoryList',
                //   // component: () => import('@/views/post/CategoryList'),
                //   // meta: { title: '分类目录', hiddenHeaderContent: false }
                // },
                // {
                //   path: '/tags',
                //   name: 'TagList',
                //   // component: () => import('@/views/post/TagList'),
                //   // meta: { title: '标签', hiddenHeaderContent: false }
                // }
              ]
            },
            
            {
              name: '工具',
              icon: 'tool',
              path: '/tools',
              routes:[
                {
                  name: '上传',
                  icon: 'cloudUpload',
                  path: '/tools/upload',
                  component:'./tools/upload/index',
                },
                {
                  name: '定时任务',
                  icon: 'ClockCircle',
                  path: '/tools/schedule',
                  component:'./tools/schedule/index',
                },
                {
                  name: '二维码',
                  icon: 'qrcode',
                  path: '/tools/qr/index',
                  component:'./tools/qr/index',
                },
                {
                  name: '二维码解码器',
                  icon: 'qrcode',
                  path: '/tools/qr/deqr',
                  component:'./tools/qr/deqr',
                },
                {
                  name: '二维活码',
                  icon: 'qrcode',
                  path: '/tools/qr/list',
                  component:'./tools/qr/list',
                },
                {
                  name: '微信域名检测',
                  icon: 'wechat',
                  path: '/tools/wx-check-domain',
                  component: './tools/wx-check-domain/index'
                },
                {
                  name: '图片美化',
                  icon: 'picture',
                  path: '/tools/pretty-photo',
                  component:'./tools/pretty-photo/index',
                },
                {
                  name: '百度字',
                  icon: 'fontColors',
                  path: '/tools/hanyu',
                  component:'./tools/hanyu/index',
                },
                {
                  name: '拼音转换',
                  icon: 'fontColors',
                  path: '/tools/hanyu/pinyin',
                  component:'./tools/hanyu/pinyin',
                },
              ]
            },
            {
              name: '直播',
              icon: 'videoCamera',
              path: '/media/live',
              // component: './media/index',
              routes:[
                {
                  name: '鉴权直播',
                  icon: 'right',
                  path: '/media/live/auth',
                  component: './media/index',
                },
                {
                  name: '拉转直播',
                  icon: 'right',
                  path: '/media/live/pull',
                  component: './media/index',
                },
                {
                  name: '开放直播',
                  icon: 'right',
                  path: '/media/live/open',
                  component: './media/index',
                },
                {
                  name: '云端录像',
                  icon: 'right',
                  path: '/media/live/playback',
                  component: './media/index',
                },
                {
                  name: '直播快照',
                  icon: 'right',
                  path: '/media/live/shot',
                  component: './media/index',
                },
                {
                  name: '直播配置',
                  icon: 'right',
                  path: '/media/live/config',
                  component: './media/index',
                },
                {
                  name: '阿里播放器',
                  icon: 'right',
                  path: '/media/live/ali-player',
                  component: './media/ali-player',
                },
                {
                  name: 'react播放器',
                  icon: 'right',
                  path: '/media/live/react-player',
                  component: './media/m-player',
                },
                {
                  name: '面部识别',
                  icon: 'right',
                  path: '/media/live/face',
                  component: './media/face',
                },
                
              ]
            },
            {
              name: '聊天室',
              path: '/chat',
              icon: 'comment',
              routes:[
                {
                  name: '聊天大厅',
                  icon: 'desktop',
                  path: '/chat/hall',
                  component:'./chat/hall/index',
                },
                {
                  name: '聊天机器人',
                  icon: 'robot',
                  path: '/chat/robot',
                  component:'./chat/dsi/index',
                },
                {
                  name: '语音聊天室',
                  icon: 'whatsApp',
                  path: '/chat/audio',
                  component:'./chat/dsi/index',
                },
                {
                  name: '私人聊天室',
                  icon: 'mobile',
                  path: '/chat/mine',
                  redirect: '/chat/mine/115',
                  // component:'./chat/1v1/index',
                },
                {
                  // name: '私人聊天室',
                  icon: 'mobile',
                  path: '/chat/mine/:roomId',
                  component:'./chat/p2p/index',
                },
                {
                  name: '多人聊天室',
                  icon: 'wechat',
                  path: '/chat/ours',
                  component:'./chat/dsi/index',
                },
                {
                  name: '家庭影院',
                  icon: 'home',
                  path: '/chat/family',
                  component: './chat/1vm/webrtc',
                },
                {
                  name: '共享影院',
                  icon: 'shareAlt',
                  path: '/chat/share',
                  component: './chat/1vm/webrtc',
                },
              ]
            },
            {
              name:  '模板一',
              hideInMenu: true,
              path: '/template/template01/:pageId',
              component: './dynamic/template01/index'  // 模板一
            },
            {
              name:  '模板二',
              hideInMenu: true,
              path: '/template/template02/:pageId',
              component: './dynamic/template02/index'  // 模板一
            },
            {
              name:  '模板三',
              hideInMenu: true,
              path: '/template/template03/:pageId',
              component: './dynamic/template03/index'  // 模板一
            },
            {
              icon:'layout',
              name:  'UI测试',
              path: '/ui-test',
              routes:[
                {
                  name: 'Form表单',
                  path: '/ui-test/xxxx',
                  component: './lib-test/index'  // 模板一
                },{
                  name: '脑图',
                  path: '/ui-test/mind-map',
                  component: './lib-test/mindmap'  // 模板一
                },{
                  name: 'chalk-talk',
                  path: '/ui-test/chalk-talk',
                  component: './chalktalk/index'  // 模板一
                },

              ]
              
            },
            {
              component: './404',
            },
          ],
        },
        {
          component: './404',
        },
      ],
    },
    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  // @ts-ignore
  title: false,
  ignoreMomentLocale: true,
  manifest: {
    basePath: '/',
  },
  chainWebpack(config, { webpack }) {

    config.plugin('editor').use(MonacoWebpackPlugin, ['apex', 'azcli', 'bat', 'clojure', 'coffee', 'cpp', 'csharp', 'csp', 'css', 'dockerfile', 'fsharp', 'go', 'handlebars', 'html', 'ini', 'java', 'javascript', 'json', 'less', 'lua', 'markdown', 'msdax', 'mysql', 'objective', 'perl', 'pgsql', 'php', 'postiats', 'powerquery', 'powershell', 'pug', 'python', 'r', 'razor', 'redis', 'redshift', 'ruby', 'rust', 'sb', 'scheme', 'scss', 'shell', 'solidity', 'sql', 'st', 'swift', 'typescript', 'vb', 'xml', 'yaml'])

  }
});
