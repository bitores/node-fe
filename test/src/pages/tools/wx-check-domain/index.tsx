import React, { Fragment, useState } from 'react';
import { message,  Popover, Button, Card, Input, Space, Popconfirm, Select, Tooltip, Badge } from 'antd';
import SF, {Modal, Form} from 'react-antd-super-form';
import sfupload from 'react-antd-super-upload';
import * as api from '../service';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import moment from 'moment';


function handleAction(options=[]){
  return <Space>
    {
      options.filter(item=>item.visible!==false).map((item, ind)=>{
        if(item.render) {
          return item.render()
        } else if(item.doubleCheck===true) {
          return <Popconfirm title={item.confirmText||"确认操作？"} onConfirm={item.onClick}>
            <a key={`a_${ind}`} {...item.config}>{item.title}</a>
          </Popconfirm> 
        } else {
          return <a key={`a_${ind}`} {...item.config} onClick={item.onClick}>{item.title}</a>
        }
        
      })
    }
  </Space>
}
const table = React.createRef()
const handleModal = React.createRef();
export  default ()=>{
  const [list, setList] = useState([])
  // 已检测，开启定时检测，通知
  return (<PageHeaderWrapper content=" 这个页面只有 admin 权限才能查看">
  {/* <Card> */}
    <SF
      ref={table}
      search={{
        layout: 'inline',
        data:form=>[
          {
            cType: Input,
            label: '标题',
            key: 'title',
            allowClear: true,
            placeholder: '标题'
          },
          {
            cType: Input,
            label: '链接',
            key: 'url',
            allowClear: true,
            placeholder: 'http://xadtwl.cn/zhxtm8ynVGQROfx8N1597657740/activity-IYJ579aCV.html',
          },
          {
            cType: Select,
            label: '检测方式',
            key: 'status',
            
            options:[
              {
                label: '全部',
                value:'',
              },
              {
                label: '自动',
                value:1,
              },
              {
                label: '手动',
                value:0,
              },
            ],
            config:{
              initialValue: ''
            }
          },
          {
            cType: Button,
            child: '搜索',
            type: 'primary',
            bindSearch: true,
          },
          {
            cType: Button,
            child: '创建',
            onClick:()=>{
              handleModal.current.show();
            }
          },
          {
            cType: Button,
            child: '同步数据',
            type: 'danger',
            onClick:()=>{
              api.syncWxDomainData().then(res=>{
                if(res.status) {
                  table.current.refresh();
                  message.success('同步完成')
                } else {
                  message.error(res.message)
                }
              })
            }
          }
        ]
      }}
      table={{
        rowKey: 'id',
        isInit: true,
        action: api.listWxDomain,
        columns:[
          {
            title: '标题',
            dataIndex: 'title',
            key: 'title',
            ellipsis: {
              showTitle: false,
            },
            render: v=>{
              return <Tooltip title={v}>
                {v}
            </Tooltip>
            }
          },
          {
            title:'链接',
            dataIndex: 'url',
            key: 'url',
            ellipsis: {
              showTitle: false,
            },
            render: v=>{
              return <Tooltip title={v}>
                <a target="__blank" href={v}>{v}</a>
            </Tooltip>
            }
          },
          {
            title:'封禁状态',
            dataIndex: 'is_disabled',
            key: 'is_disabled',
            render:(v)=>{
              return v===1?<span><Badge status="error" />已封禁</span>:<span><Badge status="success" />正常</span>
            }
          },
          {
            title:'检测方式',
            dataIndex: 'way',
            key: 'way',
            render:(v)=>{
              return v===1?'自动':'手动'
            }
          },
          {
            title:'最近检测',
            dataIndex: 'update_at',
            key: 'update_at',
            render:(v)=>{
              return moment(v).fromNow()
            }
          },
          {
            title:'创建时间',
            dataIndex: 'at',
            key: 'at',
            render:(v)=>{
              return moment(v).format('YYYY-MM-DD HH:mm:ss')
            }
          },
          {
            title:'操作',
            render:(_,record)=>{
              return  handleAction([
                {
                  title: '检测',
                  onClick:()=>{
                    api.checkWxDomain({
                      id: record.id,
                      url: record.url
                    }).then(res=>{
                      if(res.status) {
                        if(res.entry===0) {
                          message.success(res.message)
                        } else {
                          message.warning(res.message)
                        }
                        table.current.refresh();
                      } else {
                        message.error(JSON.stringify(res.message))
                      }
                    })
                  }
                },
                {
                  title: '开启自动检测',
                  onClick:()=>{

                  },
                  doubleCheck: true,
                  visible: record.is_disabled===0&&record.status!==1,
                },
                {
                  title: '删除',
                  onClick:()=>{

                  },
                  config:{
                    style: {
                      color: 'red'
                    }
                  }
                }
              ])
            }
          }
        ]
      }}
    />
    <Modal 
      ref={handleModal}
      destroyOnClose
      onOk={(e, form)=>{
        const {validateFields} = form;
        validateFields().then(values=>{
          api.addWxDomain(values).then(res=>{
            if(res.status) {
              table.current.refresh();
              handleModal.current.show(false);
              message.success('添加成功')
            }else{
              message.error(res.message)
            }
          })
        })
      }}
      form={
        {
          data:[
            {
              cType: Input,
              label: '标题',
              placeholder: '标题',
              key: 'title',
              config:{
                rules:[
                  {
                    required: true
                  }
                ]
              }
            },
            {
              cType: Input,
              label: '链接',
              key: 'url',
              placeholder: 'http://xadtwl.cn/zhxtm8ynVGQROfx8N1597657740/activity-IYJ579aCV.html',
              config:{
                rules:[
                  {
                    required: true
                  }
                ]
              }
            },
          ]
        }
      }
    />
    
  </PageHeaderWrapper>)
 
}


