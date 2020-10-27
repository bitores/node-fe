import { Button, Result } from 'antd';
import React from 'react';
import GGEditor, { Mind } from 'gg-editor';


const data = {
  label: 'Central Topic',
  children: [
    {
      label: 'Main Topic 1',
    },
    {
      label: 'Main Topic 2',
    },
    {
      label: 'Main Topic 3',
    },
  ],
};

const NoFoundPage = () => {

  return (<GGEditor>
  <Mind  style={{ width: '100vw', height: '100vh' }} data={data} />
</GGEditor>)
}

export default NoFoundPage;
