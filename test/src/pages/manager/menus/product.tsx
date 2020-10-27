import React, { Fragment, useState, useEffect } from 'react';
import { Card,  Input, Button, Divider, Popconfirm, message, Select } from 'antd';
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
  const [products, setProducts] = useState([])
  const [menus, setMenus] = useState([]);
  useEffect(()=>{

    async function init(){
      try{
        const res = await api.queryProducts({})
        setProducts(res.entry||[])
      }catch(e){
        setProducts([])
      }
      
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
                  label: '菜单名',
                  cType: Input,
                  key: 'menu_name'
                },
                {
                  label: '项目',
                  cType: Select,
                  key: 'product_id',
                  style:{ width: 150 },
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
                  child: '查找',
                  type: 'primary',
                  cType: Button,
                  bindSearch: true,
                },
                
                {
                  child: '创建',
                  cType: Button,
                  icon: '',
                  onClick: async (e)=>{
                    setIsEdit(false)
                    setRecord({
                      product_id: form.getFieldValue('product_id')
                    })

                    const res = await api.queryMenus({
                      product_id: form.getFieldValue('product_id')
                    });
                    setMenus(res.entry);

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
                  title: '菜单ID',
                  dataIndex: 'id',
                  key: 'id',
                },
                {
                  title: '菜单名',
                  dataIndex: 'menu_name',
                  key: 'menu_name',
                },
                {
                  title: '菜单名',
                  dataIndex: 'name',
                  key: 'name',
                },
                {
                  title: '菜单路径',
                  dataIndex: 'menu_path',
                  key: 'menu_path',
                },
                {
                  title: '上级菜单',
                  dataIndex: 'pmenu_name',
                  key: 'pmenu_name',
                  render:val=>val||'-'
                },
                {
                  title: '项目名称',
                  dataIndex: 'product_name',
                  key: 'product_name',
                },
                {
                  title: '操作',
                  key: '—',
                  render:(_, record)=>{
                    return (<Fragment>
                      <a type="link" onClick={()=>{
                        setIsEdit(true)
                        setRecord(record)
                        handleModal.current.show();
                      }}>编辑</a>
                      <Divider type="vertical" />
                      <Popconfirm
                        title="确认删除"
                        onConfirm={()=>{
                          api.delMenu({
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
              action:api.queryMenus,
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
              api[isEdit?'editMenu':'addMenu']({
                ...values,
                id: record.id,
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
                label: '菜单名称',
                cType: Input,
                placeholder: '请输入',
                key: 'menu_name',
                config:{
                  initialValue: record.menu_name,
                  rules:[
                    {
                      required: false,
                      message: '请输入'
                    }
                  ]
                }
              },
              {
                label: '菜单名',
                cType: Input,
                placeholder: '请输入',
                key: 'name',
                config:{
                  initialValue: record.name,
                  rules:[
                    {
                      required: false,
                      message: '请输入'
                    }
                  ]
                }
              },
              {
                label: '菜单路径',
                cType: Input,
                placeholder: '请输入',
                key: 'menu_path',
                config:{
                  initialValue: record.menu_path,
                  rules:[
                    {
                      required: true,
                      message: '请输入'
                    }
                  ]
                }
              },
              {
                label: '上级菜单',
                cType: Select,
                placeholder: '请输入',
                key: 'parent_id',
                disabled: isEdit,
                options:[
                  {
                    label: '-',
                    value: 0,
                  },
                  ...menus.map(menu=>({
                    label: menu.menu_name,
                    value: menu.id,
                  }))
                ],
                config:{
                  initialValue: record.parent_id||0,
                  rules:[
                    {
                      required: false,
                      message: '请输入'
                    }
                  ]
                }
              },
              {
                label: '项目',
                cType: Select,
                placeholder: '请输入',
                key: 'product_id',
                disabled: isEdit,
                options:[
                  ...products.map(p=>({
                    label: p.product_name,
                    value: p.id,
                  }))
                ],
                config:{
                  initialValue: record.product_id,
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
      </Card>
    </PageHeaderWrapper>
  )
};
