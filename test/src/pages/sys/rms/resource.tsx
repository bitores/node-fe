import { Button, Checkbox, Input, Radio, Space } from 'antd';
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
              child: '添加新资源',
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
                // { name: '新增', key: 'add'},
                // { name: '删除', key: 'del'},
                // { name: '批量删除', key: 'batchDel'},
                // { name: '修改', key: 'update'},
                // { name: '批量修改', key: 'batchUpdate'},
                // { name: '查看', key: 'get'},
                // { name: '查看列表', key:'batchGet'},
                // { name: '上传', key: 'upload'},
                // { name: '下载', key: 'download'},
                {name: '一级菜单', nodeType: '2', webType: '1', 
                  children: [
                    {name: '二级菜单', nodeType: '2', webType: '1', },
                    {name: '二级菜单', nodeType: '2', webType: '1', 
                      children: [
                        {name: '查看列表', nodeType: '2', webType: '2', },
                        {name: '添加', nodeType: '2', webType: '2', },
                        {name: '编辑', nodeType: '2', webType: '2', },
                        {name: '删除', nodeType: '2', webType: '2', },
                      ]
                    },
                    {name: '二级菜单', nodeType: '2', webType: '1', children: [
                      {name: '查看列表', nodeType: '2', webType: '2', },
                      {name: '添加', nodeType: '2', webType: '2', },
                      {name: '编辑', nodeType: '2', webType: '2', },
                      {name: '删除', nodeType: '2', webType: '2', },
                    ]},
                    {name: '二级菜单', nodeType: '2', webType: '1', children: [
                      {name: '查看列表', nodeType: '2', webType: '2', },
                      {name: '添加', nodeType: '2', webType: '2', },
                      {name: '编辑', nodeType: '2', webType: '2', },
                      {name: '删除', nodeType: '2', webType: '2', },
                    ]},
                  ]
                },
                {name: '一级菜单', nodeType: '2', webType: '1', 
                  children: [
                    {name: '查看列表', nodeType: '2', webType: '2', },
                    {name: '添加', nodeType: '2', webType: '2', },
                    {name: '编辑', nodeType: '2', webType: '2', },
                    {name: '删除', nodeType: '2', webType: '2', },
                  ]
                },
              ]
            })
          }),
          columns:[
            {
              title:'资源名称',
              dataIndex: 'name',
              key: 'name'
            },
            {
              title:'节点类别',
              dataIndex: 'nodeType',
              key: 'nodeType'
            },
            {
              title:'web类型',
              dataIndex: 'webType',
              key: 'webType',
              render(val, record){
                return val==='1'?'菜单':'内容'
              }
            },
            {
              title:'web地址url',
              dataIndex: 'webUrl',
              key: 'webUrl'
            },
            {
              title:'备注',
              dataIndex: 'remark',
              key: 'remark'
            },
            {
              title:'创建时间',
              dataIndex: 'createAt',
              key: 'createAt'
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
        title={`${isEdit?'编辑':'添加'}资源`}
        destroyOnClose
        form={{
          // layout: 
          data:(form)=>[
            {
              label: '资源名称',
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
              label: '节点类别',
              cType: Radio.Group,
              key: 'nodeType',
              options:[
                {
                  label: '外链项目',
                  value: '1'
                },
                {
                  label: '项目根',
                  value: '2'
                },
                {
                  label: '资源根',
                  value: '3'
                },
                {
                  label: '资源叶子',
                  value: '4'
                },
              ],
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
            {
              label: 'web类别',
              cType: Radio.Group,
              options:[
                {
                  label: '菜单级',
                  value: '1'
                },
                {
                  label: '内容级',
                  value: '2'
                },
                
              ],
              key: 'webType',
              config:{
                initialValue: record.webkey,
                rules:[
                  {
                    required: true,
                    message: ''
                  }
                ]
              }
            },
            {
              label: 'web地址url',
              cType: Input,
              key: 'webUrl',
              config:{
                initialValue: record.webUrl,
                rules:[
                  {
                    required: true,
                    message: ''
                  }
                ]
              }
            },
            {
              label: '资源描述',
              cType: Input.TextArea,
              key: 'remark',
              config:{
                initialValue: record.remark,
              }
            },
            {
              label: '操作类型',
              cType: Checkbox.Group,
              options:[
                {
                  label: '新增',
                  value: '1'
                },
                {
                  label: '删除',
                  value: '2'
                },
                {
                  label: '批量删除',
                  value: '3'
                },
              ],
              key: 'ops',
              config:{
                initialValue: record.webkey,
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