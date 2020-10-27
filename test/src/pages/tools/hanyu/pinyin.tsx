import { Button, Input, message, } from 'antd';
import React, { useState } from 'react';
import * as api from '../service';
import SF, {Form} from  'react-antd-super-form';


export default ()=>{

  const [cache, setCache] = useState({})


  return (<>
    <Form 
      layout="inline"
      data={(form, getValues)=>[
        {
          cType: Input,
          label: '汉字',
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
        {
          cType: Button,
          child: '转换',
          type: 'primary',
          onClick:()=>{
            getValues().then(values=>{
              console.log(values)
              api.batchCollectWord(values).then(res=>{
                if(res.status) {
                  const entry = res.entry || {};
                  message.success('转换成功')
                  setCache(entry)
                } else {
                  message.error('转换失败')
                }
              })
            })
          }
        }
      ]}
    />
    <p>汉字： <a onClick={()=>{
      const oAudio = document.getElementById("audio");
      let arrAudio = (cache.py || []).map(py=>`https://fanyiapp.cdn.bcebos.com/zhdict/mp3/${py}.mp3`);
      let arrNex = 0;
      console.log(arrAudio)
      oAudio.addEventListener('ended', function () {
          arrNex=arrNex+1;
          if(arrNex<arrAudio.length){
            oAudio.src=arrAudio[arrNex];
            oAudio.play();
            return;
          }
      }, false);
      oAudio.src=arrAudio[arrNex];
      if (oAudio.paused) {
        oAudio.play();
      }else {
        oAudio.pause();
      }
    }}>{cache.wd}</a></p>
    <p>拼音：{cache.py&&cache.py.map(py=>{
      return <a style={{
        padding: '0 10px'
      }} onClick={()=>{
        const oAudio = document.getElementById("audio");
        oAudio.src=`https://fanyiapp.cdn.bcebos.com/zhdict/mp3/${py}.mp3`;
        if (oAudio.paused) {
          oAudio.play();
        }else {
          oAudio.pause();
        }
      }}>{py}</a>
    })}</p>
    <div style={{
      display: 'none'
    }}><audio id="audio"></audio></div>
  </>)

}