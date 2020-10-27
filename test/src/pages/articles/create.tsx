import React, { useState, useEffect } from 'react';
import { Card, Input, Button, Row, Col, Select, Drawer, Upload, message } from 'antd';
// import {Form} from 'react-antd-super-form';
import Form from './Form';
import Editor from './vditor';

import * as api from './service';
import * as toolApi from '../tools/service';


const vEditor = React.createRef();
export default (props)=>{


  const [lowSetting, setLowSetting] = useState(false);
  const [highSetting, setHighSetting] = useState(false);
  const [isEdit] = useState(props.match.params.id!==undefined)
  const [data, setData] =  useState({});

  useEffect(()=>{
    let timer = null;
    if(props.match.params.id) {
      api.queryDeail({
        id:  props.match.params.id
      }).then(async res=>{
        if(res.status){
          const entry = res.entry || {};


          timer = setInterval(()=>{
            const lute = vEditor.current.editor.vditor.lute;
            if(lute) {
              clearInterval(timer);
              timer = null;
              setData(entry)
            }
          }, 100)

          
        } else {
          message.error(res.message)
        }
      })
    }
    return ()=>{
      clearInterval(timer);
    }
  },[])



  return (<Card>
    <Form 
      formLayout={{
        wrapperCol:{
          span:24
        }
      }}
      data={form=>[
        {
          cType: Input,
          addonBefore: '文章标题',
          placeholder: '文章标题',
          key: 'title',
          // size:"large",
          config: {
            initialValue: data.title,
            rules:[
              {
                required: true,
                message: '请输入'
              }
            ]
          }
        },

        {
          cType: Editor,
          height:700,
          ref: vEditor,
          key: 'content',
          toolbarConfig:{
            // hide: true
          },
          outline: true,
          preview: {
            "hljs": {
              "lineNumber": true
            },
            actions:[]
          },
          toolbar: [
            'emoji',
            'headings',
            'bold',
            'italic',
            'strike',
            'link',
            '|',
            'list',
            'ordered-list',
            'check',
            'outdent',
            'indent',
            '|',
            'quote',
            'line',
            'code',
            'inline-code',
            'insert-before',
            'insert-after',
            '|',
            'upload',
            // 'record',
            'table',
            // '|',
            // 'undo',
            // 'redo',
            '|',
            'edit-mode',
            'content-theme',
            // 'code-theme',
            'export',
            'fullscreen',
            // 'both',
            // {
            //   name: 'more',
            //   toolbar: [
            //     'fullscreen',
            //     'both',
            //     'preview',
            //     'info',
            //     'help',
            //   ],
            // },
            // {
            //   hotkey: '⌘-⇧-S',
            //   name: 'sponsor',
            //   tipPosition: 's',
            //   tip: '成为赞助者',
            //   className: 'right',
            //   icon: '<svg t="1589994565028" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2808" width="32" height="32"><path d="M506.6 423.6m-29.8 0a29.8 29.8 0 1 0 59.6 0 29.8 29.8 0 1 0-59.6 0Z" fill="#0F0F0F" p-id="2809"></path><path d="M717.8 114.5c-83.5 0-158.4 65.4-211.2 122-52.7-56.6-127.7-122-211.2-122-159.5 0-273.9 129.3-273.9 288.9C21.5 562.9 429.3 913 506.6 913s485.1-350.1 485.1-509.7c0.1-159.5-114.4-288.8-273.9-288.8z" fill="#FAFCFB" p-id="2810"></path><path d="M506.6 926c-22 0-61-20.1-116-59.6-51.5-37-109.9-86.4-164.6-139-65.4-63-217.5-220.6-217.5-324 0-81.4 28.6-157.1 80.6-213.1 53.2-57.2 126.4-88.8 206.3-88.8 40 0 81.8 14.1 124.2 41.9 28.1 18.4 56.6 42.8 86.9 74.2 30.3-31.5 58.9-55.8 86.9-74.2 42.5-27.8 84.3-41.9 124.2-41.9 79.9 0 153.2 31.5 206.3 88.8 52 56 80.6 131.7 80.6 213.1 0 103.4-152.1 261-217.5 324-54.6 52.6-113.1 102-164.6 139-54.8 39.5-93.8 59.6-115.8 59.6zM295.4 127.5c-72.6 0-139.1 28.6-187.3 80.4-47.5 51.2-73.7 120.6-73.7 195.4 0 64.8 78.3 178.9 209.6 305.3 53.8 51.8 111.2 100.3 161.7 136.6 56.1 40.4 88.9 54.8 100.9 54.8s44.7-14.4 100.9-54.8c50.5-36.3 108-84.9 161.7-136.6 131.2-126.4 209.6-240.5 209.6-305.3 0-74.9-26.2-144.2-73.7-195.4-48.2-51.9-114.7-80.4-187.3-80.4-61.8 0-127.8 38.5-201.7 117.9-2.5 2.6-5.9 4.1-9.5 4.1s-7.1-1.5-9.5-4.1C423.2 166 357.2 127.5 295.4 127.5z" fill="#141414" p-id="2811"></path><path d="M353.9 415.6m-33.8 0a33.8 33.8 0 1 0 67.6 0 33.8 33.8 0 1 0-67.6 0Z" fill="#0F0F0F" p-id="2812"></path><path d="M659.3 415.6m-33.8 0a33.8 33.8 0 1 0 67.6 0 33.8 33.8 0 1 0-67.6 0Z" fill="#0F0F0F" p-id="2813"></path><path d="M411.6 538.5c0 52.3 42.8 95 95 95 52.3 0 95-42.8 95-95v-31.7h-190v31.7z" fill="#5B5143" p-id="2814"></path><path d="M506.6 646.5c-59.6 0-108-48.5-108-108v-31.7c0-7.2 5.8-13 13-13h190.1c7.2 0 13 5.8 13 13v31.7c0 59.5-48.5 108-108.1 108z m-82-126.7v18.7c0 45.2 36.8 82 82 82s82-36.8 82-82v-18.7h-164z" fill="#141414" p-id="2815"></path><path d="M450.4 578.9a54.7 27.5 0 1 0 109.4 0 54.7 27.5 0 1 0-109.4 0Z" fill="#EA64F9" p-id="2816"></path><path d="M256 502.7a32.1 27.5 0 1 0 64.2 0 32.1 27.5 0 1 0-64.2 0Z" fill="#EFAFF9" p-id="2817"></path><path d="M703.3 502.7a32.1 27.5 0 1 0 64.2 0 32.1 27.5 0 1 0-64.2 0Z" fill="#EFAFF9" p-id="2818"></path></svg>',
            //   click () {alert('捐赠地址：https://hacpai.com/sponsor')},
            // }
          
          ],
          cache: {
            enable: false,
          },
          upload:{
            handler:  (files: File[])=>{
              files.map(file=>{
                return new Promise((resolve, reject)=>{
                  const formData = new FormData();
                  formData.append('file', file);

                  toolApi.toolUploadFile(formData).then(res=>{
                    if(res.status) {
                      const entry = res.entry ||"";
                      resolve(entry)
                      // Editor.options.upload
                      vEditor.current.editor.insertValue(`![](${entry})`)
                    } else {
                      reject()
                    }
                  })
                })
                
              })
            },
        
          },
          // hint: {
          //   emojiPath: 'https://static.hacpai.com/emoji/graphics',
          //   emojiTail: '<a href="https://hacpai.com/settings/function" target="_blank">设置常用表情</a>',
          //   emoji: {
          //     '+1': '👍',
          //     '-1': '👎',
          //     'trollface': 'https://unpkg.com/vditor@1.3.1/dist/images/emoji/trollface.png',
          //     'huaji': 'https://unpkg.com/vditor@1.3.1/dist/images/emoji/huaji.gif',
          //   },
          //   at: (key) => {
          //     console.log(`atUser: ${key}`)
          //     return [
          //       {
          //         value: '@88250',
          //         html: '<img src="https://img.hacpai.com/avatar/1353745196354_1535379434567.png?imageView2/1/w/52/h/52/interlace/0/q"> 88250',
          //       },
          //       {
          //         value: '@Vanessa',
          //         html: '<img src="https://img.hacpai.com/avatar/1353745196354_1535379434567.png?imageView2/1/w/52/h/52/interlace/0/q"> Vanessa',
          //       }]
          //   },
          // },

          config:{
            initialValue: data.content,
            getValueFromEvent:(data)=>data,
            rules:[
              {
                required: true,
                message: '必填'
              }
            ]
          }
        },
        // {
          
        //   cType: Input,
        //   addonBefore: '封面链接',
        //   placeholder: '封面链接',
        //   addonAfter:(<Upload
        //     name='file'
        //     // listType="picture-card"
        //     showUploadList={false}
        //     action='https://www.mocky.io/v2/5cc8019d300000980a055e76'
        //     headers={{
        //       authorization: 'authorization-text',
        //     }}
        //     onChange={(info)=>{
        //       if (info.file.status !== 'uploading') {
        //         console.log(info.file, info.fileList);
        //       }
        //       if (info.file.status === 'done') {
        //         form.setFieldsValue({
        //           url: info.file.response.url
        //         }) 
        //         message.success(`${info.file.name} file uploaded successfully`);
        //       } else if (info.file.status === 'error') {
        //         message.error(`${info.file.name} file upload failed.`);
        //       }
        //     }}
        //   ><span>上传</span></Upload>),
        //   key: 'url',
        //   // size:"small",
        //   config: {
        //     initialValue: data.head_img,
        //     rules:[
        //       {
        //         required: true,
        //         message: '请输入'
        //       }
        //     ]
        //   }
        // },
        {
          cType: 'grid',
          gutter:{ xs: 8, sm: 16, md: 24, lg: 32 },
          colProps:{
            span: 6,
          },
          children:[
            {
              cType: Select,
              placeholder: '请选择',
              key: 'type',
              // size:"small",
              width: 200,
              config: {
                initialValue: data.type||1,
                rules:[
                  {
                    required: true,
                    message: '请输入'
                  }
                ]
              },
              options:[
                {
                  label: '原创',
                  value: 1,
                },
                {
                  label: '转载',
                  value: 2,
                }
              ]
            },
            {
              cType: Select,
              placeholder: '标签',
              allowClear:true,
              mode:'tags',
              tokenSeparators:[',','，'],
              key: 'tags',
              // size:"small",
              width: 200,
              config: {
                // initialValue: isEdit?(data.tags===""?[]:(data.tags||"").split(',')):[],
                rules:[
                  {
                    required: false,
                    message: '请输入'
                  }
                ]
              }
            },
            {
              cType: Select,
              placeholder: '文章分类',
              allowClear:true,
              // mode:'multiple',
              showSearch:true,
              key: 'classify',
              width: 200,
              optionFilterProp:"label",
              filterOption:(input, option) => option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0,
              config: {
                initialValue: data.classify,
                rules:[
                  {
                    required: false,
                    message: '请输入'
                  }
                ]
              },
              options:[
                {
                  label: '前端',
                  value: 1,
                },
                {
                  label: '后端',
                  value: 2,
                },
                {
                  label: '开发工具',
                  value: 3,
                },
                {
                  label: '其它',
                  value: 4,
                },
              ]
            }
          ]
        },
        {
          formItem:{
            style:{
              display: 'inline-block',
              margin: '0 8px'
            },
          },
          cType: Button,
          type: 'primary',
          child: '发布',
          onClick:()=>{
            const {validateFields} = form;
            validateFields().then(values=>{
              console.log(values)
              const tags = values.tags ||[];

              console.log(vEditor.current)
              api[isEdit?"editArticle":"addArticle"]({
                id: isEdit? data.id:null,
                ...values,
                tags: tags.join(','),
                html: vEditor.current.editor.getHTML(),
              }).then(res=>{
                if(res.status) {
                  message.success(isEdit?'修改成功':'添加成功')

                } else {
                  message.error(res.message)
                }
              })
            })
          }
        },
        
      ]}
    />
  </Card>)
}