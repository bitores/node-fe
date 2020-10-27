import React, { Fragment, useState, useEffect } from 'react';
import { Card,  Input, Button, Divider, Popconfirm, message, Space, Select, Radio, Tag } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SF, {Modal, ModalTable} from 'react-antd-super-form';
// import transTreeData from '@/utils/transTreeData'
import * as treeUtil from '@/utils/tree';
import * as api from "../service"; 
import { FolderOutlined, SearchOutlined, FileOutlined } from '@ant-design/icons';


const {queryProducts} = api;
const table = React.createRef();
const handleModal = React.createRef()
const roleListModal = React.createRef();
const userListModal = React.createRef();
const menuListModal = React.createRef();
const menuRoleModal = React.createRef();
const handRoleModal = React.createRef();
const handUserModal = React.createRef();
const handMenuModal = React.createRef();
export default (): React.ReactNode => {
  const [isEdit, setIsEdit] = useState(false);
  const [product, setProduct] = useState({})
  const [record, setRecord] = useState({})

  const [users, setUsers] = useState([])
  const [roles, setRoles] = useState([])
  const [menus, setMenus] = useState([]);

  const [productRoles, setProductRoles] = useState([])

  const [update, setUpdate] = useState(0)

  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys]= useState([])
  const [dataSource, setDataSource] = useState([])

  useEffect( ()=>{
    async function init(){
      try{
        // const ret = await api.queryProducts();
        // setProducts(ret.entry||[]);

        const rolesRes = await api.queryRoles();
        setRoles(rolesRes.entry||[])

        const userRes = await api.queryUsers();
        setUsers(userRes.entry||[]);

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
              data: [
                {
                label: '产品名',
                cType: Input,
                key: 'product_name',
   
                },
                
                {
                  child: '搜索',
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
                    setProduct({})
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
                  title: '产品ID',
                  dataIndex: 'id',
                  key: 'id',
                },
                {
                  title: '产品名称',
                  dataIndex: 'product_name',
                  key: 'product_name',
                },

                {
                  title: '产品标识',
                  dataIndex: 'product_alias',
                  key: 'product_alias',
                },
              
                {
                  title: '操作',
                  key: 'name',
                  render:(_, record)=>{
                    return (<Space>
                      <a type="link" onClick={()=>{
                        setIsEdit(true)
                        setProduct(record)
                        handleModal.current.show();
                      }}>编辑</a>

                      <a type="link" onClick={()=>{
                        setIsEdit(false)
                        setProduct(record)
                        roleListModal.current.show();
                      }}>角色</a>

                      <a type="link" onClick={()=>{
                        setIsEdit(false)
                        setProduct(record)
                        userListModal.current.show();
                      }}>用户</a>

                      <a type="link" onClick={()=>{
                        setIsEdit(false)
                        setProduct(record)
                        menuListModal.current.show();
                      }}>权限</a>

                      <Popconfirm
                        title="确认删除"
                        onConfirm={()=>{
                          api.delProduct({
                            id: record.id,
                          }).then(res=>{
                            if(res.status){
                              table.current.refresh();
                            } else {
                              message.error('产品正在使用')
                            }
                          })
                        }}
                      >
                        <a type="link" style={{color:'#f50'}}>删除</a>
                      </Popconfirm>
                      
                    </Space>)
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
        
        <ModalTable 
          ref={roleListModal}
          title="角色列表"
          width={800}
          closable={false}
          destroyOnClose
          footer={[
            <Button key="close" onClick={()=>{
              roleListModal.current.show(false)
            }}>关闭</Button>
          ]}
          formStyle={{
            padding: 0,
          }}
          tableStyle={{
            padding: 0,
          }}
          form={{
            layout: 'inline',
            data:form=>[
              {
                cType: 'hidden',
                key: 'product_id',
                config: {
                  initialValue: product.id
                }
              },
              {
                label: '名称',
                cType: Input,
                key: 'role_name',
              },
              {
                label: '标识',
                cType: Input,
                key: 'role_alias',
              },
              {
                child: '搜索',
                type: 'primary',
                cType: Button,
                bindSearch: true,
              },
              {
                child: '添加',
                cType: Button,
                onClick(){
                  setIsEdit(false)
                  // setRecord({})
                  handRoleModal.current.show();
                }
              }
            ]
          }}
          table={{
            isInit: true,
            action: api.queryProductRoleList,
            valueMap: res=>{
              setProductRoles(res.entry||[])
              // debugger
              return {
                status: res.status,
                dataSource: res.entry
              }
            },
            rowKey:'id',
            pagination: false,
            columns:[
              {
                title: 'ID',
                dataIndex: 'id',
                key: 'id',
              },
              {
                title: '名称',
                dataIndex: 'role_name',
                key: 'role_name',
              },
              {
                title: '标识',
                dataIndex: 'role_alias',
                key: 'role_alias',
              },
              // {
              //   title: '所属产品',
              //   dataIndex: 'product_name',
              //   key: 'product_name',
              // },
              {
                title: '操作',
                key: '_',
                render:(_, rec)=>{
                  return (<Space>

                    <Popconfirm
                      title="确认移除"
                      onConfirm={()=>{
                        // if(1!==rec.id) {
                          api.delProductRole({
                            role_id: rec.id,
                            product_id: record.id
                          }).then(res=>{
                            if(res.status){
                              roleListModal.current.refresh();
                            }
                          })
                        // }
                        
                      }}
                    >
                      <a type="link" style={{color: '#f50'}}>移除</a>
                    </Popconfirm>
                    <a onClick={()=>{
                      menuRoleModal.current.show();
                    }}>授权</a>
                  </Space>)
                }
              },
            ]
          }}
        />
        <ModalTable 
          ref={userListModal}
          title="用户列表"
          width={800}
          closable={false}
          destroyOnClose
          footer={[
            <Button  key="close" onClick={()=>{
              userListModal.current.show(false)
            }}>关闭</Button>
          ]}
          formStyle={{
            padding: 0,
          }}
          tableStyle={{
            padding: 0,
          }}
          form={{
            layout: 'inline',
            data:form=>[
              {
                cType: 'hidden',
                key: 'product_id',
                config: {
                  initialValue: product.id
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
                child: '搜索',
                type: 'primary',
                cType: Button,
                key: ',search',
                bindSearch: true,
              },
              {
                child: '添加',
                cType: Button,
                onClick(){
                  setIsEdit(false)
                  // setRecord({})
                  handUserModal.current.show();
                }
              }
            ]
          }}
          table={{
            isInit: true,
            action: api.queryProductUsers,
            rowKey: 'id',
            columns:[

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
                title: '登录名',
                dataIndex: 'login_name',
                key: 'login_name',
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

              // {
              //   title: '产品名',
              //   dataIndex: 'product_name',
              //   key: 'product_name',
              // },
  
              {
                title: '操作',
                dataIndex: '_',
                key: '_',
                render:(_, record)=>{
                  return (<Fragment>
                    
                    <Popconfirm
                      title="确认移除"
                      onConfirm={()=>{
                        
                          api.delProductUser({
                            product_id: record.product_id,
                            role_id: record.role_id,
                            user_id: record.id,
                          }).then(res=>{
                            if(res.status){
                              userListModal.current.refresh();
                            }
                          })
                      }}
                    >
                      <Button type="link" danger>移除</Button>
                    </Popconfirm>
                    
                  </Fragment>)
                }
              },
            ]
          }}
        />
        <ModalTable 
          ref={menuListModal}
          title="权限列表"
          width={800}
          closable={false}
          destroyOnClose
          footer={[
            <Button key="close" onClick={()=>{
              menuListModal.current.show(false)
            }}>关闭</Button>
          ]}
          formStyle={{
            padding: 0,
          }}
          tableStyle={{
            padding: 0,
          }}
          form={{
            layout: 'inline',
            data:form=>[
              {
                cType: 'hidden',
                key: 'product_id',
                config: {
                  initialValue: product.id
                }
              },
              {
                label: '权限名',
                cType: Input,
                key: 'menu_name'
              },
              {
                child: '搜索',
                type: 'primary',
                cType: Button,
                bindSearch: true,
              },
              {
                child: '添加',
                cType: Button,
                onClick: async ()=>{
                  setIsEdit(false)
                  setRecord({})

                  const res = await api.queryMenus({
                    product_id: record.id,
                  });
                  setMenus(res.entry);

                  handMenuModal.current.show();
                }
              }
            ]
          }}
          table={{
            isInit: true,
            action: api.queryMenus,
            // transTreeData
            valueMap:(res)=>{
              const entry = res.entry || [];
              const data = treeUtil.buildTree(entry);
              console.log(data)
              return {
                status: res.status,
                dataSource: data,
              }
            },
            pagination: false,
            rowKey: 'id',
            columns:[
              
              {
                title: '名称',
                dataIndex: 'menu_name',
                key: 'menu_name',
                render:(text, record)=>{
                  // const hasChildren = (record.children&&record.children.length>0)?true:false;
                  return <span>{record.web_type===1?<FolderOutlined  style={{color: '#e90'}}/>:<FileOutlined  style={{color: '#1890ff'}} />} {text}</span>
                }
              },
              // {
              //   title: 'ID',
              //   dataIndex: 'id',
              //   key: 'id',
                
              // },
              // {
              //   title: '菜单名',
              //   dataIndex: 'name',
              //   key: 'name',
              // },
              {
                title: '路径',
                dataIndex: 'menu_path',
                key: 'menu_path',
              },
              {
                title: '识别key',
                dataIndex: 'web_key',
                key: 'web_key',
                // render:val=>val||'-'
              },
              {
                title: '类型',
                dataIndex: 'web_type',
                key: 'web_type',
                render:(val)=>{
                  return val===1?<Tag color="success">菜单</Tag>:<Tag color="default">操作</Tag>
                }
              },
              {
                title: '操作',
                key: '—',
                render:(_, record)=>{
                  return (<Space>
                    <a type="link" onClick={()=>{
                      setIsEdit(true)
                      setRecord(record)
                      handMenuModal.current.show();
                    }}>编辑</a>
                    {
                      record.web_type===1 && <a onClick={()=>{
                        setIsEdit(false)
                        setRecord({
                          parent_id: record.id
                        })
                        handMenuModal.current.show();
                      }}>添加子权限</a>
                    }
                    
                    <Popconfirm
                      title="确认删除"
                      onConfirm={()=>{
                        api.delMenu({
                          id: record.id,
                        }).then(res=>{
                          if(res.status){
                            menuListModal.current.refresh();
                          } else {
                            message.error('产品正在使用')
                          }
                        })
                      }}
                    >
                      <a type="link" style={{color: '#f50'}}>删除</a>
                    </Popconfirm>
                    
                  </Space>)
                }
              },
            ]
          }}
        />
        {/* 角色授权 */}
        <ModalTable 
          ref={menuRoleModal}
          title="角色授权"
          width={800}
          closable={false}
          afterClose={()=>{
            setSelectedRowKeys([])
            setExpandedRowKeys([])
            setDataSource([])
          }}
          destroyOnClose
          // footer={[
          //   <Button key="close" onClick={()=>{
          //     menuListModal.current.show(false)
          //   }}>关闭</Button>
          // ]}
          formStyle={{
            padding: 0,
          }}
          tableStyle={{
            padding: 0,
          }}
          form={{
            layout: 'inline',
            data:form=>[
              {
                cType: 'hidden',
                key: 'product_id',
                config: {
                  initialValue: product.id
                }
              },
              // {
              //   label: '权限名',
              //   cType: Input,
              //   key: 'menu_name'
              // },
              // {
              //   child: '搜索',
              //   type: 'primary',
              //   cType: Button,
              //   bindSearch: true,
              // },
              // {
              //   child: '添加',
              //   cType: Button,
              //   onClick: async ()=>{
              //     setIsEdit(false)
              //     setRecord({})

              //     const res = await api.queryMenus({
              //       product_id: record.id,
              //     });
              //     setMenus(res.entry);

              //     handMenuModal.current.show();
              //   }
              // }
            ]
          }}
          table={{
            isInit: true,
            action: api.queryMenus,
            // transTreeData
            valueMap:(res)=>{
              const entry = res.entry || [];

              setExpandedRowKeys(entry.map(item=>item.id));

              const data = treeUtil.buildTree(entry);
 
              setDataSource(data);
              return {
                status: res.status,
                dataSource: data,
              }
            },
            expandable:{
              expandedRowKeys,
            },
            rowSelection:{
              selectedRowKeys,
              onSelect:(record, selected, selectedRows, nativeEvent)=>{
                const rowKeys = [...selectedRowKeys];
                if(selected) {
                  // 选择
                  const arr = treeUtil.findParentInTree(dataSource, item=>item.id===record.id).map(item=>item.id);
                  setSelectedRowKeys(Array.from(new Set([...rowKeys, ...arr])))
                } else {
                  // 取消
                  const arr = treeUtil.findChildrenInTree(dataSource, item=>item.id===record.id).map(item=>item.id);
                  setSelectedRowKeys(rowKeys.filter(item=>arr.indexOf(item)===-1))
                }
              },
              onSelectAll:(selected, selectedRows, changeRows)=>{
                console.log(selected, selectedRows.map(item=>item.id), changeRows)
                if(selected) {
                  setSelectedRowKeys(selectedRows.map(item=>item.id))
                } else {
                  setSelectedRowKeys([])
                }
              }
            },
            pagination: false,
            rowKey: 'id',
            columns:[
              
              {
                title: '名称',
                dataIndex: 'menu_name',
                key: 'menu_name',
                render:(text, record)=>{
                  // const hasChildren = (record.children&&record.children.length>0)?true:false;
                  return <span>{record.web_type===1?<FolderOutlined  style={{color: '#e90'}}/>:<FileOutlined  style={{color: '#1890ff'}} />} {text}</span>
                }
              },
              // {
              //   title: 'ID',
              //   dataIndex: 'id',
              //   key: 'id',
                
              // },
              // {
              //   title: '菜单名',
              //   dataIndex: 'name',
              //   key: 'name',
              // },
              // {
              //   title: '路径',
              //   dataIndex: 'menu_path',
              //   key: 'menu_path',
              // },
              // {
              //   title: '识别key',
              //   dataIndex: 'web_key',
              //   key: 'web_key',
              //   // render:val=>val||'-'
              // },
              {
                title: '类型',
                dataIndex: 'web_type',
                key: 'web_type',
                render:(val)=>{
                  return val===1?<Tag color="success">菜单</Tag>:<Tag color="default">操作</Tag>
                }
              },
              // {
              //   title: '操作',
              //   key: '—',
              //   render:(_, record)=>{
              //     return (<Space>
              //       <a type="link" onClick={()=>{
              //         setIsEdit(true)
              //         setRecord(record)
              //         handMenuModal.current.show();
              //       }}>编辑</a>
              //       {
              //         record.web_type===1 && <a onClick={()=>{
              //           setIsEdit(false)
              //           setRecord({
              //             parent_id: record.id
              //           })
              //           handMenuModal.current.show();
              //         }}>添加子权限</a>
              //       }
                    
              //       <Popconfirm
              //         title="确认删除"
              //         onConfirm={()=>{
              //           api.delMenu({
              //             id: record.id,
              //           }).then(res=>{
              //             if(res.status){
              //               menuListModal.current.refresh();
              //             } else {
              //               message.error('产品正在使用')
              //             }
              //           })
              //         }}
              //       >
              //         <a type="link" style={{color: '#f50'}}>删除</a>
              //       </Popconfirm>
                    
              //     </Space>)
              //   }
              // },
            ]
          }}
        />
        {/* 角色添加 */}
        <Modal
          ref={handRoleModal}
          title="角色添加"
          destroyOnClose
          onOk={(e, form)=>{
            const {validateFields} = form;
            validateFields().then(values=>{
              console.log(values)
              api.addProductRole({
                ...record,
                ...values
              }).then(async res=>{
                if(res.status){
                  roleListModal.current.refresh();
                  handRoleModal.current.show(false);
                }
              })

            })
          }}
          
          form={{
            data:form=>[
              {
                label: '角色',
                cType: Select,
                key: 'role_id',
                placeholder: '请选择',
                options:[
                  ...roles.map(role=>({
                    label: role.role_name,
                    value: role.id,
                    disabled: productRoles.some(item=>item.id===role.id)
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
              },
              // {
              //   formItem:{
              //     wrapperCol: {
              //       span: 24
              //     }
              //   },
              //   cType: Checkbox.Group,
              //   key: 'role_id',
              //   options:roles.map(role=>{
              //     return {
              //       label: role.role_name,
              //       value: role.id,
              //       disabled: productRoles.some(item=>item.id===role.id)
              //     }
              //   }),
              //   config:{
              //     initialValue: productRoles.map(role=>role.id)
              //   }
              // },
              {
                cType: 'hidden',
                key: 'product_id',
                config: {
                  initialValue: product.id
                }
              },
            ]
          }}
        />
        <Modal
          ref={handUserModal}
          title="添加用户"
          destroyOnClose
          onOk={(e, form)=>{
            const {validateFields} = form;
            validateFields().then(values=>{
              console.log(values)
              api.addProductUser({
                ...values
              }).then(res=>{
                if(res.status){
                  userListModal.current.refresh();
                  handUserModal.current.show(false);
                }
              })
            })
          }}
          
          form={{
            data:form=>[
              

              {
                label: '项目',
                cType: "hidden",
                key: 'product_id',
                config:{
                  initialValue: product.id,
                }
              },

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
        <Modal
          ref={handMenuModal}
          title={isEdit?"编辑权限":"添加权限"}
          destroyOnClose
          onOk={(e, form)=>{
            const {validateFields} = form;
            validateFields().then(values=>{
              api[isEdit?"editMenu":"addMenu"]({
                ...values,
                id: record.id,
              }).then(res=>{
                if(res.status){
                  menuListModal.current.refresh();
                  handMenuModal.current.show(false);
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
                label: '类型',
                cType: Radio.Group,
                options: [
                  {
                    label: '菜单级',
                    value: 1
                  },
                  {
                    label: '操作级',
                    value: 2
                  },
                ],
                key: 'web_type',
                config:{
                  initialValue: record.web_type,
                  rules:[
                    {
                      required: true,
                      message: '请输入'
                    }
                  ]
                },
                onChange:()=>{
                  setUpdate(update+1)
                }
              },
              {
                label: '权限名称',
                cType: Input,
                placeholder: '请输入',
                key: 'menu_name',
                config:{
                  initialValue: record.menu_name,
                  rules:[
                    {
                      required: true,
                      message: '请输入'
                    }
                  ]
                }
              },
              {
                // visible: ,
                label: '识别Key',
                cType: Input,
                placeholder: '请输入',
                key: 'web_key',
                config:{
                  initialValue: record.web_key,
                  rules:[
                    {
                      required: form.getFieldValue('web_type')===2,
                      message: '请输入'
                    }
                  ]
                }
              },
              {
                // visible: ,
                label: '权限路径',
                cType: Input,
                placeholder: '请输入',
                key: 'menu_path',
                config:{
                  initialValue: record.menu_path,
                  rules:[
                    {
                      required: form.getFieldValue('web_type')===1,
                      message: '请输入'
                    }
                  ]
                }
              },
              
              
              {
                label: '上级权限',
                cType: Select,
                placeholder: '请输入',
                key: 'parent_id',
                // disabled: isEdit,
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
                cType: "hidden",
                placeholder: '请输入',
                key: 'product_id',
               
                config:{
                  initialValue: product.id,
                }
              }
            ]
          }}
        />
      </Card>
    </PageHeaderWrapper>
  )
};
