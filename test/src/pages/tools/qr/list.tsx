import React, { Fragment, useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, List, Avatar, Space, Divider, Popconfirm, Button, Input, message, Drawer, DatePicker } from 'antd';
import SF, {Modal} from 'react-antd-super-form';
import * as api from '../service';
import Icon, { GlobalOutlined, StarOutlined, LikeOutlined, MessageOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons';
import QRCode from 'qrcode';
import moment from 'moment';

const IconText = ({ icon, text }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

const handleModal = React.createRef();
const table = React.createRef();
export default ()=>{
  const [isEdit, setIsEdit] = useState(false);
  const [record, setRecord] = useState({})
  const [url, setUrl] = useState("");
  const [visible, setVisible] = useState(false);

  return (<PageHeaderWrapper>
    <Card>
      <SF
        ref={table}
        search={{
          data:[
            {
              cType: Button,
              child: '新建活码',
              icon: <PlusOutlined/>,
              type: 'primary',
              onClick:()=>{
                setIsEdit(false)
                setRecord({})
                handleModal.current.show();
              }
            }
          ]
        }}
        type='list'
        table={{
          isInit: true,
          action: api.toolQrList,
          itemLayout:"vertical",
          renderItem:item=>(
            <List.Item
              key={item.qr_desc}
              actions={[
                <IconText icon={StarOutlined} text="0" key="list-vertical-star-o" />,
                <IconText icon={EyeOutlined} text={item.view_count||0} key="list-vertical-view-o" />,
              ]}
              extra={
                <Fragment>
                   <a type="link" onClick={async ()=>{
                        const url = await QRCode.toDataURL(`http://192.168.6.10:1030/tool/qr/h/${item.slut}`);
                        setUrl(url)
                        setVisible(true)
                      }}>二维码</a>
                      <Divider type="vertical" />
                      <a type="link" onClick={()=>{
                        api.toolQrAdd({
                          name: `${item.qr_desc}-副本`,
                          url: item.url,
                        }).then(res=>{
                          if(res.status) {
                            table.current.refresh();
                            message.success('复制成功')
                          }else{
                            message.error(res.message)
                          }
                        })
                      }}>复制</a>
                      <Divider type="vertical" />
                  <a type="link" onClick={()=>{
                        setIsEdit(true)
                        setRecord(item)
                        handleModal.current.show();
                      }}>编辑</a>
                      <Divider type="vertical" />
                      <Popconfirm
                        title="确认删除"
                        onConfirm={()=>{
                          api.toolQrDel({
                            id: item.id,
                          }).then(res=>{
                            if(res.status){
                              table.current.refresh();
                            } else {
                              message.error(res.message)
                            }
                          })
                        }}
                      >
                        <a type="link" style={{color:'red'}}>删除</a>
                      </Popconfirm>
                </Fragment>
              }
            >
              <List.Item.Meta
                avatar={<Avatar size={32} icon={<GlobalOutlined />} />}
                title={item.qr_desc}
                description={(<div>
                  <p>创建时间：{moment(item.at).format("YYYY-MM-DD HH:mm:ss")} <span>{item.expire&&`  失效时间：${moment(item.expire).format("YYYY-MM-DD HH:mm:ss")}`}</span></p>
                  <div style={{wordBreak:'break-all'}}>{item.url}</div>
                </div>)}
              />
            </List.Item>
          ),
          
        }}
      />
      <Modal
        ref={handleModal}
        title={isEdit?'编辑':'新建'}
        onOk={(e, form)=>{
          const {validateFields} = form;
          validateFields().then(values=>{
            api[isEdit?'toolQrEdit':'toolQrAdd'](isEdit?{
              id: record.id,
              ...values,
            }: values).then(res=>{
              if(res.status) {
                table.current.refresh();
                handleModal.current.show(false);
                message.success('添加成功')
              }else{
                message.error(res.message)
              }
            })
          })
        }}
        form={{
          data:[
            {
              cType: Input,
              label: '名称',
              key: 'name',
              config:{
                initialValue: isEdit?record.qr_desc:'',
                rules:[
                  {
                    required: true,
                    message: '必填'
                  }
                ]
              }
            },
            {
              cType: Input,
              label: '网址',
              key: 'url',
              config:{
                initialValue: isEdit?record.url:'',
                rules:[
                  {
                    required: true,
                    message: '必填'
                  }
                ]
              }
            },
            {
              cType: DatePicker,
              label: '失效时间',
              key:'expire',
              format: "YYYY-MM-DD HH:mm:ss",
              disabledDate: current=>current && current < moment().endOf('day'),
              // disabledTime={disabledDateTime}
              showTime:{ defaultValue: moment('00:00:00', 'HH:mm:ss') }
            }
          ]
        }}
      />
    </Card>
    <Drawer
      placement="top"
      onClose={()=>setVisible(false)}
      visible={visible}
    >
      <center><img height="80%" width={'auto'} src={url}/></center>
    </Drawer>
    </PageHeaderWrapper>)
}