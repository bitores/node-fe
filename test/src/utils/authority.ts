import { reloadAuthorized } from './Authorized';

// 脚手架中使用 localstorage 模拟权限角色，实际项目中可能需要从后台读取。
// 脚手架中实现了一个简单的刷新权限方法，在登录/注销等关键节点对当前权限进行了更新。
// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority(str?: string): string | string[] {
  // console.log('getAuthority');
  const authorityString =
    typeof str === 'undefined' && localStorage ? localStorage.getItem('antd-pro-authority') : str;
  // authorityString could be admin, "admin", ["admin"]
  let authority;
  try {
    if (authorityString) {
      authority = JSON.parse(authorityString);
    }
  } catch (e) {
    authority = authorityString;
  }
  if (typeof authority === 'string') {
    return [authority];
  }

  return authority;
}

export function setAuthority(authority: string | string[]): void {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  localStorage.setItem('antd-pro-authority', JSON.stringify(proAuthority));
  // auto reload
  reloadAuthorized();
}
