import request from '@/utils/request';

export async function query(): Promise<any> {
  return request('/api/users');
}

export async function queryCurrent(): Promise<any> {
  let userInfoStr = localStorage.userInfo || "{}";
  let userInfo = JSON.parse(userInfoStr);
  // console.log(userInfo)
  return {
    name: userInfo.mobile,
    avatar: userInfo.headImg,
    userid: userInfo.id,
  }
  // return request('/api/currentUser');
}

export async function queryNotices(): Promise<any> {
  return request('/api/notices');
}
