import request from '@/utils/request';

export interface LoginParamsType {
  userName: string;
  password: string;
  mobile: string;
  captcha: string;
}

export async function fakeAccountLogin(params: LoginParamsType) {
  return request('/login', {
    method: 'POST',
    data: {
      username: params.userName,
      password: params.password
    },
  });
}

export async function getFakeCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}


export async function getAuthority(token){
  return request('/user/getAuthority',{
    headers:{
      Authorization: `Bearer ${token||localStorage.token||''}`,
    }
  });
}