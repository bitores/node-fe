import React from  'react';
import Vditor from 'vditor';
import "vditor/dist/index.css";

export default class  extends React.Component {
  // value: string = '';
  constructor(props){
    super(props)
    console.log(props)

    this.state =  {
        text: ''
    }
  }

  componentDidMount()  {
      this.editor = new Vditor('editor', {
          ...this.props,
        //   _lutePath:  './lute.min.js',
        // cdn:  'https://cdn.jsdelivr.net/npm/vditor',
          after: () => {
              if (this.props.onInit) this.props.onInit(this.editor.getValue());
              if (this.props.disabled) this.editor.disabled();
          },
          input: (text, html) => {
              console.log(text)
              this.setState({text: text}, () => {
                  if (this.props.onChange) this.props.onChange(text, html ?? this.editor.getHTML());
              });
          },
          // input: this.props.onChange,
          select: () => {
              if (this.props.onSelect) this.props.onSelect(this.editor.getSelection(), this.editor.getValue());
          },
          theme: this.props.darkMode ? 'dark' : 'classic',
          placeholder: this.props.placeholder ?? ''
      });
  }

  shouldComponentUpdate (props)  {
      if(this.editor) {
        if (props.darkMode != this.props.darkMode) {
            this.editor.setTheme(props.darkMode ? 'dark' : 'classic');
        }
        if (props.disabled != this.props.disabled) {
            props.disabled ? this.editor.disabled() : this.editor.enable();
        }
        if (props.value != this.props.value && props.value != this.state.text) {//
            this.editor.setValue(props.value);
        }
      }
      
      return false;
  }

  render() {
    return <div id="editor" />
  }

}
