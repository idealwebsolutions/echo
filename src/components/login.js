import { Component, Fragment } from 'inferno';
import { auth } from 'firebase/app';

import { importApp, importAuth } from './firebase';

import { LoginUIConfig } from '../constants';

class LoginScreen extends Component {
  constructor (props) {
    super(props);
    this.state = {
      ready: false
    };
  }

  componentDidMount () {
    this.setState({ ready: false });
    //
    const firebaseui = require('firebaseui');
    let uiWidget = null;
    
    const targetFrame = document.querySelector('#echo-content');
    // Should find a better way to get ref
    const container = targetFrame.contentDocument.body.querySelector('#firebaseui_container');

    importApp().then((app) => {
      importAuth().then(() => {
        const fb = app.initializeApp(this.props.config.firebase);
        uiWidget = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(fb.auth());
        uiWidget.reset();
        uiWidget.start(container, LoginUIConfig([
          auth.GoogleAuthProvider.PROVIDER_ID,
          auth.EmailAuthProvider.PROVIDER_ID
        ]));
        this.setState({ ready: true });
      });
    });
  }

  componentWillUnmount () {
  }

  render () {
    return <div id="firebaseui_container"></div>
  }
}

export default LoginScreen;
