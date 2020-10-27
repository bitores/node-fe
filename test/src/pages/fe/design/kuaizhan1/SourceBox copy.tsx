import React, { useMemo } from 'react'
import { useDrag, DragSourceMonitor } from 'react-dnd'
import { Colors } from './Colors'

export const SourceBox = ({ color, children }) => {
  const [{ isDragging }, drag] = useDrag({
    item: { 
      type: `${color}` 
    },
    canDrag: true,
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const backgroundColor = useMemo(() => {
    switch (color) {
      case Colors.YELLOW:
        return 'lightgoldenrodyellow'
      case Colors.BLUE:
        return 'lightblue'
      default:
        return 'lightgoldenrodyellow'
    }
  }, [color])

  const containerStyle = useMemo(
    () => ({
      border: '1px dashed gray',
      padding: '0.5rem',
      margin: '0.5rem',
      backgroundColor,
      opacity: isDragging ? 0.4 : 1,
      cursor:  'move',
    }),
    [isDragging, backgroundColor],
  )

  return (
    <div ref={drag} style={containerStyle}>
      <small>Forbid drag</small>
      {children}
    </div>
  )
}
