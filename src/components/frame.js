import React from 'react';

import Frame from 'react-frame-component';
import { iframeResizer } from 'iframe-resizer';

class ResizableFrame extends React.Component {
  /*componentDidMount () {
    this.resize();
  }*/
  
  componentWillReceiveProps (nextProps) {
    this.resize();
  }

  componentWillUnmount () {
    const iFrameResizer = this.refs.frame.iFrameResizer;
    
    if (!iFrameResizer) {
      return;
    }

    iFrameResizer.removeListeners();
  }

  resize () {
    if (!this.refs.frame) {
      return;
    }

    iframeResizer({
      log: true,
      checkOrigin: false
    }, this.refs.frame);
  }

  injectContentWindow (element) {
    if (!element.target) {
      console.error('Unable to find frame ref');
      return;
    }

    const doc = element.target.contentDocument;
    
    if (!doc) {
      console.error('Unable to find contentDocument');
      return;
    }
    
    const body = doc.getElementsByTagName('body')[0];
    const resizerScript = document.createElement('script');
    resizerScript.type = 'text/javascript';
    resizerScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/3.5.8/iframeResizer.contentWindow.min.js';
    body.appendChild(resizerScript);
    this.resize.bind(this);
  }
  
  render () {
    return (
      <Frame ref='frame' id={this.props.id} style={this.props.style} onLoad={this.injectContentWindow.bind(this)}>
        {this.props.children}
      </Frame>
    )
  }
}

export default ResizableFrame;