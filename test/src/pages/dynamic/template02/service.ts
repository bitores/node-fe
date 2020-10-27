import request from '@/utils/request';


export async function queryPageConfig(pageId){


  return {
    status: true,
    entry:{
      action: '/article/list',
      data:[
        {
          cType: 'hidden',
          key: 'id',
          bindParam:"pageId",
        },
        {
          label: '标签一',
          cType: "Input",
          key: 'ff',
          placeholder: '请输入',
        },
        {
          label: '类型',
          cType: 'Select',
          key:'type',
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
          cType: 'grid',
          offset: true,
          gutter: 8,
          children: [
            {
              // c: '搜索 ',
              cType: 'Button',
              type: 'primary',
              bindSubmit:  true,
              child: '提交',
              redirect: '/',
              action: '/post/data' // 数据提交的url
            },
            {
              cType: 'Button',
              // type: 
              bindReset: true,
              danger: true,
              child: '重置'
            }
          ]
        }
        
      ],
     
      
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