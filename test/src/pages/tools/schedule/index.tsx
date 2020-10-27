import React, { Fragment, useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Input, Button, Select, DatePicker, message, Popconfirm, Divider } from 'antd';
import SF,{Modal} from 'react-antd-super-form';
import { SearchOutlined, PlusOutlined, CaretRightFilled, RightCircleTwoTone, MinusCircleTwoTone } from '@ant-design/icons';
import * as api from '../service';


const handleModal = React.createRef();
const table = React.createRef();
export default ()=>{
  const [isEdit, setIsEdit] = useState(false);
  const [record, setRecord] = useState({})
  const [type, setType] = useState('');

  return (<PageHeaderWrapper content={'定时任务不是单独使用，即要与具体事件放在一起：定时提醒，日历提醒等'}>
    <SF 
      ref={table}
      search={{
        layout: 'inline', 
        data:[
          {
            cType: Input,
            label: '定时器名称',
            
          },
          {
            cType: Button,
            child: '查询',
            type: 'primary',
            icon: <SearchOutlined />,
            bindSearch: true,
          },
          {
            cType: Button,
            child: '创建',
            type: 'default',
            icon: <PlusOutlined />,
            onClick: ()=>{
              handleModal.current.show();
            },
          }
        ]
      }}
      table={{
        isInit: true,
        action:api.toolScheduleList,
        rowKey:'id',
        columns:[
          {
            title:'ID',
            dataIndex: 'id',
            key:'id'
          },
          {
            title:'名称',
            dataIndex: 'name',
            key:'name'
          },
          {
            title:'唯一标识',
            dataIndex: 'uuid',
            key:'uuid'
          },
          {
            title:'类型',
            dataIndex: 'type',
            key:'type'
          },
          {
            title:'时间',
            dataIndex: 'time',
            key:'time'
          },
          {
            title:'备注',
            dataIndex: 'desc',
            key:'desc'
          },
          {
            title:'操作',
            dataIndex: '_',
            key:'_',
            render:(_, record)=>{
              return (<Fragment>
                {/* <a type="link" onClick={()=>{
                  setIsEdit(true)
                  setRecord(record)
                  handleModal.current.show();
                }}>编辑</a>
                <Divider type="vertical" /> */}
                <Popconfirm
                  title="确认开启"
                  onConfirm={()=>{
                    api.toolScheduleStart({
                      id: record.id,
                    }).then(res=>{
                      if(res.status){
                        table.current.refresh();
                        message.success('开启成功')
                      } else {
                        message.error(res.message)
                      }
                    })
                  }}
                >
                  <RightCircleTwoTone  style={{
                    color: 'green',
                    fontSize: 20
                  }}/>
                  {/* <Button type="link" danger>开启</Button> */}
                </Popconfirm>
                <Divider type="vertical" />
                <Popconfirm
                  title="确认删除"
                  onConfirm={()=>{
                    api.toolScheduleDel({
                      id: record.id,
                    }).then(res=>{
                      if(res.status){
                        table.current.refresh();
                        message.success('删除成功')
                      } else {
                        message.error(res.message)
                      }
                    })
                  }}
                >
                  <MinusCircleTwoTone  style={{
                    color: '#eb2f96',
                    fontSize: 20
                  }}/>
                  {/* <Button type="link" danger>删除</Button> */}
                </Popconfirm>
                
              </Fragment>)
            }
          },
        ]
      }}
    />
    <Modal 
      ref={handleModal}
      destroyOnClose
      afterClose={()=>{
        setType('')
      }}
      width={800}
      onOk={(e,form)=>{
        const {validateFields} = form;
        validateFields().then(values=>{
          const {name, time} = values;
          api.toolScheduleAdd({
            ...values,
            time: values.type==2?time: `${time[0]},${time[1]}`
          }).then(res=>{
            if(res.status){
              handleModal.current.show(false)
              table.current.refresh();
              message.success('操作成功')
            } else {
              message.error(res.message)
            }
          })
        })
      }}
      form={{
        data:form=>[
          {
            cType: Input,
            label: '名称',
            key: 'name',
            config:{
              rules:[
                {
                  required: true,
                  message:'必填项'
                }
              ]
            }
          },
          {
            cType: Select,
            label: '类型',
            key: 'type',
            options:[
              {
                label: <div><div>Cron 字符串</div><span style={{color: 'gray'}}>如：* * * * * *, 可由cron-editor-react生成</span></div>,
                value: 1
              },
              {
                label: <div><div>Date 字符串</div><span style={{color: 'gray'}}>如：2020-07-12 00-00-00</span></div>,
                value: 2
              },
              {
                label: <div><div>Range 字符串</div><span style={{color: 'gray'}}>如：2020-07-12 00-00-00 至 2020-07-12 00-00-00</span></div>,
                value: 3
              },
            ],
            onChange:(val)=>{
              form.setFieldsValue({
                time:''
              })
              setType(val)
            },
            config:{
              rules:[
                {
                  required: true,
                  message:'必填项'
                }
              ]
            }
          },
          {
            cType: Input,
            label: '值',
            key: 'time',
            visible:type===1,
            placeholder: '如：* * * * * *',
            config:{
              rules:[
                {
                  required: true,
                  message:'必填项'
                }
              ]
            }
          },
          {
            cType: DatePicker,
            label: '值',
            key: 'time',
            visible: type===2,
            format: 'YYYY-MM-DD HH:mm:ss',
            showTime: true,
            config:{
              rules:[
                {
                  required: true,
                  message:'必填项'
                }
              ]
            }
          },
          {
            cType: DatePicker.RangePicker,
            label: '值',
            key: 'time',
            visible: type===3,
            showTime: true,
            format: 'YYYY-MM-DD HH:mm:ss',
            config:{
              rules:[
                {
                  required: true,
                  message:'必填项'
                }
              ]
            }
          },
          {
            cType: Input,
            label: '备注',
            key: 'desc',
            placeholder: '请输入备注',
          },
        ]
      }}
    />
    </PageHeaderWrapper>)
}