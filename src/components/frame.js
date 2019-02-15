import React from 'react';
import NoSsr from '@material-ui/core/NoSsr';
import { create } from 'jss';
import {
  MuiThemeProvider,
  withStyles,
  jssPreset,
  createGenerateClassName
} from '@material-ui/core/styles';
import JssProvider from 'react-jss/lib/JssProvider';
import global from 'jss-global';
import Frame, { FrameContextConsumer } from 'react-frame-component';
import { iframeResizer } from 'iframe-resizer';

import lightTheme from '../themes/light';

const globalStyles = {
  '@global': {
    '@import': [
      'url("https://fonts.googleapis.com/css?family=Roboto:300,400,500")',
      'url("https://fonts.googleapis.com/icon?family=Material+Icons")',
      'url("https://cdn.firebase.com/libs/firebaseui/3.4.1/firebaseui.css")'
    ],
    '*': {
      boxSizing: 'border-box'
    },
    'ul': {
      listStyleType: 'none',
      padding: 0
    },
    'body': {
      fontFamily: '"Roboto", sans-serif',
      backgroundColor: 'transparent !important'
    },
    '.block': {
      display: 'flex'
    }
  },
};

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    height: 400,
    border: 'none',
    boxShadow: theme.shadows[1],
  },
});

const generateClassName = createGenerateClassName();

class ResizableFrame extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      initialized: false
    };
    this.frame = React.createRef();
  }
  
  componentWillReceiveProps (nextProps) {
    if (nextProps.src || !(nextProps.content || nextProps.children)) {
      return;
    }
    
    this.resize();
  }

  componentDidMount () {
    this.resize();
  }

  componentWillUnmount () {
    const iFrameResizer = this.frame.current.node.iFrameResizer;

    if (!iFrameResizer) {
      return;
    }

    iFrameResizer.removeListeners();
    iFrameResizer.close();
  }

  resize () {
    if (!this.frame.current) {
      return;
    }

    const node = this.frame.current.node;
    // Inject content window immediately 
    this.injectContentWindow(node);
    
    const iFrameResizer = node.iFrameResizer;

    if (iFrameResizer) {
      iFrameResizer.resize();
    } else {
      iframeResizer({
        log: true,
        checkOrigin: false
      }, node);
    }
  }

  injectContentWindow (element) {
    if (this.state.initialized) {
      return;
    }

    const doc = element.contentDocument;

    if (!doc) {
      console.error('Unable to find contentDocument.');
      return;
    }

    console.log('Attempting to inject content window');

    const body = doc.getElementsByTagName('body')[0];
    const resizerScript = document.createElement('script');
    
    resizerScript.type = 'text/javascript';
    resizerScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/3.5.8/iframeResizer.contentWindow.min.js';
    resizerScript.defer = true;
    resizerScript.onerror = (err) => console.error(err);
    
    body.appendChild(resizerScript);
    this.setState({
      initialized: true
    });
  }

  render () {
    const { children } = this.props;
    
    return (
      <NoSsr>
        <Frame 
          id={this.props.id}
          ref={this.frame}
          style={this.props.style}>
          <FrameContextConsumer>
            { ({ document }) => {
              const jss = create({
                ...jssPreset(),
                insertionPoint: document.body
              });

              jss.use(global());
            
              document.head.innerHTML = '<style>' + jss.createStyleSheet(globalStyles) + '</style>';
              
              return (
                <JssProvider jss={jss} generateClassName={generateClassName}>
                  <MuiThemeProvider theme={lightTheme} sheetsManager={new Map()}>
                    { children }
                  </MuiThemeProvider>
                </JssProvider>
              )
            }}
          </FrameContextConsumer>
        </Frame>
      </NoSsr>
    )
  }
}

export default withStyles(styles, { withTheme: true })(ResizableFrame);
