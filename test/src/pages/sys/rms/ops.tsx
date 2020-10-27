import { Button, Input, Space } from 'antd';
import React, { useRef, useState } from 'react';
import SF, {Modal} from 'react-antd-super-form';


export default ()=>{
  const [isEdit, setEdit] = useState(false);
  const [record, setRecord] = useState({});
  const handleModal = useRef();

  return (<>
      <SF 
        search={{
          layout: 'inline',
          data:(form)=>[
            {
              label: '类型名',
              cType: Input,
              placeholder: '请输入关键字',
              key: 'name'
            },
            {
              cType: Button,
              child: '查询',
              bindSearch: true,
              type: 'primary' 
            },
            {
              cType: 'br'
            },
            {
              cType: Button,
              child: '添加新类型',
              type: 'primary',
              onClick:()=>{
                setEdit(false)
                setRecord({})
                handleModal.current.show();
              }
            },
          ]
        }}
        table={{
          isInit: true,
          action: ()=>new Promise((res,rej)=>{
            res({
              status: true,
              entry:[
                { name: '新增', key: 'add'},
                { name: '删除', key: 'del'},
                { name: '批量删除', key: 'batchDel'},
                { name: '修改', key: 'update'},
                { name: '批量修改', key: 'batchUpdate'},
                { name: '查看', key: 'get'},
                { name: '查看列表', key:'batchGet'},
                { name: '上传', key: 'upload'},
                { name: '下载', key: 'download'},
              ]
            })
          }),
          columns:[
            {
              title:'类型名称',
              dataIndex: 'name',
              key: 'name'
            },
            {
              title:'web识别key',
              dataIndex: 'key',
              key: 'key'
            },
            {
              title:'创建时间',
              dataIndex: 'create-at',
              key: 'create-at'
            },
            {
              title:'操作',
              dataIndex: 'op',
              key: 'op',
              render:(val,record)=>{
                return <Space>
                  <a onClick={()=>{
                    setEdit(true)
                    setRecord(record)
                    handleModal.current.show()
                  }}>编辑</a>
                </Space>
              }
            },
          ]
        }}
      />
      <Modal 
        ref={handleModal}
        title={`${isEdit?'编辑':'添加'}操作类型`}
        destroyOnClose
        form={{
          // layout: 
          data:(form)=>[
            {
              label: '类型名',
              cType: Input,
              placeholder: '请输入',
              key: 'name',
              config:{
                initialValue: record.name,
                rules:[
                  {
                    required: true,
                    message: ''
                  }
                ]
              }
            },
            {
              label: 'web识别key',
              cType: Input,
              placeholder: '请输入',
              extra: 'web页面操作权限，请确认后填写',
              key: 'key',
              config:{
                initialValue: record.key,
                rules:[
                  {
                    required: true,
                    message: ''
                  }
                ]
              }
            },
          ]
        }}
      />
    </>)
}