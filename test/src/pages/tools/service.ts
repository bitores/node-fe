import request from '@/utils/request';
// import { TableListParams, TableListItem } from './data.d';



export async function toolUploadFile(params:any) {
  return request('/tool/upload-file', {
    method: "POST",
    data:params,
  });
}

export async function toolUploadFiles(params:any) {
  return request('/tool/upload-files', {
    method: "POST",
    data:params,
  });
}

export async function toolScheduleList(params: any){
  return request('/tool/schedule/list', {
    params,
  });
}

export async function toolScheduleAdd(params: any){
  return request('/tool/schedule/add', {
    method: "POST",
    data:params,
  });
}

export async function toolScheduleDel(params: any){
  return request('/tool/schedule/del', {
    method: "POST",
    data:params,
  });
}

export async function toolScheduleStart(params: any){
  return request('/tool/schedule/start', {
    method: "POST",
    data:params,
  });
}

export async function toolQrList(params: any){
  return request('/tool/qr/list', {
    params,
  });
}

export async function toolQrAdd(params: any){
  return request('/tool/qr/add', {
    method: 'POST',
    data: params,
  });
}

export async function toolQrEdit(params: any){
  return request('/tool/qr/edit', {
    method: 'POST',
    data: params,
  });
}

export async function toolQrDel(params: any){
  return request('/tool/qr/del', {
    method: 'POST',
    data: params,
  });
}
// 微信域名检测
export async function checkWxDomain(params: any) {
  return request('/tool/wx-domain/check', {
    method: 'POST',
    data: params,
  })
}
export async function syncWxDomainData(params: any) {
  return request('/tool/wx-domain/sync', {
    method: 'POST',
    data: params,
  })
}

export async function addWxDomain(params: any) {
  return request('/tool/wx-domain/add', {
    method: 'POST',
    data: params,
  })
}

export async function listWxDomain(params: any){
  return request('/tool/wx-domain/list', {
    params,
  });
}
// 字搜索
export async function quryWordList(params: any){
  return request('/tool/word/list', {
    params,
  });
}

export async function collectWord(data: any){
  return request('/tool/word/collect', {
    method: 'POST',
    data,
  });
}

export async function batchCollectWord(data: any){
  return request('/tool/word/batchcollect', {
    method: 'POST',
    data,
  });
}