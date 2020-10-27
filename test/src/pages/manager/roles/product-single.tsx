import React, { Fragment, useState, useEffect } from 'react';
import { Card, Typography, Alert, Input, Button, Divider, Popconfirm, Select } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SF,{Modal} from 'react-antd-super-form';
import * as api from "../service";

const { queryProductRoleList,queryProducts,delProductRole } = api;
const table = React.createRef();
const handleModal = React.createRef()

export default (): React.ReactNode => {
  const [isEdit, setIsEdit] = useState(false);
  const [record, setRecord] = useState({})
  const [products, setProducts] = useState([])
  const [roles, setRoles] = useState([])

  useEffect( ()=>{
    async function init(){
      const ret = await queryProducts();
      setProducts(ret.entry||[]);

      const ret2 = await queryProductRoleList();
      setRoles(ret2.entry||[])

      console.log(ret, ret2)
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
                data: [
                  {
                    label: '角色名称',
                    cType: Input,
                    key: 'role_name',
                  },
                  // {
                  //   label: '角色标识',
                  //   cType: Input,
                  //   key: 'role_alias',
                  // },
                  {
                    child: '查找',
                    type: 'primary',
                    cType: Button,
                    bindSearch: true,
                  },
                  {
                    child: '新建',
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
                    title: '角色ID',
                    dataIndex: 'id',
                    key: 'id',
                  },
                  {
                    title: '角色名称',
                    dataIndex: 'role_name',
                    key: 'role_name',
                  },
                  {
                    title: '角色标识',
                    dataIndex: 'role_alias',
                    key: 'role_alias',
                  },
                  {
                    title: '上级角色',
                    dataIndex: 'parent_role_name',
                    key: 'parent_role_name',
                    render: val=>{
                      return val||"-"
                    }
                  },
                  {
                    title: '所属产品',
                    dataIndex: 'product_name',
                    key: 'product_name',
                  },
                  {
                    title: '操作',
                    key: '_',
                    render:(_, record)=>{
                      return (<Fragment>
                        <a type="link" onClick={()=>{
                          setIsEdit(true)
                          setRecord(record)
                          handleModal.current.show();
                        }}>编辑</a>
                        <Divider  type="vertical" ></Divider>
                        <a type="link" onClick={()=>{
                          setIsEdit(false)
                          setRecord({
                            parent_id: record.id,
                            product_id: record.product_id
                          })
                          handleModal.current.show();
                        }}>添加子角色</a>
                        <Divider  type="vertical" ></Divider>
                        <Popconfirm
                          title="确认删除"
                          onConfirm={()=>{
                            if(1!==record.id) {
                              delProductRole({
                                id: record.id,
                              }).then(res=>{
                                if(res.status){
                                  table.current.refresh();
                                }
                              })
                            }
                            
                          }}
                        >
                          <Button type="link" danger>删除</Button>
                        </Popconfirm>
                        
                      </Fragment>)
                    }
                  },
                ],
                rowKey:"id",
                isInit: true,
                action: queryProductRoleList,
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
              api[isEdit?'editProductRole':'addProductRole']({
                ...record,
                ...values
              }).then(async res=>{
                if(res.status){
                  table.current.refresh();
                  handleModal.current.show(false);
                  const ret2 = await queryProductRoleList();
                  setRoles(ret2.entry||[])

                }
              })
            })
          }}
          
          form={{
            data:form=>[
              {
                label: '角色名称',
                cType: Input,
                placeholder: '请输入',
                key: 'role_name',
                config:{
                  initialValue: record.role_name,
                  rules:[
                    {
                      required: true,
                      message: '请输入'
                    }
                  ]
                }
              },
              {
                label: '角色标识',
                cType: Input,
                placeholder: '请输入',
                key: 'role_alias',
                config:{
                  initialValue: record.role_alias,
                  rules:[
                    {
                      required: true,
                      message: '请输入'
                    }
                  ]
                }
              },
              {
                label: '所属产品',
                cType: Select,
                key: 'product_id',
                options:[
                  ...products.map(product=>({
                    label: product.product_name,
                    value: product.id
                  }))
                ],
                config:{
                  initialValue: record.product_id
                }
              },
              {
                label: '上级角色',
                cType: Select,
                key: 'parent_id',
                options:[
                  // {
                  //   label: '无',
                  // value: ''
                  // },
                  ...roles.map(role=>({
                    label: role.role_name,
                    value: role.id
                  }))
                  
                ],
                config: {
                  initialValue: record.parent_id||''
                }
              }
            ]
          }}
        ></Modal>
        </Card>
      </PageHeaderWrapper>
    );

}
