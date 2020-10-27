import { Alert, Form } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { GithubOutlined, DingtalkCircleFilled } from '@ant-design/icons';
import {  connect, Dispatch } from 'umi';
import {DragCaptcha, SlideCaptcha, TapCaptcha} from 'super-captcha'
import { StateType } from '@/models/login';
import { LoginParamsType } from '@/services/login';
import { ConnectState } from '@/models/connect';
import LoginForm from './components/Login';

import styles from './style.less';
// import DragCaptcha from './components/Captcha/Drag';
// import SlideCaptcha from './components/Captcha/Slide';
// import TapCaptcha from './components/Captcha/Tap';

// import './components/captcha/bundle.css';
// import {DragCaptcha, SlideCaptcha, TapCaptcha} from './components/captcha'

const { Tab, UserName, Password, Mobile, Submit } = LoginForm;
interface LoginProps {
  dispatch: Dispatch;
  userLogin: StateType;
  submitting?: boolean;
}

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login: React.FC<LoginProps> = (props) => {
  const { userLogin = {}, submitting } = props;
  const { status, type: loginType } = userLogin;
  const [autoLogin, setAutoLogin] = useState(true);
  const [type, setType] = useState<string>('account');
  const [code, setCode] = useState('');
  const formRef = useRef()

  console.log(props)

  const handleSubmit = (values: LoginParamsType) => {
    const { dispatch } = props;
    dispatch({
      type: 'login/login',
      payload: { ...values, type },
    });
  };
  return (
    <div className={styles.main}>
      <LoginForm activeKey={type} onTabChange={setType} onSubmit={handleSubmit} ref={formRef}>
        <Tab key="account" tab="">
          {status === 'error' && loginType === 'account' && !submitting && (
            <LoginMessage content="账户或密码错误（admin/ant.design）" />
          )}

          <UserName
            name="userName"
            placeholder="用户名"
            rules={[
              {
                required: true,
                message: '请输入用户名!',
              },
            ]}
          />
          {/* <Mobile
            name="userName"
            placeholder="手机号"
            rules={[
              {
                required: true,
                message: '请输入手机号！',
              },
              {
                pattern: /^1\d{10}$/,
                message: '手机号格式错误！',
              },
            ]}
          /> */}

          <Password
            name="password"
            placeholder="密码"
            rules={[
              {
                required: true,
                message: '请输入密码！',
              },
            ]}
          />
        </Tab>
        <Form.Item>

          <DragCaptcha onSuccess={()=>{
            formRef.current.submit()
          }} />
          <TapCaptcha 
            onSuccess={()=>{
              formRef.current.submit()
            }}
          />
          <SlideCaptcha onSuccess={()=>{
            formRef.current.submit()
          }}/>
          
        </Form.Item>
        {/* <Submit loading={submitting}>登录</Submit> */}
        <div id="dingTk_login"></div>
        <div className={styles.other}>
          其他登录方式
          <DingtalkCircleFilled  className={styles.icon} onClick={()=>{

          /*
            * 解释一下goto参数，参考以下例子：
            
            */
           const appid = "dingoatp4udcxpdqr9nuzp";
          //  const 
          var url = encodeURIComponent('http://localhost:8000/');
          var goto = encodeURIComponent(`https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=${appid}&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=${url}`)
          var obj = DDLogin({
            id:"dingTk_login",//这里需要你在自己的页面定义一个HTML标签并设置id，例如<div id="login_container"></div>或<span id="login_container"></span>
            goto: goto, //请参考注释里的方式
            style: "border:none;background-color:#FFFFFF;",
            width : "365",
            height: "400"
          });

          console.log(obj)


          var handleMessage = function (event) {
              var origin = event.origin;
              console.log("origin", event.origin);
              if( origin == "https://login.dingtalk.com" ) { //判断是否来自ddLogin扫码事件。
                var loginTmpCode = event.data; 
                //获取到loginTmpCode后就可以在这里构造跳转链接进行跳转了
                
                console.log("loginTmpCode", loginTmpCode);
              }
            };
            if (typeof window.addEventListener != 'undefined') {
                window.removeEventListener('message', handleMessage, false);
                window.addEventListener('message', handleMessage, false);
            } else if (typeof window.attachEvent != 'undefined') {
                window.detachEvent('onmessage', handleMessage);
                window.attachEvent('onmessage', handleMessage);
            }
 
            // window.location.href=``
          }
          }/>
          <GithubOutlined  className={styles.icon} onClick={()=>{
            window.location.href=`https://github.com/login/oauth/authorize?client_id=Iv1.5ccd9d29245999ff&redirect_uri=${encodeURIComponent(location.href)}`
          }} />
          {/* <Link className={styles.register} to="/user/register">cd2f8bf37e66cc1c8b74ec07ff4daec60aa6c304
            注册账户
          </Link> */}
        </div>
      </LoginForm>
    </div>
  );
};

export default connect(({ login, loading }: ConnectState) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
}))(Login);
