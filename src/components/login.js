import React from 'react';
import { auth } from 'firebase/app';

import { importAuth } from '../firebase';

import { FirebaseUIContainer } from '../constants';
import { generateLoginConfig, Noop } from '../util';

class LoginScreen extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      signedIn: false
    };
    this.uiWidget = null;
    this.unregisterAuthObserver = Noop;
  }

  componentDidMount () {
    const firebaseui = require('firebaseui');
    //
    importAuth().then(() => {
      this.uiWidget = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(this.props.fb.auth());
      this.uiWidget.reset();
      this.unregisterAuthObserver = this.props.fb.auth().onAuthStateChanged((user) => {
        if (!user && this.state.signedIn) {
          this.uiWidget.reset();
          this.renderWidget(generateLoginConfig([
            auth.GoogleAuthProvider.PROVIDER_ID,
            auth.EmailAuthProvider.PROVIDER_ID
          ]));
        }

        this.setState({ signedIn: !!user });
      });
      
      // this.uiWidget.disableAutoSignIn();
      this.renderWidget(generateLoginConfig([
        auth.GoogleAuthProvider.PROVIDER_ID,
        auth.EmailAuthProvider.PROVIDER_ID
      ]));
    });
  }

  componentWillUnmount () {
    this.unregisterAuthObserver();
  }

  renderWidget (loginConfig) {
    const targetFrame = document.querySelector('#echo-content');
    const container = targetFrame.contentDocument.body.querySelector(`#${FirebaseUIContainer}`);
    this.uiWidget.start(container, loginConfig);
  }

  render () {
    console.log(`is signed in: ${this.state.signedIn}`);
    if (this.state.signedIn) {
      return (
        <div id={FirebaseUIContainer}>
          <div>Signed in as {this.props.fb.auth().currentUser.displayName}</div>
          <button id="sign-out" onClick={() => this.props.fb.auth().signOut()}>Sign out</button>
        </div>
      )
    }
    
    return <div id={FirebaseUIContainer}></div>
  }
}

export default LoginScreen;
