import React from 'react';
import { create } from 'jss';
import {
  MuiThemeProvider,
  withStyles,
  jssPreset,
  createGenerateClassName,
  createMuiTheme
} from '@material-ui/core/styles';
import JssProvider from 'react-jss/lib/JssProvider';
import global from 'jss-global';
import blue from '@material-ui/core/colors/blue';
import Frame, { FrameContextConsumer } from 'react-frame-component';
import { iframeResizer } from 'iframe-resizer';

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
    ul: {
      listStyleType: 'none',
      padding: 0
    },
    body: {
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
    // backgroundColor: theme.palette.background.default,
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
      ready: false
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
    const node = this.frame.current.node;

    if (!this.state.ready || !node) {
      return;
    }

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

  // TODO: This should only be done once
  injectContentWindow (element) {
    if (this.state.ready) {
      return;
    }

    if (!element.target) {
      console.error('Unable to find frame reference');
      return;
    }

    console.log('Injecting content window');

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
    
    this.setState({ ready: true });
  }
  
  render () {
    const { children } = this.props;
    
    const theme = createMuiTheme({
      palette: {
        primary: blue
      },
      typography: {
        useNextVariants: true
      }
    });
    
    return (
      <Frame 
        id={this.props.id}
        ref={this.frame}
        style={this.props.style}
        onLoad={this.injectContentWindow.bind(this)}
      >
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
                <MuiThemeProvider theme={theme} sheetsManager={new Map()}>
                  { children }
                </MuiThemeProvider>
              </JssProvider>
            )
          }}
        </FrameContextConsumer>
      </Frame>
    )
  }
}

export default withStyles(styles, { withTheme: true })(ResizableFrame);
