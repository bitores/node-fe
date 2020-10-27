import React, { useState, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, List, Avatar, Space } from 'antd';
import SF from 'react-antd-super-form';
import * as api from './service';
import { PropertySafetyFilled, EditOutlined, ClockCircleOutlined, UserOutlined, MessageOutlined, EyeOutlined } from '@ant-design/icons';
// import { router } from 'dva';
import {history} from 'umi';
import moment from 'moment';
/**
 * 图片加载失败就显示默认图片
 * 使用hook方式
 * @param {*} src  图片路径
 * @param {*} style  图片样式
 * @param {*} defaultImg  默认显示的图片路径
 */
const MyImg = ({src,  defaultImg, ...props}) => {
  const [imgSrc, handleImageErrored] = useState(src||defaultImg);
  // useEffect(() => {
      // 组件更新
  // });
  return (
      <img 
          src={imgSrc}
          onError={() => handleImageErrored(defaultImg)}
          {...props}
      />
  );
}

const IconText = ({ icon, text }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

export default ()=>{

  return (<Card style={{maxWidth: 800, margin:'0 auto'}}>
      <SF
        type='list'
        table={{
          isInit: true,
          action: api.queryList,
          itemLayout:"vertical",
          size:"large",
          renderItem: (item)=>{
            return (<List.Item
              key={item.id}
              actions={[
                // <Space>
                //   <EditOutlined onClick={()=>{
                //     // console.log(router)
                //     history.push(`/posts/write/${item.id}`)
                //   }} />
                // </Space>,
                item.keyword,
                <IconText icon={ClockCircleOutlined} text={moment(item.at).format("YYYY-MM-DD HH:mm:ss")} key="list-vertical-star-o" />,
                // <IconText icon={UserOutlined} text={item.author} key="list-vertical-like-o" />,
                <IconText icon={EyeOutlined} text={44} key="list-vertical-like-o" />,
                <IconText icon={MessageOutlined} text="2" key="list-vertical-message" />,
              ]}
              extra={
                // <MyImg
                //   width={150}
                //   alt="logo"
                //   src={item.head_img}
                //   defaultImg="https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1471257962,730539308&fm=15&gp=0.jpg"
                // />
                <a href={`#/posts/list/${item.id}`} style={{
                  color: 'white',
                  background: '#428bca',
                  padding: '5px 10px',
                  cursor: 'pointer',
                  position: 'absolute',
                  // right: 0,
                  // bottom: 0
                }}>阅读全文</a>
              }
              style={{
                position:'relative'
              }}
            >
              <List.Item.Meta
                avatar={
                <span style={{
                  display:'inline-block',
                  width: 35,
                  height: 35,
                  lineHeight: '35px',
                  textAlign: 'center',
                  borderRadius: 60,
                  background: '#ccc',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: 12
                }}>{item.type===1?'原创':'转载'}</span> 
              }
                title={<a href={`#/posts/list/${item.id}`}>{item.title}</a>}
                // description={`${item.keyword}`}
              />
              {item.brief}
              
              <div style={{
                marginTop: 10
              }}>
                <Space>
                  {
                    item.tags&&item.tags.split(',').map((tag,ind)=><span key={ind} style={{
                      backgroundColor: '#e8e8e8',
                      borderRadius: 4,
                      padding: '4px 8px'
                    }}>{tag}</span>)
                  }
                </Space>
              </div>
              
            </List.Item>)
          }
        }}
      />
    </Card>)
}