import request from '@/utils/request';
// import { TableListParams, TableListItem } from './data.d';

export async function queryList(params: any){
  return request('/article/list', {
    params,
  });
}

export async function queryDeail(params: any){
  return request('/article/detail', {
    params,
  });
}

export async function addArticle(params:any) {
  return request('/article/add', {
    method: "POST",
    data:params,
  });
}

export async function editArticle(params:any) {
  return request('/article/edit', {
    method: "POST",
    data:params,
  });
}

