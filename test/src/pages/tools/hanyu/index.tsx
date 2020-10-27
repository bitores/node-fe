import { Button, Input, message, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import * as api from '../service';
import SF, {Modal} from  'react-antd-super-form';

const handTable  = React.createRef()
const  handModal = React.createRef();
const handBatchModal = React.createRef();

export default ()=>{

  // const [oAudio, setOAudio] = useState({})

  useEffect(()=>{
    // const audio = document.getElementById("audio");
    // setOAudio(audio);

  },[])

  return (<>
    <SF 
      ref={handTable}
      search={{
        layout: 'inline',
        data:[
          {
            label: '字',
            cType: Input,
            key:'wd'
          },
          {
            cType: Button,
            type: 'primary',
            bindSearch: true,
            child: '搜索'
          },
          {
            cType: Button,
            child: '采集',
            onClick(){
              handModal.current.show()
            }
          },
          {
            cType: Button,
            child: '批量测试',
            onClick(){
              handBatchModal.current.show()
            }
          }
        ]
      }}
      table={{
        isInit: true,
        action: api.quryWordList,
        rowKey: 'id',
        columns:[

          {
            title: '字',
            dataIndex: 'gif',
            key: 'gif',
            render:(val, record)=>{
              return <Tooltip title={val}>
                <img width={100} height={100} src={val} alt={record.wd}/>
              </Tooltip>
            }
          },
          {
            title: '读音',
            dataIndex: 'mp3',
            key: 'mp3',
            render:(val,record)=>{
            return <a url={val} onClick={()=>{
              const oAudio = document.getElementById("audio");
                oAudio.src=val;
                if (oAudio.paused) {
                  oAudio.play();
                }else {
                  oAudio.pause();
                }
              }}>{record.py}</a>
            }
          },
          {
            title: '查百科',
            dataIndex: 'xx',
            key: 'xx',
            render:(val,record)=>{
              return <a target="__blank" href={`https://hanyu.baidu.com/zici/s?wd=${record.wd}`}>查百科</a>
            }
          },
        ]
      }}
    />
    <Modal 
      ref={handModal}
      title='采集程序'
      okText="采集"
      onOk={(e, form, show, getValues)=>{
        getValues().then(values=>{
          console.log(values)
          api.collectWord(values).then(res=>{
            if(res.status) {
              handTable.current.refresh()
              message.success('采集成功')
              show(false);
            } else {
              message.error('采集失败')
            }
          })
        })
      }}
      form={{
        data: form=>[
          {
            cType: Input,
            label: '字',
            key: 'wd',
            maxLength: 1,
            config:{
              rules:[
                {
                  required: true,
                  message: '请输入'
                }
              ]
            }
          },
        ]
      }}
    />
    <Modal 
      ref={handBatchModal}
      title='批量测试程序'
      okText="测试"
      onOk={(e, form, show, getValues)=>{
        getValues().then(values=>{
          console.log(values)
          api.batchCollectWord(values).then(res=>{
            if(res.status) {
              handTable.current.refresh()
              message.success('测试成功')
              show(false);
            } else {
              message.error('测试失败')
            }
          })
        })
      }}
      form={{
        data: form=>[
          {
            cType: Input,
            label: '语句',
            key: 'wd',
            config:{
              rules:[
                {
                  required: true,
                  message: '请输入'
                }
              ]
            }
          },
        ]
      }}
    />
    <div style={{
      display: 'none'
    }}><audio id="audio"></audio></div>
  </>)

}