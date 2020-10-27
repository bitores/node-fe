import React, { Fragment, useState } from 'react';
import { Card,  Input, Button, Divider, Popconfirm, message } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SF, {Modal} from 'react-antd-super-form';
import * as api from "../service"; 

const {queryProducts} = api;
const table = React.createRef();
const handleModal = React.createRef()
const roleModal = React.createRef();
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
                label: '项目名',
                cType: Input,
                key: 'product_name',
   
                },
                
                {
                  child: '查找',
                  type: 'primary',
                  cType: Button,
                  bindSearch: true,
                
                },
                
                {
                  child: '创建',
                  cType: Button,
                  icon: '',
                  onClick: ()=>{
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
                  title: '项目ID',
                  dataIndex: 'id',
                  key: 'id',
                },
                {
                  title: '项目名称',
                  dataIndex: 'product_name',
                  key: 'product_name',
                },

                {
                  title: '项目标识',
                  dataIndex: 'product_alias',
                  key: 'product_alias',
                },
              
                {
                  title: '操作',
                  key: 'name',
                  render:(_, record)=>{
                    return (<Fragment>
                      <a type="link" onClick={()=>{
                        setIsEdit(true)
                        setRecord(record)
                        handleModal.current.show();
                      }}>编辑</a>
                      <Divider type="vertical" />
                      {/* <a type="link" onClick={()=>{
                        
                        roleModal.current.show();
                      }}>批量添加角色</a> */}
                      <Popconfirm
                        title="确认删除"
                        onConfirm={()=>{
                          api.delProduct({
                            id: record.id,
                          }).then(res=>{
                            if(res.status){
                              table.current.refresh();
                            } else {
                              message.error('项目正在使用')
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
              rowKey:"id",
              isInit: true,
              action:queryProducts,
            }
          }
        />
        <Modal
          ref={handleModal}
          title={isEdit?'编辑':'新建'}
          destroyOnClose
          onOk={(e, form)=>{
            const {validateFields} = form;
            validateFields().then(values=>{
              api[isEdit?'editProduct':'addProduct']({
                ...record,
                ...values
              }).then(res=>{
                if(res.status){
                  table.current.refresh();
                  handleModal.current.show(false);
                  message.success('保存成功')
                }else{
                  message.error(res.message)
                }
              })
            })
          }}
          
          form={{
            data:form=>[
              {
                label: '产品名称',
                cType: Input,
                placeholder: '请输入',
                key: 'product_name',
                config:{
                  initialValue: record.product_name,
                  rules:[
                    {
                      required: true,
                      message: '请输入'
                    }
                  ]
                }
              },
              {
                label: '产品标识',
                cType: Input,
                placeholder: '请输入',
                key: 'product_alias',
                disabled: isEdit,
                config:{
                  initialValue: record.product_alias,
                  rules:[
                    {
                      required: true,
                      message: '请输入'
                    }
                  ]
                }
              }
            ]
          }}
        />
        {/* <Modal
          ref={roleModal}
          title="添加角色"
          destroyOnClose
        >
          <SF
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
              ],
              rowKey:"id",
              isInit: true,
              action: api.queryRoles,
            }
          }
        />

        </Modal> */}
      </Card>
    </PageHeaderWrapper>
  )
};
