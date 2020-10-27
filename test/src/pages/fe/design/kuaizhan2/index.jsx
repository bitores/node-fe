import React from 'react'
import { Card, Layout,Input,Collapse, Row, Col } from 'antd';
import { DndProvider } from 'react-dnd'
import  {HTML5Backend} from 'react-dnd-html5-backend'


const { Header, Footer, Sider, Content } = Layout;
const { Panel } = Collapse;

export default ()=>{


  return (<>
      
    <Layout>
      <Header className="k-header">
          {/* <div className="item"><FileFilled />页面列表</div>
          <div className="space"/>
          <div className="item"><SaveFilled />保存</div>
          <div className="item"><EyeFilled />预览</div>
          <div className="item"><CaretRightFilled />发布页面</div> */}
      </Header>
      <Layout>
        <DndProvider backend={HTML5Backend}>

          <Sider className="k-side" width={300} height={400} style={{background: 'white', height: 'calc(100vh - 150px)'}}>
            <Collapse defaultActiveKey={['1']} onChange={()=>{}}>
              <Panel header="基础组件" key="1">
                <p>基础组件</p>
                <p>基础组件</p>
                <p>基础组件</p>
                <p>基础组件</p>
                <p>基础组件</p>
                <p>基础组件</p>
                <p>基础组件</p>
                <p>基础组件</p>
                <p>基础组件</p>
              </Panel>
              <Panel header="功能组件" key="2">
                <p>功能组件</p>
              </Panel>
            </Collapse>
          </Sider>
          <Content className="k-content">
            <div></div>
            <div>2</div>
          </Content>
        </DndProvider>
        <Sider className="k-side"  width={350} collapsible collapsedWidth={0} collapsed={false}  style={{background: 'white'}}>
          {/* <TextArea placeholder="textarea with clear icon" className="k-textarea" autoSize={{minRows: 35,maxRows:36}} allowClear onChange={()=>{}} /> */}
          <p>侧边栏</p>
        </Sider>
      </Layout>
    </Layout>
    </>)
}