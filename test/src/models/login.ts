import { stringify } from 'querystring';
import { history, Reducer, Effect } from 'umi';

import { fakeAccountLogin, getAuthority } from '@/services/login';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { message } from 'antd';

export interface StateType {
  status?: 'ok' | 'error';
  type?: string;
  currentAuthority?: 'user' | 'guest' | 'admin';
}


export interface LoginModelType {
  namespace: string;
  state: StateType;
  effects: {
    login: Effect;
    logout: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<StateType>;
  };
}

const Model: LoginModelType = {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    
    *login({ payload }, { call, put }) {

      const response = yield call(fakeAccountLogin, payload);
      const {entry={}} =  response;
      if(response.status === false) {
        message.error(response.message)
        return;
      }
      const authorityRes = yield call(getAuthority, entry.token);
      const roleRes = authorityRes.entry||{};
      const role = roleRes.role_alias;
      // Login successfully
      if (entry.token) {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            ...response,
            currentAuthority: role
          },
        });
        // if (response.status === 'ok') {
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params as { redirect: string };
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
              if(redirect.includes('/user/login')) {
                history.replace('/');
                return;
              }
            }
          } else {
            history.replace('/');
            return;
          }
        }
        history.replace(redirect || '/');
      }
    },

    logout() {
      
      const { redirect } = getPageQuery();
      // Note: There may be security issues, please note
      if (window.location.pathname !== '/user/login' && !redirect) {
        localStorage.clear();
        history.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
      }
    },
  },

  reducers: {

    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      localStorage.token = payload.entry.token;
      localStorage.userInfo = JSON.stringify(payload.entry);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};

export default Model;
