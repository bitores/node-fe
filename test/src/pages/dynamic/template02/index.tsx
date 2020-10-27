import React, { Fragment, useState, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, message, Space, Popconfirm, Input, Tooltip } from 'antd';
import SF, {Form} from 'react-antd-super-form';
import * as api from './service';
const antd = require('antd');


const formRef = React.createRef()
export default (props)=>{

  const [formData, setFormData] = useState({})

  useEffect(()=>{
    const {pageId} = props.match.params;
    api.queryPageConfig(pageId).then(res=>{
      if(res.status){
        // message.success('操作')
        const entry = res.entry || {};
        setFormData(entry);
      } else {
        message.error(res.message)
      }
    })

    return ()=>false;
  },[props.match.params.pageId])


  return (<PageHeaderWrapper content=" 这个页面只有 admin 权限才能查看">
    <Card>
    动态测试页面 ，参数：{JSON.stringify(props.match.params||{})}
      <Form 
      
        data={(form, getValues)=>{
          console.log(formData)
            // debugger
          function handData(form, getValues, item){
            const {
              bindSubmit = false,
              bindReset = false,
              bindParam = false,
              redirect = false,
              action = false,// 表单提交时 url
              cType,
              ...o
            } = item;

            o.cType = antd[cType]||cType;

            if(bindParam) {
              o.config = o.config || {};
              o.config.initialValue = props.match.params[bindParam]
            }

            if(bindReset) {
              o.onClick = ()=>{
                form.resetFields();
                // tableRef.current.reset();
              }
            }

            if(bindSubmit) {
              o.onClick = ()=>{
                getValues().then((values)=>{
                  console.log(values)
                  // 提交数据，action

                  message.success('提交成功')

                  if(redirect) {
                    // 成功后的跳转
                    
                  }
                }).catch((e)=>{
                  message.error('缺少必填字段')
                })
              }
            }

            return o;
          }

          return  (formData.data||[]).map(item=>{
            const o = handData(form, getValues, item)

            if(['grid'].indexOf(item.cType)>-1) {
              const {
                children = []
              } = o;

              o.children = children.map((item)=>{
                return handData(form, getValues, item)
              })
            }


            return o;
          })
        }}
      />
    </Card>
    </PageHeaderWrapper>)
}