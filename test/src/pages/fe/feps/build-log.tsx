import React, { useState, useEffect } from 'react';
import { Card, message, Drawer, Spin } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import * as api from "../service"; 

export default ({history, match}): React.ReactNode => {
  const [logs, setLogs] = useState([])
  const [visible, setVisible] = useState(true);

  useEffect(()=>{
    async function init(){
      const res = await api.queryRealTimeLog({});
      if(res.status){
        setLogs(res.entry||[]);
        document.getElementById('footer')?.scrollIntoView()
      } else {
        message.error(res.message)
      }
    }
    init()
    const timer = setInterval(init, 5000);
    

    return ()=>{
      if(timer!==null){
        clearInterval(timer);
      } 
    };
  },[])
  return (
    // <PageHeaderWrapper content=" 这个页面只有 admin 权限才能查看">
      <Card bodyStyle={{
        position: 'fixed',
        top: 64,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999,
        // pointerEvents: 'none',
        // height: '80vh',
        overflow: 'scroll',
        background: 'rgba(0,0,0,.7)',
        color: '#63cb47'
      }}>
        <div style={{
          width: '100%',
          // height: '100%',
          // overflow: 'scroll'
        }}>
          {
            logs.map((log,index)=>{
            return  <pre key={`${index}_${log}`} style={{
              whiteSpace: 'break-spaces',
              display: 'flex'
            }}><span style={{color: 'red',paddingRight: 15}}>$</span>
              {
                log
              }
            </pre>
          })
        }
        <div id="footer">
          <Spin />
        </div>
        </div>
      
      </Card>
    // {/* </PageHeaderWrapper> */}
  )
};
