import React, { Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Layout,Input,Collapse, Row, Col } from 'antd';
import './style.less';
import { CaretRightFilled, EyeFilled, SaveFilled, FileFilled } from '@ant-design/icons';
import { DndProvider } from 'react-dnd'
import  {HTML5Backend} from 'react-dnd-html5-backend'
import { Colors } from './Colors'
import { SourceBox } from './SourceBox'

import { StatefulTargetBox as TargetBox } from './TargetBox'
const { Header, Footer, Sider, Content } = Layout;
const { TextArea } = Input;
const { Panel } = Collapse;

export default ()=>{

  return (<>
      
    <Layout>
      <Header className="k-header">
          <div className="item"><FileFilled />页面列表</div>
          <div className="space"/>
          <div className="item"><SaveFilled />保存</div>
          <div className="item"><EyeFilled />预览</div>
          <div className="item"><CaretRightFilled />发布页面</div>
      </Header>
      <Layout>
        <DndProvider backend={HTML5Backend}>
          <Sider className="k-side" width={300}>
            <Collapse defaultActiveKey={['1']} onChange={()=>{}}>
              <Panel header="基础组件" key="1">
                <div className="grid">
                  <Row gutter={[8, 8]}>
                    <SourceBox type='Input' text="文本" />
                    <SourceBox type='Checkbox' text="搜索" />
                    <SourceBox type='Radio' text="图片" />
                  </Row>
                  <Row gutter={[8, 8]}>
                    <SourceBox type='Switch' text="链接" />
                    <SourceBox type='Select' text="组图" previewImg="https://static.zmjx.com/zmjx/2020/08/202008031041379251383.png"/>
                    <SourceBox type='Rate' text="图集" />
                  </Row>
                  <Row gutter={[8, 8]}>
                    <SourceBox type='HTML' text="HTML" />
                    <SourceBox type='JS' text="JS" />
                    <SourceBox type='form' text="表单" />
                  </Row>
                  <Row gutter={[8, 8]}>
                    <SourceBox type='TimePicker' text="标题" />
                    <SourceBox type='Button' text="按钮" />
                    <SourceBox type='DatePicker' text="视频" />
                  </Row>
                </div>
              </Panel>
              <Panel header="功能组件" key="2">
              <p>A dog is a type of domesticated animal.
    Known for its loyalty and faithfulness,
    it can be found as a welcome guest in many households across the world</p>
              </Panel>
            </Collapse>
          </Sider>
          <Content className="k-content">
            <TargetBox />
            
            
          </Content>
        </DndProvider>
        <Sider className="k-side"  width={350} collapsible collapsedWidth={0} collapsed={false}>
          <TextArea placeholder="textarea with clear icon" className="k-textarea" autoSize={{minRows: 35,maxRows:36}} allowClear onChange={()=>{}} />
        </Sider>
      </Layout>
    </Layout>
    </>)
}