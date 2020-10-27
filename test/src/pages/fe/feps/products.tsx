import React, { Fragment, useState, useEffect } from 'react';
import { Card,  Input, Button, Divider, Popconfirm, message, Select, Table, Tag, Tooltip, Drawer } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SF, {Modal} from 'react-antd-super-form';
import { CheckCircleOutlined } from '@ant-design/icons';
import moment from 'dayjs';
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime';
import * as api from "../service"; 


moment.extend(relativeTime)
const table = React.createRef();
const handleModal = React.createRef()
export default ({history, match}): React.ReactNode => {
  const id = match.params.productId;

  
  const [productId, setProductId] = useState(id==='0'?'':+id);
  const [record, setRecord] = useState({})
  const [products, setProducts] = useState([])
  const [logs, setLogs] = useState([])
  const [visible, setVisible] = useState(true);


  useEffect(()=>{
    async function init(){
      const productsRes = await api.queryFepsProducts();
      setProducts(productsRes.entry||[])
      
    }

    init()
    return ()=>false;
  },[])
  return (
    <PageHeaderWrapper content=" 这个页面只有 admin 权限才能查看">
      <Card>
        <SF
          ref={table}
          search={
            {
              layout: 'inline',
              data: [
                {
                  label: '项目名',
                  cType: Select,
                  key: 'product_id',
                  showSearch: true,
                  allowClear: true,
                  style:{
                    width: 150
                  },
                  config:{
                    initialValue: productId
                  },
                  filterOption:(input, option) =>{
                    return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  },
                  options:
                  [
                    {
                      label: '全部',
                      value: '',
                    },
                    ...products.map(p=>({
                    label: p.name,
                    value: p.id
                  }))],
                  onSelect: val=>{
                    if(val!=='') {
                      // setProductId(val);
                      history.push(`/fe/feps/list/${val}`)
                    }
                    table.current.refresh();
                  }
                },
                
                {
                  child: '刷新',
                  type: 'primary',
                  cType: Button,
                  bindSearch: true,
                },{
                  child: '实时日志',
                  cType: Button,
                  onClick: ()=>{
                    setVisible(true);
                  }
                },
              ]
            }
          }
          table={
            {
              scroll:{ x: 1500 },
              
              columns:[
                

                {
                  title: '项目名称',
                  dataIndex: 'product_name',
                  key: 'product_name',
                  width: 80,
                  fixed: 'left',
                  render: val=><a type="link" style={
                    {
                      color: '#000000',
                      // fontSize: 20,
                      // fontWeight: 500,
                      fontWeight: 'bold'
                    }
                  }>{val}</a>
                },
                {
                  title: '版本',
                  dataIndex: 'tag',
                  key: 'tag',
                  width: 50,
                  fixed: 'left',
                  render: (val, record)=>{
                    return record.is_current===1? <Tag icon={<CheckCircleOutlined />} color="success">
                    {val}
                  </Tag> : <Tag  color="default">
                    {val}
                  </Tag>
                  }
                },
                
                
                
                {
                  title: '构建时间',
                  dataIndex: 'build_at',
                  key: 'build_at',
                  width: 80,
                  render:val=>{
                    const m = moment(new Date(val));

                    const r = val&&<Tooltip title={m.format('YYYY-MM-DD HH:mm:ss')}>{m.locale('zh-cn').fromNow()}</Tooltip> 
                    return r;//
                  }
                },

                {
                  title: '发布备注',
                  dataIndex: 'deploy_desc',
                  key: 'deploy_desc',
                  width: 100,
                  render: val=>(<pre>{val}</pre>)
                },

                {
                  title: '发布时间',
                  dataIndex: 'deploy_at',
                  key: 'deploy_at',
                  width: 80,
                  render:val=>val&&moment(new Date(val)).locale('zh-cn').fromNow()
                },
                {
                  title: '发布人',
                  dataIndex: 'deploy_man',
                  key: 'deploy_man',
                  width: 100,
                },
                {
                  title: '构建人',
                  dataIndex: 'build_man',
                  key: 'build_man',
                  width: 100,
                },

                

                {
                  title: '操作',
                  key: '_',
                  width: 100,
                  fixed: 'right',
                  render:(_, record)=>{
                    return (<Fragment>
                      <a href={`#/fe/feps/logs/${record.product_id}`}>日志</a>
                      <Divider type="vertical"/>
                        {record.is_current===1?<Button type="link" disabled>已发布</Button>:<Popconfirm
                        title="确认发布此版本"
                        onConfirm={()=>{
                          setRecord(record)
                          handleModal.current.show()
                        }}
                      ><Button type="link" danger>发布</Button></Popconfirm>}
                      
                    </Fragment>)
                  }
                },
              ],
              expandable:{
                expandedRowRender: (record)=>{
                  const data = record.deploy_list;
                  return data.length>0?<Table 
                  rowKey="id"
                  columns={[
                    {
                      title: '发布时间',
                      dataIndex: 'deploy_at',
                      key: 'deploy_at',
                      width: 80,
                      render:val=>{
                        return val&&moment(new Date(val)).format('YYYY-MM-DD HH:mm:ss')
                      }
                    },
                    {
                      title: '发布备注',
                      dataIndex: 'deploy_desc',
                      key: 'deploy_desc',
                      width: 80,
                      render: val=>(<pre>{val}</pre>)
                    },
                    {
                      title: '发布人',
                      dataIndex: 'deploy_man',
                      key: 'deploy_man',
                      width: 100,
                    },
                    
                  ]}
                  dataSource={data} 
                  pagination={false}

                  />:<center>未发布</center>
                }
              },
              rowKey:"id",
              isInit: true,
              action:api.queryFepsBuild,
            }
          }
        />
        <Modal
          ref={handleModal}
          title="发布"
          destroyOnClose
          onOk={(e, form)=>{
            const {validateFields} = form;
            validateFields().then(values=>{
              api.fepsDeploy({
                id: record.id,
                ...values,
              }).then(res=>{
                if(res.status){
                  table.current.refresh();
                  handleModal.current.show(false)
                  message.success('发布成功')
                } else {
                  message.error(res.message)
                }
              })
            })
          }}
          
          form={{
            data:[
              {
                label: '发布备注',
                cType: Input.TextArea,
                placeholder: '请输入',
                key: 'deploy_desc',
                maxLength: 100,
                config:{
                  rules:[
                    {
                      required: true,
                      message: '请输入'
                    }
                  ]
                }
              },
            ]
          }}
        />
        
      </Card>
   </PageHeaderWrapper>
  )
};
