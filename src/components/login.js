import React from 'react';
import { auth } from 'firebase/app';

import { importAuth } from '../firebase';
import { FrameElement, FirebaseUIContainer } from '../constants';
import { generateLoginConfig, noop } from '../util';

class LoginPanel extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      signedIn: false
    };
    this.login = React.createRef();
    this.uiWidget = null;
    this.unregisterAuthObserver = noop;
  }

  componentDidMount () {
    const firebaseui = require('firebaseui');
    importAuth().then(() => {
      this.uiWidget = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(this.props.getAuth());
      this.uiWidget.reset();
      this.unregisterAuthObserver = this.props.getAuth().onAuthStateChanged((user) => {
        if (!user && this.state.signedIn) {
          this.uiWidget.reset();
          /*this.renderWidget(generateLoginConfig([
            auth.GoogleAuthProvider.PROVIDER_ID,
            auth.EmailAuthProvider.PROVIDER_ID
          ]));*/
        }

        this.setState({ signedIn: !!user });
        this.props.updateAuthState(user ? Object.assign({}, {
          uid: user.uid,
          name: user.displayName,
          avatar: user.photoURL,
          email: user.email,
          verified: user.emailVerified
        }) : user);
      });
      
      // this.props.fb.auth().disableAutoSignIn();
      this.renderWidget(generateLoginConfig([
        auth.GoogleAuthProvider.PROVIDER_ID,
        auth.TwitterAuthProvider.PROVIDER_ID,
        auth.EmailAuthProvider.PROVIDER_ID
      ]));
    }).catch((err) => console.error(err));
  }

  componentWillUnmount () {
    this.unregisterAuthObserver();
  }
  
  renderWidget (loginConfig) {
    if (!this.login.current) {
      return;
    }

    this.uiWidget.start(this.login.current, loginConfig);
  }
  
  // this.props.getAuth().signOut()
  render () {
    if (this.state.signedIn) {
      return null;
    }

    // TODO: requires firebase ui container to exist in both instances 
    return (<div ref={this.login} id={FirebaseUIContainer}></div>);
  }
}

export default LoginPanel;
