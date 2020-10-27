import { PlusOutlined } from '@ant-design/icons';
import { Card, Input, Radio, Steps } from 'antd';
import {Modal} from 'react-antd-super-form';
import React, { useRef, useState } from 'react';

export default (props)=>{
  const [list, setList] = useState([1,1,1])
  const [isEdit, setIsEdit] = useState(false);
  const  createModal = useRef(null);

  return <div style={{
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between'

  }}>
    <Card
      hoverable
      style={{ width: 240, marginBottom: 10 }}
      // cover={}
      bodyStyle={{
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
      onClick={()=>{
        setIsEdit(false)
        createModal.current.show();
      }}
    >
      <div>
        <center><PlusOutlined style={{fontSize: 50,}} /></center>
        <center>创建新的聊天室</center>
      </div>
      
      {/* <Card.Meta title="Europe Street beat" description="www.instagram.com" /> */}
    </Card>

  {
    list.map((item, ind)=>{
      return <Card
        key={`c_${ind}`}
        hoverable
        style={{ width: 240, marginBottom: 10 }}
        cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
        actions={[
          <a>编辑</a>,
          <a>详情</a>,
        ]}
      >
        <Card.Meta title="Europe Street beat" description="www.instagram.com" />
      </Card>
    })
  }
  {
    // 解决flex中  justifyContent: 'space-between' 引起最后一行不满时的布局问题
    [1,2,3,4,5,6,7,8,9,10].map(item=>{
      return <div key={`empty_${item}`} style={{
        display: 'inline-block',
        width: 240,
        height: 1
      }}></div>
    })
  }
    <Steps>
      <Steps.Step title="第一步" description="寻找一个话题"/>
      <Steps.Step title="第二步" description="创建或选择一个聊天室"/>
      <Steps.Step title="第三步" description="开启社交"/>
    </Steps>
    <Modal 
      ref={createModal}
      title={isEdit?'编辑聊天室':'创建聊天室'}
      okText={isEdit?'保存':'创建'}
      form={{
        data: (form, getValues)=>[

          {
            label: '聊天室名称',
            cType: Input,
            placeholder: '请输入',
            key: 'roomName',
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
            label: '私有',
            cType: Radio.Group,
            key: 'isMM',
            options:[
              {
                label: '是',
                value: 1,
              },
              {
                label: '否',
                value: 2,
              },
            ]
          }
        ]
      }}
    />
  </div>
}