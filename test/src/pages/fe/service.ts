import request from '@/utils/request';


// feps
export async function queryFepsProducts(params:any) {
  return request('/feps/products', {
    params,
  });
}

export async function queryFepsBuild(params:any) {
  return request('/feps/build/list', {
    params,
  });
}

export async function fepsDeploy(params:any) {
  return request('/feps/deploy', {
    method: "POST",
    data:params,
  });
}

export async function queryFepsLogs(params:any) {
  return request('/feps/logs/list', {
    params,
  });
}

// log
export async function queryRealTimeLog(params: any) {
  return request('/feps/log/real-time');
}

// performance...
export async function queryLatestAnalize(params:any){
  return request('/feps/performance/list', {
    params
  })
}
// analizę
export async function analizę(params: any) {
  return request('/feps/performance/analize', {
    method: "POST",
    data:params,
  });  
} 