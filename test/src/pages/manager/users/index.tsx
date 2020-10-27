import React,{Fragment, useState} from 'react';
import { Card, Typography, Alert, Input, Button, Divider, Popconfirm, Select, Space } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SF, {Modal} from 'react-antd-super-form';
import * as api from "../service";

const {queryUsers} = api;
const table = React.createRef();
const handleModal = React.createRef()

export default (): React.ReactNode => {
  const [isEdit, setIsEdit] = useState(false);
  const [record, setRecord] = useState({})

  return (
    <PageHeaderWrapper content=" 这个页面只有 admin 权限才能查看">
      <Card>
        <SF
          ref={table}
          search={
            {
              layout: 'inline',
              data: [
                {
                label: '用户名',
                cType: Input,
                key: 'real_name',
                
                },
                {
                  label: '手机号',
                  cType: Input,
                  key: 'mobile',
                  
                },
                {
                  child: '查找',
                  type: 'primary',
                  cType: Button,
                  bindSearch: true,
                  onClick(){
                    console.log('...');
                  }
                },
                {
                  child: '创建',
                  cType: Button,
                  onClick(){
                    setIsEdit(false)
                    setRecord({})
                    handleModal.current.show();
                  }
                }
              ]
            }
            
            
          }
          table={
            {
              columns:[
                {
                  title: '用户ID',
                  dataIndex: 'id',
                  key: 'id',
                },
                {
                  title: '用户实名',
                  dataIndex: 'real_name',
                  key: 'real_name',
                },
                {
                  title: '手机号',
                  dataIndex: 'mobile',
                  key: 'mobile',
                },
                {
                  title: '是否在职',
                  dataIndex: 'is_in',
                  key: 'is_in',
                  render: val=>val===1?'是':'否'
                },
                {
                  title:'身份证',
                  dataIndex: 'cdcard',
                  key: 'cdcard',
                },
                {
                  title: '登录名',
                  dataIndex: 'login_name',
                  key: 'login_name',
                },
                {
                  title: '操作',
                  key: '_',
                  render:(_, record)=>{
                    return (<Space>
                      {/* <a type="link" onClick={()=>{
                        // 详细信息，用户所有产品及角色，页面权限
                        // setIsEdit(true)
                        // setRecord(record)
                        // handleModal.current.show();
                      }}>查看</a>
                      <Divider  type="vertical" ></Divider> */}
                      <a type="link" onClick={()=>{
                        setIsEdit(true)
                        setRecord(record)
                        handleModal.current.show();
                      }}>编辑</a>
                      {/* <Divider  type="vertical" ></Divider> */}
                      {/* <a type="link" onClick={async ()=>{
                        // 添加产品及相应角色
                        // setIsEdit(true)
                        // setRecord(record)
                        // const ret = await api.queryProductRoleList({
                        //   product_id: record.product_id,
                        // });
                        // setRoles(ret.entry||[])
                        // handleModal.current.show();
                      }}>添加权限</a>
                      <Divider  type="vertical" ></Divider> */}
                      <Popconfirm
                        title="确认删除"
                        onConfirm={()=>{
                          if(record.id !== 1) {
                            api.delUser({
                              id: record.id,
                            }).then(res=>{
                              if(res.status){
                                table.current.refresh();
                              }
                            })
                          }
                          
                        }}
                      ><a type="link" style={{color: 'red'}}>删除</a>
                      </Popconfirm>
                      
                    </Space>)
                  }
                },
              ],
              rowKey:"id",
              isInit: true,
              action:queryUsers,
            }
          }
        ></SF>
        <Modal
          ref={handleModal}
          title={isEdit?'编辑':'新建'}
          destroyOnClose
          onOk={(e, form)=>{
            const {validateFields} = form;
            validateFields().then(values=>{
              console.log(values)
              api[isEdit?'editUser':'addUser']({
                ...record,
                ...values
              }).then(res=>{
                if(res.status){
                  table.current.refresh();
                  handleModal.current.show(false);
                }
              })
            })
          }}
          
          form={{
            data:form=>[
              {
                label: '用户实名',
                cType: Input,
                placeholder: '请输入',
                key: 'real_name',
                config:{
                  initialValue: record.real_name,
                  rules:[
                    {
                      required: true,
                      message: '请输入'
                    }
                  ]
                },
              },
              {
                label: '手机号',
                cType: Input,
                placeholder: '请输入',
                key: 'mobile',
                config:{
                  initialValue: record.mobile,
                  rules:[
                    {
                      required: true,
                      message: '请输入'
                    }
                  ]
                },
              },
              {
                label: '身份证',
                cType: Input,
                placeholder: '请输入',
                key: 'cdcard',
                config:{
                  initialValue: record.cdcard,
                  rules:[
                    {
                      required: true,
                      message: '请输入'
                    }
                  ]
                },
              },
              {
                label: '登录名',
                cType: Input,
                placeholder: '请输入',
                key: 'login_name',
                config:{
                  initialValue: record.login_name,
                  rules:[
                    {
                      required: true,
                      message: '请输入'
                    }
                  ]
                },
              },
              {
                label: '登录密码',
                cType: Input,
                placeholder: '请输入',
                key: 'password',
                config:{
                  // initialValue: isEdit?'':'ab123456',
                  rules:[
                    {
                      required: !isEdit,
                      message: '请输入'
                    }
                  ]
                },
              },
            ]
          }}
        ></Modal>
      </Card>
    </PageHeaderWrapper>
  );
}