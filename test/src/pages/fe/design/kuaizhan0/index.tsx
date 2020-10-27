import React, { useState } from 'react';
import { Input } from 'antd'
import Box from './box/StartBox';
import Container from './box/Container';
import {Form} from 'react-antd-super-form'

export default ()=>{
  const [children, setChildren] = useState([])



  return (<div>
    <Box
      style={{
        display: 'inline-block',
        border: '1px solid black',
        fontSize: 14,
        padding: '4px 12px'
      }}
      data={JSON.stringify({
        a: 1,
        b: 2,
        c: 3
      })}
      type="Input"
      effect={'http://kryogenix.org/images/hackergotchi-simpler.png'}
      
    >
      文本
    </Box>

    <Container 
      style={{
        display: 'flex',
        width: '100%',
        minHeight: 200,
        border: '1px solid black',
      }}
      config={{
        Input: function(){
          console.log('Input')
          setChildren([...children, {
            label: 'label',
            cType: "Input",
          }])
        },
      }}
    >
      <Form 
        data={form=>[
          
          ...children.map(item=>{
            return {
              ...item,
              cType: Input,
              renderFix:(CurnComponent)=>{
                return <div>
                  {CurnComponent}
                  <div></div>
                </div> 
              }
            }
          })
        ]}
      />
    </Container>
  </div>)
}