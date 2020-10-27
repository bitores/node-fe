import React, { Fragment, useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Input, Button, message, Layout, Divider, Space, Collapse } from 'antd';
import MonacoEditor from 'react-monaco-editor';

import * as api from '../service';
import { FileAddFilled, FolderAddOutlined } from '@ant-design/icons';

const { Header, Footer, Sider, Content } = Layout;
const { Panel } = Collapse;

export default ()=>{
  const [code, setCode] = useState('');
  
  return (<>
    <Layout>
      <Layout>
        <Sider style={{background: '#1e1e1e'}}>
          {/* <Space direction="vertical">
            <Button type="primary" block>新建文件</Button>
            <Divider />
          </Space> */}
          <Collapse defaultActiveKey={['1']} >
            <Panel header={
              <div style={{
                display: 'flex',
                justifyContent:'space-between'
              }}>
                <span>Files</span>
                <Space>
                  <FileAddFilled 
                  onClick={(e)=>{
                    e.stopPropagation();
                    e.preventDefault();

                    return false;
                  }}
                /><FolderAddOutlined 
                  onClick={(e)=>{
                    e.stopPropagation();
                    e.preventDefault();

                    
                    return false;
                  }}
                /></Space>
              </div>
            } key="1">
              <p>{'==='}</p>
            </Panel>
            {/* <Panel header="This is panel header 2" key="2">
              <p>{text}</p>
            </Panel>
            <Panel header="This is panel header 3" key="3" disabled>
              <p>{text}</p>
            </Panel> */}
          </Collapse>
          
        </Sider>
        <Content>
          <MonacoEditor
            width="100%"
            height="600"
            language="javascript"
            theme="vs-dark"
            value={code}
            options={{
              selectOnLineNumbers: true,
              renderSideBySide: false
            }}
            onChange={(newValue, e)=>{
              console.log('onChange', newValue, e);
            }}
            editorDidMount={(editor, monaco)=>{
              console.log('editorDidMount', editor);

              editor.focus();

            }}
          />
        </Content>
      </Layout>
      <Footer style={{background: '#1e1e1e'}}>Footer</Footer>
    </Layout>
    

    </>)
}