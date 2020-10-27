import request from '@/utils/request';
// import { TableListParams, TableListItem } from './data.d';

export async function queryRoles(params:any) {
  return request('/role/list', {
    params,
  });
}

export async function queryProductRoleList(params:any) {
  return request('/role/product/list', {
    params,
  });
}

export async function queryUsers(params:any) {
  return request('/user/list', {
    params,
  });
}

export async function queryProductUsers(params:any) {
  return request('/product/users', {
    params,
  });
}

export async function queryProducts(params:any) {
  return request('/product/list', {
    params,
  });
}

export async function queryMenus(params:any) {
  return request('/menu/list', {
    params,
  });
}

export async function addProduct(params:any) {
  return request('/product/add', {
    method: "POST",
    data:params,
  });
}

export async function editProduct(params:any) {
  return request('/product/edit', {
    method: "POST",
    data:params,
  });
}

export async function delProduct(params:any) {
  return request('/product/del', {
    method: "POST",
    data:params,
  });
}

export async function addProductRole(params:any) {
  return request('/role/product/add', {
    method: "POST",
    data:params,
  });
}

export async function editProductRole(params:any) {
  return request('/role/product/edit', {
    method: "POST",
    data:params,
  });
}

export async function delProductRole(params:any) {
  return request('/role/product/del', {
    method: "POST",
    data:params,
  });
}

export async function addOrgRole(params:any) {
  return request('/role/org/add', {
    method: "POST",
    data:params,
  });
}

export async function editOrgRole(params:any) {
  return request('/role/org/edit', {
    method: "POST",
    data:params,
  });
}

export async function delOrgRole(params:any) {
  return request('/role/org/del', {
    method: "POST",
    data:params,
  });
}


export async function addProductUser(params:any) {
  return request('/product/addUser', {
    method: "POST",
    data:params,
  });
}

export async function editProductUser(params:any) {
  return request('/product/editUser', {
    method: "POST",
    data:params,
  });
}

export async function delProductUser(params:any) {
  return request('/product/delUser', {
    method: "POST",
    data:params,
  });
}

export async function addUser(params:any) {
  return request('/user/add', {
    method: "POST",
    data:params,
  });
}

export async function editUser(params:any) {
  return request('/user/edit', {
    method: "POST",
    data:params,
  });
}

export async function delUser(params:any) {
  return request('/user/del', {
    method: "POST",
    data:params,
  });
}

export async function addMenu(params:any) {
  return request('/menu/add', {
    method: "POST",
    data:params,
  });
}

export async function editMenu(params:any) {
  return request('/menu/edit', {
    method: "POST",
    data:params,
  });
}

export async function delMenu(params:any) {
  return request('/menu/del', {
    method: "POST",
    data:params,
  });
}
