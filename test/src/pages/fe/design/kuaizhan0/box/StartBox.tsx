import React from 'react';
import { Input } from 'antd'


export default ({data={}, type, effect, style={}, children})=>{



  function dragstart(e) {

    var img = document.createElement("img");
    img.src = effect;
    e.dataTransfer.setDragImage(img, 0, 0);
    e.dataTransfer.setData('data', data);
    e.dataTransfer.setData('type', type);
  }

  return (<div draggable onDragStart={dragstart} style={style}>
    {children}
  </div>)
}