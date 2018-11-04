import { Component, linkEvent } from 'inferno';

import Frame from 'react-frame-component';

import { iframeResizer } from 'iframe-resizer';

class ResizableFrame extends Component {
  constructor(props) {
    super(props);
    this.frame = null;
  }
  
  componentWillReceiveProps (nextProps) {
    this.resize();
  }

  componentWillUnmount () {
    const iFrameResizer = this.frame.iFrameResizer;
    
    if (!iFrameResizer) {
      return;
    }

    iFrameResizer.removeListeners();
  }

  resize () {
    if (!this.frame) {
      return;
    }
    
    iframeResizer({
      log: true,
      checkOrigin: false
    }, this.frame);
  }

  _injectContentWindow (component, element) {
    component.frame = element.target;
    
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
    component.resize.bind(component);
  }
  
  render ({ children }) {
    const { id, style } = this.props;
    return (
      <Frame ref={this.element} id={id} style={style} onLoad={linkEvent(this, this._injectContentWindow)}>
        {children}
      </Frame>
    )
  }
}

export default ResizableFrame;
