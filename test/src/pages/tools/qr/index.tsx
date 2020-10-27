import { Button, Input, Tabs } from 'antd';
import React, { useState } from 'react';
import {Form} from 'react-antd-super-form';
import QRCode from 'qrcode';

import './index.less';

const { TabPane } = Tabs;
const conf = {
  text: '请输入文本内容',
  address: 'http://',
  liveCode: 'http://',
  btn: {
    text: '请输入文本内容',
    address: 'http://',
    liveCode: 'http://',
  }
}


// const TabGroup = 
export default ()=>{
  const [activeKey, setActiveKey] = useState("text")
  const [qrUrl, setQrUrl] = useState("");

  return <>
    <div className="qr">
      <div className="qr-left">
        <Form 
          data={(form, getValues)=>[
            {
              cType: (props)=>{
                return <Tabs defaultActiveKey={props.value} onChange={props.onChange}>
                  {
                    props.options.map(pane=>{
                      return <TabPane tab={pane.label} key={pane.value}></TabPane>
                    })
                  }
                </Tabs>
              },
              key: 'type',
              options:[
                {
                  label: '文本',
                  value: 'text'
                },
                {
                  label: '网址表态码',
                  value: 'address'
                },
                {
                  label: '网址跳转活码',
                  value: 'liveCode'
                },
              ],
              config: {
                initialValue: 'text',
              },
              onChange:(k)=>{
                setActiveKey(k)
                setQrUrl('')
                form.setFieldsValue({
                  'content':''
                })
              }
            },
            {
              cType: Input,
              key: 'content',
              placeholder: conf[activeKey],
              config: {
                rules:[
                  {
                    required: true,
                    message: '请输入'
                  }
                ]
              }
            },
            {
              cType: Button,
              child: '生成二维码',
              type: 'primary',
              onClick:()=>{
                getValues().then(async res=>{
                  console.log(res,form.getFieldValue('page'))

                  switch (res.type) {
                    case "text":
                      // 生成二维码
                      setQrUrl(await QRCode.toDataURL(res.content))
                      break;
                    case "address":
                      // 生成二维码
                      setQrUrl(await QRCode.toDataURL(res.content))
                      break;
                    case "liveCode":
                      // 提交到数据库并展示

                      break;
                    default:
                      break;
                  }

                })
                
              }
            }
          ]}
        />
      </div>
      <div className="qr-right">
        <div id="qrId" className="qrId">
          {qrUrl?<img style={{width: '100%',height: 'auto'}} src={qrUrl} />:'此处生成二维码'}
        </div>
      </div>
    </div>
  </>
}