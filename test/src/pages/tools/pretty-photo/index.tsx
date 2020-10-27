import React, { Fragment, useState,useEffect } from 'react';
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

function pretty(image, value1, value2) {
 
  let dst = new cv.Mat();
  if (value1 == null || value1 == undefined) value1 = 3;//磨皮系数
  if (value2 == null || value2 == undefined) value2 = 1;//细节系数 0.5 - 2

  var dx = value1 * 5;//双边滤波参数
  var fc = value1 * 12.5;//参数
  var p = 0.1;//透明度

  let temp1 = new cv.Mat(), temp2 = new cv.Mat(), temp3 = new cv.Mat(), temp4 = new cv.Mat();

  cv.cvtColor(image, image, cv.COLOR_RGBA2RGB, 0);
  

  cv.bilateralFilter(image, temp1, dx, fc, fc);//bilateralFilter(Src)

  let temp22 = new cv.Mat();
  cv.subtract(temp1, image, temp22);//bilateralFilter(Src) - Src

  cv.add(temp22, new cv.Mat(image.rows, image.cols, image.type(), new cv.Scalar(128, 128, 128, 128)), temp2);//bilateralFilter(Src) - Src + 128

  cv.GaussianBlur(temp2, temp3, new cv.Size(2 * value2 - 1, 2 * value2 - 1), 0, 0);
  //2 * GuassBlur(bilateralFilter(Src) - Src + 128) - 1

  let temp44 = new cv.Mat();
  temp3.convertTo(temp44, temp3.type(), 2, -255);
  //2 * GuassBlur(bilateralFilter(Src) - Src + 128) - 256

  cv.add(image, temp44, temp4);
  cv.addWeighted(image, p, temp4, 1 - p, 0.0, dst);
  //Src * (100 - Opacity)

  cv.add(dst, new cv.Mat(image.rows, image.cols, image.type(), new cv.Scalar(10, 10, 10, 0)), dst);
  //(Src * (100 - Opacity) + (Src + 2 * GuassBlur(bilateralFilter(Src) - Src + 128) - 256) * Opacity) /100
  // return temp44
  return dst;
}
export  default ()=>{
  const [list, setList] = useState([])

  useEffect(()=>{
    (async ()=>{
      cv = await cv;
    })()
    
  },[])
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
          fileType: 'image/jpeg,image/jpg,image/png',
          size: 30 * 1024 * 1024,
          sizeErrorTip: '上传图片大小不得超过30M',
          showUploadList: false,
          customRequest:async ({ onSuccess, onError, file, onProgress })=>{

            // const formData = new FormData();
            // formData.append('file', file);

            // const res = await api.toolUploadFile(formData)

            // if(res.status) {
            //   let entry = res.entry||{};
            //   onSuccess(entry)
            //   list.push(entry.url)
            //   setList([...list])
            // } else {
            //   onError(res.message)
            // }

            
            const img = new Image();
            img.src=URL.createObjectURL(file);
            
            // 
            // let canvas = document.createElement('canvas');
            // canvas.id = 'canvas';
            // canvas.width = 500; //☜
            // canvas.height = 500;

            // let src=cv.imread(img);
            // cv.imshow("canvas", src);
            // src.delete();

            list.unshift({
              origin: URL.createObjectURL(file),
              // canvas
            })
            setList([...list])
          },
          innerHTML:()=>{
            return  (<div style={{height: 200}}>

                  <p className="ant-upload-text">将文件拖拽至此（支持多选），或点此</p>
                  <p className="ant-upload-hint">
                    支持单个文件或多个文件,单个文件最大不超过30M
                  </p>

            </div>)
          }
        },
      ]}
    />
    </Card>
    {
      list.map((item,index)=>{
        return (<div key={index} style={{display: 'flex'}}><img  src={item.origin} id={`img${index}`}   onClick={()=>{
          const img = document.getElementById(`img${index}`)
          const canvas = document.getElementById(`cvas${index}`)
          let src=cv.imread(img);
          img.style.display='none';
          canvas.style.display = '';
          let dst = pretty(src, 4, 3);
          cv.imshow(`cvas${index}`, dst);
          src.delete();
          dst.delete();
        }}/><canvas id={`cvas${index}`} style={{display: 'none'}} onClick={()=>{
          const canvas = document.getElementById(`cvas${index}`)
          var dataURL = canvas.toDataURL("image/png");
          // var a = document.getElementById("download");
          

          var image = canvas.toDataURL("image/png")
          var save_link = document.createElement('a');
          save_link.setAttribute("href",dataURL);
          save_link.setAttribute("download",`${new Date().getTime()}.png`);

          // save_link.href = image;
          // save_link.download ='测试.png';
                            
        var clickevent = document.createEvent('MouseEvents');
           clickevent.initEvent('click', true, false);
           save_link.dispatchEvent(clickevent);

        }}></canvas></div>)
      })
    }
   
  </PageHeaderWrapper>)
 
}


