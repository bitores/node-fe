import React, { useState, useCallback } from 'react'
import { useDrop } from 'react-dnd'
import { Colors } from './Colors'

const TargetBox = ({ onDrop, lastDroppedColor }) => {
  const [{ isOver, draggingColor, canDrop }, drop] = useDrop({
    accept: [Colors.YELLOW, Colors.BLUE],//filter item.type
    drop(item) {
      onDrop(item.type)
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
      draggingColor: monitor.getItemType() as string,
    }),
  })

  let backgroundColor = '#fff'
  switch (draggingColor) {
    case Colors.BLUE:
      backgroundColor = 'lightblue'
      break
    case Colors.YELLOW:
      backgroundColor = 'lightgoldenrodyellow'
      break
    default:
      break
  }


  return (
    <div ref={drop} style={{ 
      border: '1px solid gray',
      height: '15rem',
      width: '15rem',
      padding: '2rem',
      textAlign: 'center', 
      backgroundColor, 
      opacity: isOver ? 1 : 0.7
    }}>
      <p>Drop here.</p>

      {!canDrop && lastDroppedColor && <p>Last dropped: {lastDroppedColor}</p>}
    </div>
  )
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
