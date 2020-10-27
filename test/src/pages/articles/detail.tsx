import React, { useEffect, useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Tabs, message, Space } from 'antd';
import * as api from './service';
import Vditor from 'vditor';
import "vditor/dist/index.css";
import moment from 'moment';
import { ClockCircleOutlined, UserOutlined, EyeOutlined, MessageOutlined } from '@ant-design/icons';

const IconText = ({ icon, text }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

const vditorRef = React.createRef();
export default (props)=>{
  
  const  [data, setData] =  useState({});
  const  [htmlData, setHtmlData] =  useState("");

  useEffect(()=>{

    api.queryDeail({
      id:  props.match.params.id
    }).then(async res=>{
      if(res.status){
        const entry = res.entry || {};
        Vditor.setCodeTheme('github')
        // Vditor.setContentTheme('dark', 'https://cdn.jsdelivr.net/npm/vditor/dist/css/content-theme')
        const text = await Vditor.md2html(entry.content||"")

        const previewElement = document.getElementById('preview')
        previewElement.innerHTML = text
        Vditor.highlightRender({lineNumber: true, enable: true}, previewElement)
        Vditor.codeRender(previewElement)

        Vditor.mathRender(previewElement)
        Vditor.mindmapRender(previewElement)
        Vditor.chartRender(previewElement)
        Vditor.mermaidRender(previewElement)
        Vditor.abcRender(previewElement)
        Vditor.mediaRender(previewElement)
        Vditor.graphvizRender(previewElement)

        
        setHtmlData(text)
        setData(entry)
      } else {
        message.error(res.message)
      }
    })
  },[])

  return (<Card  style={{maxWidth:800, margin:'0 auto'}}>
      <Space align="center">
        <span
        style={{
          display:'inline-block',
          width: 25,
          height: 25,
          lineHeight: '25px',
          textAlign: 'center',
          borderRadius: 60,
          background: '#ccc',
          color: 'white',
          // fontWeight: 'bold',
          fontSize: 8
        }}
      >{data.type===2?'转载':'原创'}</span><h1>{data.title}</h1>
      </Space>
      
      <div style={{
        display: 'flex',
        justifyContent: 'space-between'
      }}> <span>
        <Space>
          {[
          <IconText icon={UserOutlined} text={data.author} key="list-vertical-like-o" />,
          <IconText icon={ClockCircleOutlined} text={moment(data.at).fromNow()} key="list-vertical-star-o" />,
          // 
          <IconText icon={EyeOutlined} text={44} key="list-vertical-like-1" />,
          <IconText icon={MessageOutlined} text="2" key="list-vertical-message" />
        ]}
        </Space>
        
        </span></div>
      <div style={{
        marginTop: 10
      }}>
        <Space>
          {
            data.tags&&data.tags.split(',').map((tag,ind)=><span key={ind} style={{
              backgroundColor: '#e8e8e8',
              borderRadius: 4,
              padding: '4px 8px'
            }}>{tag}</span>)
          }
        </Space>
      </div>
      <div id="preview" className="vditor-reset"/>
      {/* dangerouslySetInnerHTML={{__html: htmlData}}  */}
    </Card>)
}