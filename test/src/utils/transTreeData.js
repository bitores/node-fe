


export default function transTreeData(data) {
  const config = {
    id: 'id',
    parendId: 'parent_id',
    rootId: 0
  };

  const tree = [];
  const resData = data;
  for (let i = 0; i < resData.length; i++) {
    if (resData[i][config.parendId] === config.rootId) {
      const obj = {
        ...resData[i],
        // children: []
      };
      tree.push(obj);
      resData.splice(i, 1);
      i--;
    }
  }
  const run = function(treeArrs) {
    if (resData.length > 0) {
      for (let i = 0; i < treeArrs.length; i++) {
        const parent = treeArrs[i];
        for (let j = 0; j < resData.length; j++) {
          const child = resData[j];
          if (parent[config.id] === child[config.parendId]) {
            const obj = {
              ...child,
              // children: []
            };
            parent.children = parent.children||[];
            parent.children.push(obj);
            resData.splice(j, 1);
            j--;
          }
        }
        run(treeArrs[i].children||[]);
      }
    }
  };
  run(tree);
  return tree;
}