import React from 'react';


export default ({style={}, config={}, children})=>{

  function ondragover(e){
    e = e || event;
    if(e.preventDefault){
        e.preventDefault();
    }else{
        e.returnValue = false;
    }
    
    return false;
  }

  function ondrop(e) {

    
    const type = e.dataTransfer.getData('type');

    const render = config[type];
    render&&render()
    // console.log(data, e.dataTransfer.items[0])
  }

  return (<div onDragOver={ondragover} onDrop={ondrop} style={style}>
    {children}
  </div>)
}