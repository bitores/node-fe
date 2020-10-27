import { Component } from 'react';
import {Toolbar, Editor} from './src';


export default class extends Component {
  render() {
    return (
      <div style={{
        height: 'calc(100vh - 150px)'
      }}>
        <Editor />
      </div>
    );
  }
}