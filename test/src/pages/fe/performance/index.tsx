import React, { Fragment, useState, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Input, Button, message, Space, Tooltip,List } from 'antd';
import SF from 'react-antd-super-form';
import * as api from '../service';
import moment from 'moment';


function  download(name, href) {
  var a = document.createElement("a"), //创建a标签
      e = document.createEvent("MouseEvents"); //创建鼠标事件对象
  e.initEvent("click", false, false); //初始化事件对象
  a.href = href; //设置下载地址
  a.target = '__blank';
  a.download = name; //设置下载文件名
  a.dispatchEvent(e); //给指定的元素，执行事件click事件
}

function getTiming(item:any) {
  try {
      // var time = new Function( 'return ' + )()
      const time = JSON.parse(item.timing);
      // var timingObj = {};
      // var loadTime = (time.loadEventEnd - time.loadEventStart) / 1000;

      console.log(time)
      item.tips = [
        // 参考 https://zhuanlan.zhihu.com/p/44207458
        ['DNS解析耗时', (+time.domainLookupEnd - time.domainLookupStart) ],
        ['TCP连接耗时', (+time.connectEnd - time.connectStart) ],
        ['SSL安全连接耗时', (+time.connectEnd - time.secureConnectionStart) ],
        ['网络请求耗时(TTFB)', (+time.responseEnd - time.requestStart) ],
        ['数据传输耗时', (+time.responseEnd - time.responseStart) ],
        ['DOM解析耗时', (+time.domInteractive - time.responseEnd) ],
        ['资源加载耗时', (+time.loadEventStart - time.domContentLoadedEventEnd) ],
        ['首包时间', (+time.responseStart - time.domainLookupStart) ],
        ['首次渲染时间 / 白屏时间', (+time.responseEnd - time.fetchStart) ],
        ['首次可交互时间', (+time.domInteractive - time.fetchStart) ],
        ['DOM Ready时间', (+time.domContentLoadedEventEnd - time.fetchStart) ],
        ['页面完全加载时间', (+time.loadEventStart - time.fetchStart)],

        // 下面为野鸡算法
        // ['重定向时间', (+time.redirectEnd - time.redirectStart) / 1000],
        // ['白屏时间',(+time.responseStart - time.navigationStart) / 1000],
        // ['DOM开始加载前所花费时间', (+time.responseEnd - time.navigationStart) / 1000],
        // ['DOM加载完成时间', (+time.domComplete - time.domLoading) / 1000],
        // ['DOM结构解析完成时间', (+time.domInteractive - time.domLoading) / 1000],
        // ['dom渲染完成时间', (+time.domContentLoadedEventEnd - time.navigationStart) / 1000],
        // ['脚本加载时间', (+time.domContentLoadedEventEnd - time.domContentLoadedEventStart) / 1000],
        // ['onload事件时间', (+time.loadEventEnd - time.loadEventStart) / 1000],
        // ['js内存使用占比', (time.usedJSHeapSize / time.totalJSHeapSize * 100).toFixed(2) + '%']
        // ['页面完全加载时间', (timingObj['重定向时间'] + timingObj['DNS解析时间'] + timingObj['TCP完成握手时间'] + timingObj['HTTP请求响应完成时间'] + timingObj['DOM结构解析完成时间'] + timingObj['DOM加载完成时间'])]

      ]
  } catch(e) {
      console.log(e)
  }
}

function getEntries(item: any) {
  const  entries = JSON.parse(item.entries)
  item.entries = entries;
  return entries;
}

const table = React.createRef();
export default ()=>{
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [listData, setListData] = useState([])
  // const [latest, setLatest] = useState([]);

  useEffect(()=>{
    api.queryLatestAnalize({}).then(res=>{
      const entry = res.entry || [];
      setData(entry.map(item=>{
        getTiming(item);
        return item
      }))
    })
  },[])
  return (<>

      <Input.Search 
        addonBefore="https://"
        placeholder="h5.zmjx.com/FE/help/rebate.html"
        defaultValue="h5.zmjx.com/FE/help/rebate.html"
        enterButton='开始分析'
        loading={loading}
        onSearch={value => {
            setLoading(true)
            const hasHTTP = value.includes('http');
            api.analizę({
              url: hasHTTP? value: `https://${value}`,
            }).then(res=>{
              setLoading(false);
              if(res.status) {
                const entry = res.entry||{};
                  getTiming(entry)
                  // images.push(entry.shot);
                  let list = getEntries(entry);
                  setData([entry,...data])
                  setListData([...list])
                  table.current.reset()
                  
              } else {
                message.error(res.message)
              }
            })
            
          }
        }
       />
    <SF 
      ref={table}
      table={{
        isInit: true,
        dataSource:listData,
        pagination:{
          pageSize: 5
        },
        columns:[
          {
            title: 'Name',
            dataIndex: 'name',
            ellipsis: true,
          },{
            title: 'Type',
            dataIndex: 'initiatorType',
          },{
            title: 'GSize',
            dataIndex: 'encodedBodySize',
          },{
            title: 'Size',
            dataIndex: 'decodedBodySize',
          },{
            title: 'Protocol',
            dataIndex: 'nextHopProtocol',
          },{
            title: 'entryType',
            dataIndex: 'entryType',
          },{
            title: 'Time',
            dataIndex: 'duration',
          },{
            title: 'TTFB',
            render:(_, record)=>{
              return (record.responseStart||0) - (record.requestStart||0)
            }
          }
        ]
      }}
    />
    {
      data.map((item, index)=>{
        return  <Card
        key={`${index}_`}
        hoverable
        style={{ width: 240,marginTop: 5, marginRight: 5, display: 'inline-block' }}
        cover={<img alt="截图" src={item.shot} />}
        actions={[
          <Tooltip placement="topLeft" title={
            <div>
              {/* <p>重定向时间: {item.timing["重定向时间"]}</p> */}
              {
                item.tips.map((tip,ind)=>{
                return <p key={ind}>{tip[0]}:{tip[1]} ms</p>
                })
              }
            </div>
          } arrowPointAtCenter>
            <span>性能指数</span>
          </Tooltip>,
          <span onClick={()=>download('',`http://localhost:1030/feps/performance/download/zip?id=${item.id}`)} style={{ width: 300 }}>下载完整数据包</span>
        ]}
      >
        <Card.Meta style={{wordBreak:'break-all'}} title={<Tooltip title={item.url}>{item.title}</Tooltip>} description={
          <div>
            <p>{moment(item.at).fromNow()}</p>
            <p>统计图待开发</p>
          </div>
        } />
      </Card>
      })
    }

    
    {/* <List 
      dataSource={list}
      renderItem={item=>{
        return (<List.Item
          actions={[<a key="list-loadmore-edit">{item.decodedBodySize}</a>, <a key="list-loadmore-more">{item.duration}</a>]}
        >
        <div>
        {item.name}
        </div>
        </List.Item>)
      }}
    /> */}
    </>)
}