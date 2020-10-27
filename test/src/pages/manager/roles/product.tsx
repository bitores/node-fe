import React, { Fragment, useState, useEffect } from 'react';
import { Card, Typography, Alert, Input, Button, Divider, Popconfirm, Select, message } from 'antd';
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
      try{
        const ret = await api.queryProducts();
        setProducts(ret.entry||[]);

        const roles = await api.queryRoles();
        setRoles(roles.entry||[])
      } catch(e){
        
      }
      

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
                    label: '项目',
                    cType: Select,
                    style:{ width: 150 },
                    key: 'product_id',
                    options:[
                      {
                        label: '全部',
                        value: ''
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
                    label: '角色名称',
                    cType: Input,
                    key: 'role_name',
                  },
                  
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
                      setRecord({
                        product_id: form.getFieldValue('product_id')
                      })
                      handleModal.current.show();
                    }
                  }
                ]
              }
              
              
            }
            table={
              {
                columns:[
                  // {
                  //   title: '角色ID',
                  //   dataIndex: 'id',
                  //   key: 'id',
                  // },
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
                    title: '所属项目',
                    dataIndex: 'product_name',
                    key: 'product_name',
                  },
                  {
                    title: '操作',
                    key: '_',
                    render:(_, record)=>{
                      return (<Fragment>
                        <Popconfirm
                          title="确认删除"
                          onConfirm={()=>{
                              delProductRole({
                                role_id: record.id,
                                product_id: record.product_id,
                              }).then(res=>{
                                if(res.status){
                                  table.current.refresh();
                                }else{
                                  message.error(res.message)
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
                action: queryProductRoleList,
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
              api[isEdit?'editProductRole':'addProductRole']({
                ...record,
                ...values
              }).then(async res=>{
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
                label: '项目',
                cType: Select,
                key: 'product_id',
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
                }
              },
              {
                label: '角色',
                cType: Select,
                key: 'role_id',
                options:[
                  ...roles.map(role=>({
                    label: role.role_name,
                    value: role.id
                  }))
                  
                ],
                config: {
                  rules:[
                    {
                      required: true,
                      message: '请选择'
                    }
                  ]
                }
              }
            ]
          }}
        />
        </Card>
      </PageHeaderWrapper>
    );

}
