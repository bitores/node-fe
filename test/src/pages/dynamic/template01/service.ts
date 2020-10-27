import request from '@/utils/request';


export async function queryPageConfig(pageId){


  return {
    status: true,
    entry:{
      action: '/article/list',
      searchData:[
        {
          label: '标签一',
          cType: "Input",
          placeholder: '请输入',
        },
        {
          label: '类型',
          cType: 'Select',
          key:'type',
          formItem:{
            style:{
              width: 100
            }
          },
          options:[
            {
              label: '全部',
              value: ''
            },
            {
              label: '一',
              value: 1,
            },
            {
              label: '二',
              value: 2,
            },
          ],
          config:{
            initialValue: ''
          }
        },
        {
          // c: '搜索 ',
          cType: 'Button',
          type: 'primary',
          bindSearch:  true,
          child: '搜索'
        },
        {
          cType: 'Button',
          // type: 
          bindReset: true,
          child: '重置'
        }
      ],
      columns:{
        data: [
          {
            title: '标题',
            dataIndex: 'title',
            key: 'title',
            ellipsis: true,
            // render:(绝不能用
          },
          {
            title: '简要',
            dataIndex: 'brief',
            key: 'brief',
            ellipsis: true,
            // render:(绝不能用
          },
          {
            title: '简要',
            dataIndex: 'tags',
            key: 'tags',
            ellipsis: true,
            // render:(绝不能用
          },
          
        ],
        actions:[
          {
            title: '详情',
            isDetail: true, // 是否绑定弹框

            filters:[
             {
               label: 'ID',
               key: 'id'
             },
             {
               label: '标题',
               key: 'title'
             },
             {
               label: '简介',
               key: 'brief'
             }
            ]
          },
          {
            title: '编辑',
            isEdit:true,
            // isbind: true, // 是否与结果集字段关联,字段不一定显示在列
            // field: 'status',
            // value: 1, // 已禁用
            filters:[
              {
                label: 'ID',
                cType: 'hidden',
                key: 'id'
              },
              {
                label: '标题',
                key: 'title',
                cType: 'Input'
              },{
                label: '简介',
                key: 'brief',
                cType: 'Input'
              },{
                label: '关键词',
                key: 'keyword',
                cType: 'Input'
              },
            ]
          },
          {
            // 与状态相关
            isbind: true, // 是否与结果集字段关联,字段不一定显示在列
            field: 'status',
            value: 1, // 已禁用
            title: '启用',
            isConfirm: true,
            confirmText: '启用后，用户将有更多操作权限'
          },
          {
            // 与状态相关
            isbind: true, // 是否与结果集字段关联,字段不一定显示在列
            field: 'status',
            value: 2, // 已启用
            title: '禁用',
          },
          {
            title: '删除',
            isConfirm: true,// 是否确认
            // action:
            config: {
              style: {
                color: 'red'
              }
            }
          }
        ]
      },
      
    }
  }
}

export async function  getData(url, params){
  console.log(url, params)
  return request(url, {params})
}

export async function postData(url, params) {
  
  return request(url, {
    method: "POST",
    data:params,
  });

}