import React, { useState, useCallback } from 'react'
import { useDrop } from 'react-dnd'
import { Colors } from './Colors'
const antds = require('antd');
import "antd/dist/antd.css";
import * as all from './components/index';

const TargetBox = ({ onDrop, lastDroppedColor }) => {
  const [config, setConfig] = useState([]);
  const [{ isOver, draggingColor, canDrop }, drop] = useDrop({
    accept: ["JS","HTML","Input","DatePicker","TimePicker","Checkbox","Radio","Switch","Select","Rate","Button"],//filter item.type
    drop(item) {
      setConfig([
        ...config,
        item.type
      ]);
      onDrop(item.type)
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
      draggingColor: monitor.getItemType() as string,
    }),
  })



  return (<div  ref={drop}>
            <p>-首页</p>
            <div className="k-content-page">
              {/* {!canDrop && lastDroppedColor && <p>Last dropped: {lastDroppedColor}</p>} */}
               {
                 config.map((item,index)=>{
                   const AntdComponent = antds[item]||all[item];
                   return (<AntdComponent key={`${index}_${item}`} />)
                 })
               }
            </div>
          </div>)
}


export const StatefulTargetBox: React.FC = (props) => {
  const [lastDroppedColor, setLastDroppedColor] = useState<string | null>(null)
  const handleDrop = useCallback(
    (color: string) => setLastDroppedColor(color),
    [],
  )

  return (
    <TargetBox
      {...props}
      lastDroppedColor={lastDroppedColor as string}
      onDrop={handleDrop}
    />
  )
}
