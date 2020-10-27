import { CameraOutlined, InboxOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Card, Input, message, Space, Tabs, upload } from 'antd';
import Search from 'antd/lib/input/Search';
import React, { useEffect, useState } from 'react';
import {Form} from 'react-antd-super-form';
import QrCode from 'qrcode-reader'
import './index.less';

const { TabPane } = Tabs;
const {Dragger} = upload;

const props = {
  name: 'file',
  multiple: true,
  showUploadList: false,
  // action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
  
};

export default ()=>{
  const [previewImages, setPreviewImages] = useState([])

  return <>
  <div className="qr">
    <Tabs defaultActiveKey="1" centered style={{width: '100%'}}>
      <TabPane tab="上传图片" key="1">
        <Dragger {...props} onChange={(info)=>{
          const { status } = info.file;
          if (status !== 'uploading') {
            // console.log(info.file, info.fileList);
          }
          if (status === 'done') {
            var imageType = /^image\//;

            if (!imageType.test(info.file.type)) {
              throw new Error('File type not valid');
            }

            // Read file
            const reader = new FileReader();
            reader.addEventListener('load', function() {
              // Show as preview image
              const qr = new QrCode();

              // Analyse code
              qr.callback = (err, value) => {
                if (err) {
                    console.error(err);
                    message.error('解析失败')
                    // TODO handle error
                } else {
                  setPreviewImages([
                    ...previewImages,
                    {
                      img: this.result,
                      dec: value.result
                    }
                  ])
                }
                
            };

              qr.decode(this.result);

            }.bind(reader), false);
            reader.readAsDataURL(info.file.originFileObj);

          } else if (status === 'error') {
            console.log('error')
          }
        }}>
          <p className="ant-upload-drag-icon">
            <UploadOutlined />
          </p>
          <center>上传或拖拽图片</center>
        </Dragger>
      </TabPane>
      <TabPane tab="输入二维码网址" key="2">

        <Form 
          layout="inline"
          data={(form,getValues)=>{
            return [
              {
                cType: Search,
                enterButton: '解码',
                size: 'large',
                placeholder: '请输入带二维码的图片网址',
                formItem:{
                  style: {
                    width: '100%'
                  }
                },
                onSearch: async (val)=>{
                  // Read file
                  const reader = new FileReader();
                  reader.addEventListener('load', function() {
                    // Show as preview image
                    const qr = new QrCode();
                    // Analyse code
                    qr.callback = (err, value) => {
                      if (err) {
                          console.error(err);
                          message.error('解析失败')
                          // TODO handle error
                      } else {
                        setPreviewImages([
                          ...previewImages,
                          {
                            img: this.result,
                            dec: value.result
                          }
                        ])
                      }
                    };
                    qr.decode(this.result);
                  }.bind(reader), false);

                    const response = await fetch(val);
                    const blob = await response.blob();
                    reader.readAsDataURL(blob);
                  
                }
              }
            ]
          }}
        />
      </TabPane>
      <TabPane tab="摄像头扫描二维码" key="3">
        <div className="qr-camera" onClick={()=>{

        }}>
          <Space  direction="vertical">
            <CameraOutlined style={{fontSize: 40, color:'#40a9ff'}}/>
            <center>启用摄像头，对准二维码图片</center>
          </Space>
        </div>
      </TabPane>
    </Tabs>
  </div>
  <div className="qr">
    {
      previewImages.map(item=>{
        return <Card
          hoverable
          style={{ width: 240 }}
          cover={<img alt="example" src={item.img} />}
        >
          <Card.Meta title={''} description={item.dec} />
        </Card>
      })
    }
  </div>
  </>
}