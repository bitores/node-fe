import React, { useMemo } from 'react'
import { DragPreviewImage, useDrag, DragSourceMonitor } from 'react-dnd'
import { Col } from 'antd'
// import { Colors } from './Colors'

export const SourceBox = ({ type, text, previewImg }) => {
  const [{ isDragging }, drag, preview] = useDrag({
    item: { 
      type: `${type}` 
    },
    canDrag: true,
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const containerStyle = useMemo(
    () => ({
      // border: '1px dashed gray',
      // padding: '0.5rem',
      // margin: '0.5rem',
      // backgroundColor,
      opacity: isDragging ? 0.4 : 1,
      cursor:  'move',
    }),
    [isDragging],
  )

  return (
    <>
    {previewImg&&<DragPreviewImage connect={preview} src={previewImg} />}
    <Col  ref={drag}  span={8} className="k-col" style={containerStyle}>
      <span className="k-icon">C</span>
      <span>{text}</span>
    </Col>
    </>
  )
}
