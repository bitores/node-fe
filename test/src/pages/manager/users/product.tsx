import React, { Fragment, useState, useEffect } from 'react';
import { Card, Typography, Alert, Input, Button, Divider, Popconfirm, Select } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SF, {Modal} from 'react-antd-super-form';
import * as api from "../service";
import { PlusCircleOutlined, SearchOutlined } from '@ant-design/icons';

const  {queryProductUsers,queryProducts} = api;
const table = React.createRef();
const handleModal = React.createRef()

export default (): React.ReactNode => {
  const [isEdit, setIsEdit] = useState(false);
  const [record, setRecord] = useState({})
  const [products, setProducts] = useState([])
  const [users, setUsers] = useState([])
  const [roles, setRoles] = useState([])

  useEffect( ()=>{
    async function init(){
      
      const ret = await api.queryProducts();
      setProducts(ret.entry||[]);

      

      // console.log(ret, ret2)
    }

    init();
    
  },[])

  return (
    <PageHeaderWrapper content=" 这个页面只有 admin 权限才能查看">
      <Card>
        <SF
          ref={table}
          search={
            {
              layout: 'inline',
              data: form=>[
                {
                  label: '项目名',
                  cType: Select,
                  style:{ width: 150 },
                  key: 'product_id',
                  onChange: async (productId)=>{
                    const ret = await api.queryProductRoleList({
                      product_id: productId
                    });
                    setRoles(ret.entry||[])
                  },
                  options:[
                    {
                      label: '全部',
                      value: '',
                      
                    },
                    ...products.map(p=>({
                      label: p.product_name,
                      value: p.id,
                    }))
                  ],
                  config:{
                    initialValue: ''
                  }
                },
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
                  key: ',search',
                  bindSearch: true,
                  icon: <SearchOutlined />,
                  onClick(){
                    console.log('...');
                  }
                },
                {
                  child: '添加',
                  cType: Button,
                  key:',add',
                  icon: <PlusCircleOutlined />,
                  onClick:async()=>{
                    
                    const ret2 = await api.queryUsers();
                    setUsers(ret2.entry||[]);

                    setIsEdit(false)
                    setRecord({
                      product_id: form.getFieldValue('product_id')
                    })

                    if(!form.getFieldValue('product_id')) {
                      setRoles([])
                    }
                    // 
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
                  title: '项目名',
                  dataIndex: 'product_name',
                  key: 'product_name',
                },
    
                {
                  title: '用户实名',
                  dataIndex: 'real_name',
                  key: 'real_name',
                },
                {
                  title: '角色',
                  dataIndex: 'role_name',
                  key: 'role_name',
                },
                {
                  title: '角色标识',
                  dataIndex: 'role_alias',
                  key: 'role_alias',
                },

                {
                  title: '手机号',
                  dataIndex: 'mobile',
                  key: 'mobile',
                },
                // {
                //   title: '是否在职',
                //   dataIndex: 'is_in',
                //   key: 'is_in',
                //   render:val=>{
                //     return val===1?'是':'否'
                //   }
                // },
                // {
                //   title:'身份证',
                //   dataIndex: 'cdcard',
                //   key: 'cdcard',
                // },
                {
                  title: '登录名',
                  dataIndex: 'login_name',
                  key: 'login_name',
                },
                {
                  title: '操作',
                  dataIndex: '_',
                  key: '_',
                  render:(_, record)=>{
                    return (<Fragment>
                      
                      <Popconfirm
                        title="确认删除"
                        onConfirm={()=>{
                          
                            api.delProductUser({
                              product_id: record.product_id,
                              role_id: record.role_id,
                              user_id: record.id,
                            }).then(res=>{
                              if(res.status){
                                table.current.refresh();
                              }
                            })
                        }}
                      >
                        <Button type="link" danger>删除</Button>
                      </Popconfirm>
                      
                    </Fragment>)
                  }
                },
              ],
              rowKey:(item)=>`${item.product_id}_${item.id}_${item.role_id}`,
              isInit: true,
              action:queryProductUsers,
            }
          }
        />
        <Modal
          ref={handleModal}
          title={isEdit?'编辑':'添加'}
          destroyOnClose
          onOk={(e, form)=>{
            const {validateFields} = form;
            validateFields().then(values=>{
              console.log(values)
              api[isEdit?'editProductUser':'addProductUser']({
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
                label: '用户',
                cType: Select,
                key: 'user_id',
                options:users.map(user=>{
                  return {
                    label: user.real_name,
                    value: user.id,
                  }
                }),
                config:{
                  initialValue: isEdit? record.user_id:'',
                  rules:[
                    {
                      required: true,
                      message: '请选择'
                    }
                  ]
                },
              },

              {
                label: '项目',
                cType: Select,
                key: 'product_id',
                // disabled: isEdit,
                options:[
                  ...products.map(product=>({
                    label: product.product_name,
                    value: product.id
                  }))
                ],
                config:{
                  initialValue: record.product_id,
                  rules:[
                    {
                      required: true,
                      message: '请选择'
                    }
                  ]
                },
                onChange: async (productId)=>{
                  const ret = await api.queryProductRoleList({
                    product_id: productId
                  });
                  setRoles(ret.entry||[])
                }
              },
              
              {
                label: '角色',
                cType: Select,
                key: 'role_id',
                // disabled: isEdit,
                options:roles.map(role=>{
                  return {
                    label: role.role_name,
                    value: role.id,
                  }
                }),
                config:{
                  initialValue: isEdit? record.role_id:'',
                  rules:[
                    {
                      required: true,
                      message: '请选择'
                    }
                  ]
                },
              },
            ]
          }}
        />
      </Card>
    </PageHeaderWrapper>
  );
}