import React, { Fragment, useState, useEffect } from 'react';
import { Card,  Timeline } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { ClockCircleOutlined } from '@ant-design/icons';
import moment from 'dayjs';
import * as api from "../service"; 

export default ({history, match}): React.ReactNode => {
  const id = match.params.productId;

  
  const [productId, setProductId] = useState(id==='0'?'':+id);
  const [logs, setLogs] = useState([])
  const [products, setProducts] = useState([])

  useEffect(()=>{
    async function init(){
      const productsRes = await api.queryFepsProducts();
      setProducts(productsRes.entry||[])
      const logsRes = await api.queryFepsLogs({
        product_id:productId
      })

      setLogs(logsRes.entry||[])
      return ()=>false;
    }

    init()
  },[])
  return (
    <PageHeaderWrapper content=" 这个页面只有 admin 权限才能查看">
  

      <Card>
      

        <Timeline mode="left">
          {
            logs.map(item=>{
              return <Timeline.Item
                key={item.id}
                dot={item.is_current===1?<ClockCircleOutlined />:null}
                label={moment(item.deploy_at).format('YYYY-MM-DD HH:mm:ss')}>
                 <p>项目版本：【{item.product_name}】{item.tag}</p>
                 <p>[{item.deploy_man}]：{item.deploy_desc}</p>
              </Timeline.Item>
            })
          }
        </Timeline>
        
      </Card>
    </PageHeaderWrapper>
  )
};
