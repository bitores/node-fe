import React, { Component } from 'react';
// import 'kity';
// import 'kityminder-core';
import EditorContext from '../../common/context/EditorContext';
// import Toolbar from '../Toolbar';
import styles from './index.less';
import KMEditor from '../../script/editor'
// const KMEditor = require('../../script/editor');

export type Minder = ReturnType<typeof window.kityminder.Minder> | null;

interface IState {
  minder: Minder;
}

export default class Editor extends Component{
  state: IState = {
    minder: null,
  }

  render() {
    const { minder } = this.state;
    return (
      <div className={styles.container}>
        <EditorContext.Provider value={minder} >
          {/* <Toolbar /> */}
          <div id="J_ReactMindmap_Container" className={styles.editorWrapper}></div>
        </EditorContext.Provider>
      </div>
    )
  }

  componentDidMount() {
    console.log(window.kityminder)


    
    var el = document.getElementById("J_ReactMindmap_Container");
    var editor = window.editor = new KMEditor(el);


    // const minder = new window.kityminder.Minder({
    //   renderTo: `#J_ReactMindmap_Container`
    // });

    editor.minder.importJson({
      "root": { 
        'data': { 
          'id': 2,
          'text': 'Design project',
          'image': 'https://www.baidu.com/img/bd_logo1.png?where=super',
          'imageSize': { 'width': 200, 'height': 200 }
        },
        'children': [
            { 
                'data': { 'text': 'Designsy', 'priority': 1, 'id': 3 },
                'children': [
                    { 
                      'data': { 'text': 'Designsy', 'id': 4 },
                      'children': [
                        { 'data': { 'text': 'Designsy', 'id': 5 } },
                        { 'data': { 'text': 'Designsy', 'id': 5 } },
                        { 'data': { 'text': 'Designsy', 'id': 5 } },
                      ]
                    },
                    { 'data': { 'text': 'Designsy', 'id': 5 } },
                    { 'data': { 'text': 'Designsy', 'id': 62 } },
                    { 'data': { 'text': 'Designsy', 'id': 73 } },
                    { 'data': { 'text': 'Designsy', 'id': 84 } }
                ]
            },
            { 'data': { 'text': 'Designsy', 'priority': 2, 'id': 9 } },
            { 'data': { 'text': 'Designsy', 'priority': 3, 'id': 102 } },
            { 'data': { 'text': 'Designsy', 'priority': 4, 'id': 113 } },
            { 'data': { 'text': 'Designsy', 'priority': 5, 'id': 124 } }
        ]
      }
      
      
      // {
      //     "data": {
      //         "text": "百度产品",
      //         "image": "https://www.baidu.com/img/bd_logo1.png?where=super",
      //         "imageSize": { "width": 270, "height": 129 }
      //     },
      //     "children": [
      //         { "data": { "text": "新闻" } },
      //         { "data": { "text": "网页", "priority": 1 } },
      //         { "data": { "text": "贴吧", "priority": 2 } },
      //         { "data": { "text": "知道", "priority": 2 } },
      //         { "data": { "text": "音乐", "priority": 3 } },
      //         { "data": { "text": "图片", "priority": 3 } },
      //         { "data": { "text": "视频", "priority": 3 } },
      //         { "data": { "text": "地图", "priority": 3 } },
      //         { "data": { "text": "百科", "priority": 3 } },
      //         { "data": { "text": "更多", "hyperlink": "http://www.baidu.com/more" } }
      //     ]
      // }
    });
      
    // this.setState({
    //   minder,
    // });
  }
}