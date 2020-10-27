// import { dynamic } from "umi";
import {dynamic} from 'dva';
import request from '@/utils/request';

let authRoutes = [];
function buildRoutes(authRoutes) {
  return (authRoutes || []).map((item) => {
    if (item.cMenus && item.cMenus.length > 0) {
      return {
        path: item.menu_path,
        name: item.name,
        icon: 'user',//<UserAddOutlined />,
        routes: buildRoutes(item.cMenus),
      };
      
    }
    return {
      path: item.menu_path,
      name: item.name,
      component:item.menu_component && dynamic({ component: () => import(`@/pages${item.menu_component }`) }),
    };
  });
}

export function render(oldRoutes) {
  console.log("--- render")
  request.get('/menu/side').then(res=>{
    console.log(res)
    if(res.status) {
      let entry = res.entry||[];
      authRoutes = buildRoutes(entry)
      oldRoutes()
    }
  })
  // 获取新的权限路由
  // setTimeout(()=>{
    //oldRoutes 执行前,页面会一直 loading
  // }, 2000)
  
}

// 用于运行时修改路由
export function patchRoutes({ routes }) {
  console.log("---- patchRoutes", authRoutes);

  // 设置新的权限路由，return newPathes;
  routes[1].routes[0].routes.push(...authRoutes)
  // routes[1].routes[0].routes.push({
  //   path: '/users',
  //   name: 'users',
  //   // icon: 'user',
  //   authority: ['SUPER_ADMIN', 'PROD_ADMIN'],
  //   routes:[
      
  //     {
  //       name: 'org',
  //       path: '/users/index',
  //       // component: require("@/pages/manager/users/index").default,
  //       component:  dynamic({
  //         component: ()=>import('@/pages/manager/users/index')
  //       }),
  //       authority: ['SUPER_ADMIN','ORG_ADMIN'],
  //     },
  //     {
  //       name: 'product',
  //       path: '/users/product',
  //       // component: require("@/pages/manager/users/product").default,
  //       component: dynamic({
  //         component: ()=>import('@/pages/manager/users/product')
  //       }),
  //       authority: ['SUPER_ADMIN'],
  //     },
  //   ]
  // },{
  //   path: '/roles',
  //   name: 'roles',
  //   // icon: 'user',
  //   authority: ['SUPER_ADMIN', 'PROD_ADMIN'],
  //   routes:[
      
  //      {
  //       name: 'org',
  //       path: '/roles/org',
  //       // component: './manager/roles/index',
  //       component: dynamic({
  //         component: ()=>import('@/pages/manager/roles/index')
  //       }),
  //       authority: ['SUPER_ADMIN'],
  //     },
  //     {
  //       name: 'product',
  //       path: '/roles/product',
  //       // component: './manager/roles/product',
  //       component: dynamic({
  //         component: ()=>import('@/pages/manager/roles/product')
  //       }),
  //       authority: ['SUPER_ADMIN'],
  //     }
  //   ]
  // },
  // {
  //   name: 'products',
  //   // icon: 'user',
  //   path: '/products/list',
  //   // component: './manager/products/index',
  //   component: dynamic({
  //     component: ()=>import('@/pages/manager/products/index')
  //   }),
  //   authority: ['SUPER_ADMIN'],
  // },
  // {
  //   name: 'menus',
  //   // icon: 'user',
  //   path: '/menus',
  //   // component: './manager/products/index',
  //   // component: dynamic({
  //   //   component: ()=>import('@/pages/manager/products/index')
  //   // }),
  //   authority: ['SUPER_ADMIN'],
  //   routes:[
  //     {
  //       name: 'product',
  //       // icon: 'user',
  //       path: '/menus/list',
  //       component: dynamic({
  //         component: ()=>import('@/pages/manager/menus/index')
  //       }),
  //       authority: ['SUPER_ADMIN'],
  //     },
  //     // {
  //     //   name: 'product',
  //     //   // icon: 'user',
  //     //   path: '/menus/list',
  //     //   component: dynamic({
  //     //     component: ()=>import('@/pages/manager/menus/index')
  //     //   }),
  //     //   authority: ['SUPER_ADMIN'],
  //     // },
  //   ]
  // },
//  )
  routes[1].routes[0].routes.push(
    {
      component: dynamic({
        component: ()=>import('@/pages/404')
      }),
    }
  )
  return [];
}

// export function onRouteChange({ location, routes, action }) {
//   // bacon(location.pathname);
//   console.log(location, routes, action)
// }