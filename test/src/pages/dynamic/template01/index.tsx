import React, { Fragment, useState, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, message, Space, Popconfirm, Input, Tooltip } from 'antd';
import SF, {Modal} from 'react-antd-super-form';
import * as api from './service';
const antd = require('antd');

const editModal = React.createRef();
const detailModal = React.createRef();
const tableRef = React.createRef()
export default (props)=>{
  // const [pageId] = useState(props.match.params.pageId)
  // console.log(antd)

  const [searchData, setSearchData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [actions, setActions] = useState([]);
  const [action, setAction] = useState('');
  const [record, setRecord] = useState({});
  const [detailFields, setDetailFields] = useState([])
  const [editFields, setEditFields] = useState([])


  useEffect(()=>{
    const {pageId} = props.match.params;
    api.queryPageConfig(pageId).then(res=>{
      if(res.status){
        // message.success('操作')
        const entry = res.entry || {};
        setSearchData(entry.searchData||[]);
        setColumns(entry.columns.data||[])
        setActions(entry.columns.actions||[])
        setAction(entry.action)
        
        tableRef.current.refresh();
      } else {
        message.error(res.message)
      }
    })

    return ()=>false;
  },[props.match.params.pageId])


  return (<PageHeaderWrapper content=" 这个页面只有 admin 权限才能查看">
    <Card>
    动态测试页面 ，参数：{JSON.stringify(props.match.params||{})}
      <SF
        ref={tableRef}
        search={{
          layout: 'inline',
          data: (form, getValues)=>searchData.map(item=>{
            const {
              bindReset=false,
              ...o
            } = item;

            if(bindReset) {
              o.onClick = ()=>{
                form.resetFields();
                tableRef.current.reset();
              }
            }

            return {
              ...o,
              cType: antd[item.cType]||item.cType,

            }
          })
        }}
        table={{
          // isInit: true,
          rowKey: 'id',
          action:async (params)=>{
            console.log(action)
            // return new Promise((resolve, reject)=>{
            //   resolve({
            //     status: true,
            //     entry: [
            //       {
            //         id: 1,
            //         name: 'xx1xx1xx1xx1xx1xx1xx1xx1xx1xx1xx1xx1xx1',
            //         status: 1,
            //       },{
            //         id: 2,
            //         name: 'xx2',
            //         status: 2,
            //       },{
            //         id: 3,
            //         name: 'xx3',
            //         status: 1,
            //       },{
            //         id: 4,
            //         name: 'xx4',
            //         status: 2
            //       },
            //     ]
            //   })
            // })
            return api.getData(action,params)
          },
          columns:[
            ...columns.map(item=>{
              item.render = val=>{
                return item.ellipsis?<Tooltip placement="topLeft" title={val}>
                      {val}
                    </Tooltip>: val;
              }
              return item;
              
            }),
            {
              title: '操作',
              fixed: 'right',
              // dataIndex: 'id',
              // key: 'id'
              render:(_, record)=>{
                // return actions.map(act=>{

                //   return <span>{act.title}</span>
                // })


               return <Space>
                  {
                    actions.map((item, ind)=>{
                      if(item.isbind&&record.status !== item.value) return null;

                      if(item.isConfirm) {
                        return <Popconfirm key={`p_${ind}`} title={item.confirmText||"确认操作？"} onConfirm={()=>{
                          console.log(`${item.title}操作`, record.id)
                        }}>
                          <a {...item.config}>{item.title}</a>
                        </Popconfirm> 

                      // } else if(item.isDetail) {
                        

                      } else  {
                        return <a key={`a_${ind}`} {...item.config} onClick={()=>{
                          setRecord(record);

                          if(item.isDetail) {
                            setDetailFields(item.filters||Object.keys(record));
                            
                            
                            detailModal.current.show();

                          } else if(item.isEdit) {
                            setEditFields(item.filters||[])
                            editModal.current.show();
                          }
                        }}>{item.title}</a>
                      }
                      
                    })
                  }
                </Space>
              }
            }
          ]
        }}
      />
    </Card>
    <Modal 
      ref={detailModal}
      title="详情"
      width={800}
      form={{

        // data: form=>{
        //   return [
        //     {
        //       label: 'xxx',
        //       cType: Input,
        //     }
        //   ]
        // }

        data: form=>{

          // return {
          //   cType: 'grid',
          //   children:[

          //   ]
          // }
          return detailFields.map(field=>{
            console.log(record, field)
            return {
              label: field.label,
              // cType: 'span',
              // cType: Input,
              render:()=>{
                return record[field.key]
              }
            }
          })
        }


      }}
    />

<Modal 
      ref={editModal}
      title="编辑"
      width={800}
      onOk={(e, form, show, getValues)=>{
        getValues().then(values=>{
          console.log(values)
        })
        // console.log(form)
      }}
      form={{

        // data: form=>{
        //   return [
        //     {
        //       label: 'xxx',
        //       cType: Input,
        //     }
        //   ]
        // }

        data: form=>{

          // return [{
          //   label: 'xx',
          //   cType: Input,

          //   config:{
          //     initialValue: '-'
          //   }
          // }]
          return editFields.map(field=>{
            // console.log(record, field)
            return {
              label: field.label,
              // cType: 'span',
              cType: antd[field.cType]||field.cType,
              key: field.key,
              config: {
                initialValue: record[field.key]
              },
              // render:()=>{
              //   return record[field.key]
              // }
            }
          })
        }


      }}
    />
    </PageHeaderWrapper>)
}