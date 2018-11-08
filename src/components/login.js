import { Component, Fragment } from 'inferno';
import { auth } from 'firebase/app';

import { importAuth } from '../firebase';

import { generateLoginConfig, Noop } from '../util';

class LoginScreen extends Component {
  constructor (props) {
    super(props);
    this.state = {
      ready: false,
      signedIn: false
    };
    this.unregisterAuthObserver = Noop;
  }

  componentDidMount () {
    this.setState({ ready: false });
    //
    const firebaseui = require('firebaseui');
    let uiWidget = null;
    
    const targetFrame = document.querySelector('#echo-content');
    // Should find a better way to get ref
    const container = targetFrame.contentDocument.body.querySelector('#firebaseui_container');

    importAuth().then(() => {
      uiWidget = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(this.props.fb.auth());
      uiWidget.reset();
      this.unregisterAuthObserver = this.props.fb.auth().onAuthStateChanged((user) => {
        if (!user && this.state.signedIn) {
          uiWidget.reset();
        }
        this.state.signedIn = !!user;
      });
      uiWidget.start(container, generateLoginConfig([
        auth.GoogleAuthProvider.PROVIDER_ID,
        auth.EmailAuthProvider.PROVIDER_ID
      ]));
      this.setState({ ready: true });
    });
  }

  componentWillUnmount () {
  
  }

  render () {
    return <div id="firebaseui_container"></div>
  }
}

export default LoginScreen;
