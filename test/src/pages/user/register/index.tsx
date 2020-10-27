import { Form, Button, Col, Input, Popover, Progress, Row, Select, message } from 'antd';
import React, { FC, useState, useEffect } from 'react';
import { Link, connect, history, FormattedMessage, formatMessage, Dispatch } from 'umi';

// import { StateType } from './model';
import styles from './style.less';
// import * as api from '../service';

const FormItem = Form.Item;
const { Option } = Select;
const InputGroup = Input.Group;

const passwordStatusMap = {
  ok: (
    <div className={styles.success}>
      <FormattedMessage id="userandregister.strength.strong" />
    </div>
  ),
  pass: (
    <div className={styles.warning}>
      <FormattedMessage id="userandregister.strength.medium" />
    </div>
  ),
  poor: (
    <div className={styles.error}>
      <FormattedMessage id="userandregister.strength.short" />
    </div>
  ),
};

const passwordProgressMap: {
  ok: 'success';
  pass: 'normal';
  poor: 'exception';
} = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};

interface RegisterProps {
  dispatch: Dispatch;
  userAndregister: StateType;
  submitting: boolean;
}

export interface UserRegisterParams {
  mail: string;
  password: string;
  confirm: string;
  mobile: string;
  captcha: string;
  prefix: string;
}

const Register: FC<RegisterProps> = ({ submitting, dispatch, userAndregister }) => {
  const [count, setCount]: [number, any] = useState(0);
  const [visible, setVisible]: [boolean, any] = useState(false);
  const [prefix, setPrefix]: [string, any] = useState('86');
  const [popover, setPopover]: [boolean, any] = useState(false);
  const confirmDirty = false;
  let interval: number | undefined;

  console.log(submitting, dispatch, userAndregister);


  const [form] = Form.useForm();
  useEffect(() => {
    if (!userAndregister) {
      return;
    }
    const account = form.getFieldValue('mail');
    if (userAndregister.status === 'ok') {
      message.success('注册成功！');
      history.push({
        pathname: '/user/register-result',
        state: {
          account,
        },
      });
    }
  }, [userAndregister]);
  useEffect(
    () => () => {
      clearInterval(interval);
    },
    [],
  );
  const onGetCaptcha = () => {
    let counts = 59;
    setCount(counts);
    interval = window.setInterval(() => {
      counts -= 1;
      setCount(counts);
      if (counts === 0) {
        clearInterval(interval);
      }
    }, 1000);

    // api
    //   .fakeSmsSend({
    //     mobile: form.getFieldValue('mobile'),
    //   })
    //   .then((res) => {
    //     if (res.status) {
    //       message.success('已发送');
    //     } else {
    //       message.error(res.message);
    //     }
    //   })
    //   .catch((err) => {});
  };

  const onFinish = (values: { [key: string]: any }) => {
    console.log(values, prefix);
    // dispatch({
    //   type: 'userAndregister/submit',
    //   payload: {
    //     ...values,
    //     prefix,
    //   },
    // });
    // api.fakeRegister(values).then((res = {}) => {
    //   if (res.status) {
    //     message.success('注册成功');
    //   } else {
    //     message.error(res.message);
    //   }
    // });
  };
  const checkConfirm = (_: any, value: string) => {
    const promise = Promise;
    if (value && value !== form.getFieldValue('password')) {
      return promise.reject(formatMessage({ id: 'userandregister.password.twice' }));
    }
    return promise.resolve();
  };
  const checkPassword = (_: any, value: string) => {
    const promise = Promise;
    // 没有值的情况
    if (!value) {
      setVisible(!!value);
      return promise.reject(formatMessage({ id: 'userandregister.password.required' }));
    }
    // 有值的情况
    if (!visible) {
      setVisible(!!value);
    }
    setPopover(!popover);
    if (value.length < 6) {
      return promise.reject('');
    }
    if (value && confirmDirty) {
      form.validateFields(['checkPassword']);
    }
    return promise.resolve();
  };
  const changePrefix = (value: string) => {
    setPrefix(value);
  };

  return (
    <div className={styles.main}>
      <h3>
        <FormattedMessage id="userandregister.register.register" />
      </h3>
      <Form form={form} name="UserRegister" onFinish={onFinish}>
        <FormItem
          // label="邀请码"
          name="inviterCode"
          rules={[
            {
              required: true,
              message: formatMessage({ id: 'userandregister.username.required' }),
            },
          ]}
        >
          <Input
            size="large"
            placeholder={formatMessage({ id: 'userandregister.username.placeholder' })}
          />
        </FormItem>
        <FormItem
          // label="密码"
          name="password"
          className={
            form.getFieldValue('password') &&
            form.getFieldValue('password').length > 0 &&
            styles.password
          }
          rules={[
            {
              validator: checkPassword,
            },
          ]}
        >
          <Input
            size="large"
            type="password"
            placeholder={formatMessage({ id: 'userandregister.password.placeholder' })}
          />
        </FormItem>
        <FormItem
          // label="确认密码"
          name="checkPassword"
          rules={[
            {
              required: true,
              message: formatMessage({ id: 'userandregister.confirm-password.required' }),
            },
            {
              validator: checkConfirm,
            },
          ]}
        >
          <Input
            size="large"
            type="password"
            placeholder={formatMessage({ id: 'userandregister.confirm-password.placeholder' })}
          />
        </FormItem>
        <InputGroup compact>
          {/* <Select size="large" value={prefix} onChange={changePrefix} style={{ width: '20%' }}>
            <Option value="86">+86</Option>
            <Option value="87">+87</Option>
          </Select> */}
          <FormItem
            // label="手机号"
            style={{ width: '100%' }}
            name="mobile"
            rules={[
              {
                required: true,
                message: formatMessage({ id: 'userandregister.phone-number.required' }),
              },
              {
                pattern: /^\d{11}$/,
                message: formatMessage({ id: 'userandregister.phone-number.wrong-format' }),
              },
            ]}
          >
            <Input
              size="large"
              placeholder={formatMessage({ id: 'userandregister.phone-number.placeholder' })}
            />
          </FormItem>
        </InputGroup>
        <Row gutter={8}>
          <Col span={16}>
            <FormItem
              name="smsCode"
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'userandregister.verification-code.required' }),
                },
              ]}
            >
              <Input
                size="large"
                placeholder={formatMessage({ id: 'userandregister.verification-code.placeholder' })}
              />
            </FormItem>
          </Col>
          <Col span={8}>
            <Button
              size="large"
              disabled={!!count}
              className={styles.getCaptcha}
              onClick={onGetCaptcha}
            >
              {count
                ? `${count} s`
                : formatMessage({ id: 'userandregister.register.get-verification-code' })}
            </Button>
          </Col>
        </Row>
        <FormItem>
          <Button
            size="large"
            loading={submitting}
            className={styles.submit}
            type="primary"
            htmlType="submit"
          >
            <FormattedMessage id="userandregister.register.register" />
          </Button>
          <Link className={styles.login} to="/user/login">
            <FormattedMessage id="userandregister.register.sign-in" />
          </Link>
        </FormItem>
      </Form>
    </div>
  );
};
export default connect(
  ({
    userAndregister,
    loading,
  }: {
    userAndregister: StateType;
    loading: {
      effects: {
        [key: string]: boolean;
      };
    };
  }) => ({
    userAndregister,
    submitting: loading.effects['userAndregister/submit'],
  }),
)(Register);
