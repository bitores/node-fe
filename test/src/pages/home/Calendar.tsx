import React, { useEffect, useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Calendar, Badge, Tag, Input, Select, DatePicker, message } from 'antd';
import {Modal} from 'react-antd-super-form';
import moment from 'moment';
import * as api from './service';
import styles from './Calendar.less';


const handleModal = React.createRef();
export default (): React.ReactNode => {

  const [types, setTypes] = useState([]);
  const [list, setList] = useState({});
  const [date, setDate] = useState({});

  async function init(){
    const listRes = await api.queryCalendarList({})

    if(listRes.status) {
      
      setList({
        ...list,
        ...listRes.entry,
      });
    }

    const typeRes = await api.queryCalendarTypeList({})
    if(typeRes.status) {
      setTypes(typeRes.entry||[])
    }

  }

  useEffect(()=>{ 
    
    init();
  },[])

  function onPanelChange(value){
    console.log('select', value)
    const k = `${value.year()}-${value.month()+1}-${value.date()}`
    if(!list.hasOwnProperty(k)) {
      api.queryCalendarList({
        year: value.year(),
        month: value.month()+1
      }).then(res=>{
        if(res.status) {
        
          setList({
            ...list,
            ...res.entry,
          });
        }
      })
    }

  }

  function onSelect(value){
    setDate(value.format("YYYY-MM-DD"));
    handleModal.current.show();
    
  }

  function dateCellRender(value) {
    const k = `${value.year()}-${value.month()+1}-${value.date()}`
    const listData = list[k]||[];    
    return (
      <ul style={{padding: 0}}>
        {listData.map(item => (
          <li key={item.id}>
            <Tag color={item.color}>{item.content}</Tag>
          </li>
        ))}
      </ul>
    );
  }
  // monthCellRender={monthCellRender}
  return (<PageHeaderWrapper>
    <Card>
      <Calendar onPanelChange={onPanelChange} onSelect={onSelect} dateCellRender={dateCellRender}  />
      <div>
        <center>
          <Tag color="success">success</Tag>
          <Tag color="processing">processing</Tag>
          <Tag color="error">error</Tag>
          <Tag color="warning">warning</Tag>
          <Tag color="default">default</Tag>
        </center>
      </div>
    </Card>
    <Modal 
      ref={handleModal} 
      onOk={(e,form)=>{
        const {validateFields} = form;
        validateFields().then(values=>{
          api.addCalendar(values).then(res=>{
            if(res.status) {
              handleModal.current.show(false)
              init();
              message.success('操作成功')
            } else {
              message.error(res.message)
            }
          })
        })
      }}
      form={{
        data:[
          {
            cType: DatePicker,
            label: '时间',
            // disabled: true,
            key: 'time',
            // disabledDate: ()=>true,
            showTime: true,
            config:{
              initialValue: moment(date),
              rules:[
                {
                  required: true,
                  message: '必填'
                }
              ]
            },
          },
          {
            cType: Select,
            label: '类型',
            key: 'type',
            config:{
              rules:[
                {
                  required: true,
                  message: '必填'
                }
              ]
            },
            options: types.map(t=>({
                label: <Tag color={t.c_desc}>{t.c_desc}</Tag> ,
                value: t.id
              }))
            
          },
          {
            cType: Input,
            label: '事项',
            key: 'name',
            config:{
              rules:[
                {
                  required: true,
                  message: '必填'
                }
              ]
            },
          },
          
        ]
      }}
    />
  </PageHeaderWrapper>)
}
