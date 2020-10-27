
//遍历每个节点
export function mapTree(treeData= [], callback = ()=>{}, childrenName='children') {

  function runTree(arr){

    for (let ind = 0, len = arr.length; ind < len; ind++) {
      const item = arr[ind];
      
      callback(item)

      runTree(item[childrenName]||[])
    }
  }


  return runTree(treeData)
}


// 把树形结构扁平化
export function flatTree(treeData= [], callback = ()=>{}, childrenName='children') {// treeData 为数组
  function runTree(arr, parent=null){
    const ret = [];
    for (let ind = 0, len = arr.length; ind < len; ind++) {
      const item = arr[ind];
      
      if(parent!==null) {
        
        callback(item, parent);
      }
      // 
      ret.push(item);
      ret.push(...runTree(item[childrenName]||[], item))
      // delete item[childrenName]
      
    }

    return ret;
  }


  return runTree(treeData)
}

// 把扁平化的数据造成树
export function buildTree(flatData= [], config={
  id: 'id',
  parendId: 'parent_id',
  rootId: 0,// 0 false  undefined null
}){

  const obj = {};
  for (let ind = 0, len = flatData.length; ind < len; ind++) {
    const item = flatData[ind];
    obj[item[config.id]] = item;
  }
  // 完成列举

  for (let ind = 0, len = flatData.length; ind < len; ind++) {
    const item = flatData[ind];
    const pId = item[config.parendId];
    if(pId!==config.rootId && obj[pId]) { //
      obj[pId].children=obj[pId].children||[];
      obj[pId].children.push(item);
    }
  }

  for (let ind = 0, len = flatData.length; ind < len; ind++) {
    const item = flatData[ind];
    const pId = item[config.parendId];
    if(pId!==config.rootId){
      delete obj[item[config.id]]
    }
  }

  return Object.values(obj);
}

// 标准化树型结构
export function reMapTree(treeData= [], callback=()=>{}, childrenName='children', nChildrenName='children'){
  
  function runTree(arr){
    const ret = [];
    for (let ind = 0, len = arr.length; ind < len; ind++) {
      const item = arr[ind];
      const children = item[childrenName]||[];
      const nItem = callback(item)
      ret.push(nItem)
      if(children.length>0) {
        nItem[nChildrenName]=runTree(children);
      }
    }

    return ret;
  }

  const data = [...treeData]
  return runTree(data);
}

// 找某个符合条件的节点
export function findOneInTree(treeData= [], callback=()=>{}, childrenName='children') {
  let ret  = null;
  function runTree(arr) {

    for (let ind = 0, len = arr.length; ind < len; ind++) {
      const item = arr[ind];
      if(ret!==null) return true;
      if(callback(item)){
        ret = item;
        return true;
      } else {
        if(runTree(item[childrenName]||[])) {
          return true;
        }
        
      }
    }
  }

  runTree(treeData)
  return ret;
}


// 找某些符合条件的节点
export function findSomeInTree(treeData= [], callback=()=>{}, childrenName='children') {

  function runTree(arr){
    const ret = [];
    for (let ind = 0, len = arr.length; ind < len; ind++) {
      const item = arr[ind];
      
      if(callback(item)){
        ret.push(item)
      }

      ret.push(...runTree(item[childrenName]||[]))
    }

    return ret;
  }


  return runTree(treeData)
}

// 查找某个节点及其所有子节点
export function findChildrenInTree(treeData= [], callback=()=>{}, childrenName='children'){

  const node = findOneInTree(treeData, callback, childrenName)
  if(node) {
    return flatTree([node], ()=>{}, childrenName)
  }

  return [];
}

// 查找某个节点及其所有直系父节点
export function findParentInTree(treeData= [], callback=()=>{}, childrenName='children'){
  const ret  = [];
  function runTree(arr) {

    for (let ind = 0, len = arr.length; ind < len; ind++) {
      const item = arr[ind];
      if(callback(item)){
        ret.push(item)
        return true;
      } else {
        if(runTree(item[childrenName]||[])) {
          ret.push(item)
          return true;
        }
        
      }
    }
  }

  runTree(treeData)
  return ret;
}

