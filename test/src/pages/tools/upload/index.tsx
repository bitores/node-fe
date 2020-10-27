import React, { Fragment, useState } from 'react';
import {  message,  Popover, Button, Card } from 'antd';
import {Form} from 'react-antd-super-form';
import sfupload from 'react-antd-super-upload';
import copy from 'copy-to-clipboard';
import * as api from '../service';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

const isImage = (url) => {
  const lastIndex = url.lastIndexOf('.');
  const type = url.substring(lastIndex + 1);
  return ['jpeg', 'jpg', 'gif', 'png', 'PNG', "JPEG", 'JPG', "GIF"].includes(type);
}
export  default ()=>{
  const [list, setList] = useState([])

  return (<PageHeaderWrapper content=" 这个页面只有 admin 权限才能查看">
  <Card>
    
 
    <Form 
      formLayout={{
        wrapperCol:{
          span: 24
        }
      }}
      data={form=>[
        {
          cType: sfupload,
          enDrag:  true,
          key: 'file',
          name: 'file',
          multiple: true,
          // accept: 'video/mp4',
          // fileType: 'image/jpeg,image/jpg,image/png',
          size: 30 * 1024 * 1024,
          sizeErrorTip: '上传图片大小不得超过30M',
          showUploadList: false,
          customRequest:async ({ onSuccess, onError, file, onProgress })=>{

            const formData = new FormData();
            formData.append('file', file);

            const res = await api.toolUploadFile(formData)

            if(res.status) {
              let entry = res.entry||{};
              onSuccess(entry)
              list.push(entry.url)
              setList([...list])
            } else {
              onError(res.message)
            }

          },
          innerHTML:()=>{
            return  (<div style={{height: 200}}>

                  <p className="ant-upload-text">将文件拖拽至此（支持多选），或点此上传</p>
                  <p className="ant-upload-hint">
                    支持单个文件或多个文件上传,单个文件最大不超过30M
                  </p>

            </div>)
          }
        },
        // {
        //   cType: Button,
        //   child: '查询',
        //   key: ',b',
        //   onClick: (e)=>{
        //     const {validateFields} = form;

        //     validateFields().then(values=>{
        //       console.log(values)
        //     })
        //   }
        // }
      ]}
    />
    </Card>
    {
      list.map((url,index)=>{
        return isImage(url)?(<Popover
          placement="right"
          content={<img width={100} src={url} />}
          key={index}
        >
          <span
            style={{display:'inline-block',maxWidth:'80%',height: 30,whiteSpace: 'nowrap',overflow:'hidden'}}
            onClick={() =>{
              copy(url);
              message.success('复制成功')
            }}
          >
            {url}
          </span>
        </Popover>):( <span
        key={index}
        style={{display:'inline-block',maxWidth:'80%',height: 30,whiteSpace: 'nowrap',overflow:'hidden'}}
        onClick={() =>{
          copy(url);
          message.success('复制成功')
        }}
      >
        {url}
      </span>)
      })
    }
   
  </PageHeaderWrapper>)
 
}


