import request from '@/utils/request';


// feps
export async function queryCalendarList(params:any) {
  return request('/calendar/list', {
    params,
  });
}

export async function queryCalendarTypeList(params:any) {
  return request('/calendar/type-list', {
    params,
  });
}

export async function addCalendar(params: any) {
    return request('/calendar/add', {
      method: "POST",
      data:params,
    });
}
// export async function fepsDeploy(params:any) {
//   return request('/feps/deploy', {
//     method: "POST",
//     data:params,
//   });
// }