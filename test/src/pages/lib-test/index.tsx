import React, { Fragment, useState, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, message, Input,Button, Checkbox,Space } from 'antd';

import { MinusCircleOutlined, PlusOutlined, ArrowUpOutlined, MinusCircleFilled } from '@ant-design/icons';
import SF  from 'react-antd-super-form';
import Form from './Form';

export default (props)=>{


  return (<PageHeaderWrapper content=" 这个页面只有 admin 权限才能查看">
    <Card>
      {/* <SF
        search={{
          layout: 'inline',
          data: searchData.map(item=>{
            return {
              ...item,
              cType: antd[item.cType]||item.cType,
            }
          })
        }}
        table={{
          isInit: action===""?true:false,
          action:async (params)=>{
            console.log(action)
            return api.getData(action,params)
          },
          columns
        }}
      /> */}
      <Form 
        data={(form, getValues)=>{

          return [
            {
              label: 'E-mail',
              cType: Input,
              config:{
                rules:[
                  {
                    required: true,
                    message: '请输入'
                  }
                ]
              }
            },
            // {
            //   label: 'Captcha',
            //   cType: 'group',
            //   children:[
            //     // {
            //     //   // label: 'Captcha',
            //     //   key: 'captcha',
            //     //   noStyle: true,
            //     //   cType: Input,
            //     // },
            //     // {
            //     //   unbind: true,
            //     //   cType: Button,
            //     //   // key: 'xx',
            //     //   child: 'xxx',
            //     // }
            //   ]
            // },
            {
              label: 'grid',
              cType: 'grid',
              gutter: 8,
              children:[
                {
                  // label: 'Captcha',
                  cType: Input,
                  key: 'ca2'
                },
                {
                  cType: Button,
                  child: 'Get captcha',
                },
                {
                  cType: Button,
                  child: 'Get captcha',
                },
                {
                  cType: Button,
                  child: 'Get captcha',
                },
              ]
            },
            {
              offset: true,
              cType: Checkbox,
              key: 'agreement..',
              child: <>I have read the <a href="">agreement</a></>,
              config:{
                initialValue: false,
                valuePropName: 'checked',
                rules:[
                  { validator:(_, value) => value ? Promise.resolve() : Promise.reject('Should accept agreement') },
                ]
              }
            },
            {
              cType: 'grid',
              offset: true,
              children:[
                {
                  cType: Checkbox,
                  key: 'xxx',
                  noStyle: true,
                  child: 'Remember me',
                  config:{
                    initialValue: true,
                    valuePropName: 'checked'
                  }
                },
                {
                  unbind: true,
                  render:(form, FormCom)=>{
                    console.log(form, FormCom)
                    return <a className="login-form-forgot" href="">
                    Forgot password
                  </a>
                  }
                }
              ]
            },
            {
              label: 'group',
              cType: 'group',
              formItem:{
                style: {
                  marginBottom: 0
                }
              },
              children:[
                {
                  key: 'year',
                  cType: Input,
                  formItem: {
                    style:{ 
                      display: 'inline-block', 
                      width: 'calc(50% - 8px)' 
                    }
                  },
                  placeholder: 'Input birth year'
                },
                {
                  key: 'month',
                  cType: Input,
                  formItem: {
                    style:{ 
                      display: 'inline-block', 
                      width: 'calc(50% - 8px)',
                      margin: '0 8px'
                    }
                  },
                  placeholder: 'Input birth month'
                }
              ]
            },
            {
              label: 'Space',
              cType: 'space',
              size: 'large',
              children:[
                {
                  cType: Input,
                  key: 'a',
                  placeholder: 'a'
                },
                {
                  cType: Input,
                  key: 'b',
                  placeholder: 'b'
                },
                {
                  cType: Input,
                  key: 'c',
                  placeholder: 'c'
                },
                {
                  cType: Input,
                  key: 'd',
                  placeholder: 'd'
                },
              ]
            },
            {
              label: 'space2',
              cType: Space,
              innerHTML: ()=>{
                return [
                  <Button>ss</Button>
                ]
              }
            },
            {
              label: '用户',
              cType: 'list',
              key: 'users',
              config:{
                rules:[
                  {
                    required: true,
                  }
                ]
              },
              addRender:(FormItem, {fields,add})=>{
                // return null;
                return <FormItem key={11}>
                <Button
                  type="dashed"
                  onClick={() => {
                    add();
                  }}
                  block
                >
                  <PlusOutlined /> Add field
                </Button>
                </FormItem>
              },
              rowRender:(FormItem, {field,  add, remove, move})=>{
                // return null;
                return (<Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="start">
                <FormItem
                  {...field}
                  name={[field.name, 'first']}
                  fieldKey={[field.fieldKey, 'first']}
                  rules={[{ required: true, message: '必填' }]}
                >
                  <Input placeholder="First Name" />
                </FormItem>
                <FormItem
                  {...field}
                  name={[field.name, 'last']}
                  fieldKey={[field.fieldKey, 'last']}
                  rules={[{ required: true, message: '必填' }]}
                >
                  <Input placeholder="Last Name" />
                </FormItem>              
                <MinusCircleOutlined
                  onClick={() => {
                    remove(field.name);
                  }}
                />
                <ArrowUpOutlined
                  onClick={() => {
                    move(field.name, field.name-1);
                  }}
                />
                </Space>)
              }
            },
            {
              // label: '关联资源',
              cType: 'list',
              addInTop: true,
              formItem: {
                wrapperCol:{
                  span: 24
                }
              },
              key: 'roles',
              config:{
                initialValue:[
                  {
                    validator(rule, value, callback) {
                      console.log('...', value)
                      if (value > 0) {
                        callBack('只能大于0的整数')
                      } else {
                        callback()//必须写
                      }
                    }
                  }
                ],
                rules:[
                  {

                  }
                ]
              },
              addRender: (FormItem, {add, formItemProps})=>{
                return <FormItem 
                  wrapperCol={{
                    span: 14,
                  }} 
                  labelCol={{
                    span: 6
                  }}
                  label="关联资源" 
                >
                  <Button type="primary" onClick={()=>{
                    add();
                  }}>添加资源</Button>
                </FormItem>
              },
              rowRender: (FormItem, {field, remove, formItemProps})=>{
                return <Space direction="vertical" key={field.name} style={{
                  width:'100%'
                }}>
                  <FormItem 
                    wrapperCol={{
                      span: 14,
                    }} 
                    labelCol={{
                      span: 6
                    }}
                    label={
                      <>
                        <MinusCircleFilled style={{
                          color: 'red',
                          paddingRight: 10
                        }} onClick={()=>{
                          
                          remove(field.name)
                        }}/>
                        资源名称
                      </>
                    }
                    {...field}
                    name={[field.name, 'name']}
                    fieldKey={[field.fieldKey, 'name']}
                    rules={[{ required: true, message: '必填' }]}
                    >
                    <Input placeholder="请输入资源名称"/>
                  </FormItem>
                  <FormItem 
                    wrapperCol={{
                      span: 14,
                    }} 
                    labelCol={{
                      span: 6
                    }}
                    label="URL"
                    {...field}
                    name={[field.name, 'url']}
                    fieldKey={[field.fieldKey, 'url']}
                    rules={[{ required: true, message: '必填' }]}
                  >
                    <Input placeholder="请输入URL"/>
                  </FormItem>
                  
                </Space>
              }
            },
            {
              cType: Button,
              child: 'Test',
              offset: true,
              onClick: async(e)=>{
                getValues().then(values=>{
                  console.log('Success:', values);
                }).catch(errorInfo=>{
                  console.log('Failed:', errorInfo);
                })
                
                // try {
                //   const values = await form.validateFields();
                //   console.log('Success:', values);
                // } catch (errorInfo) {
                //   console.log('Failed:', errorInfo);
                // }
              }
            }
          ]
        }}
      />
      
    </Card>
    </PageHeaderWrapper>)
}