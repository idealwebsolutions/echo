import React from 'react';
import Button from '@material-ui/core/Button';
import { auth } from 'firebase/app';

// import { importAuth } from '../firebase';
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
      console.log('auth import')
      console.log(this.props.fb);
      this.uiWidget = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(this.props.fb.auth());
      this.uiWidget.reset();
      this.unregisterAuthObserver = this.props.fb.auth().onAuthStateChanged((user) => {
        if (!user && this.state.signedIn) {
          this.uiWidget.reset();
          /* This shouldn't need to happen, looking into a fix
          this.renderWidget(generateLoginConfig([
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
      
      console.log('called');  
      // this.props.fb.auth().disableAutoSignIn();
      this.renderWidget(generateLoginConfig([
        auth.GoogleAuthProvider.PROVIDER_ID,
        auth.EmailAuthProvider.PROVIDER_ID
      ]));
  }

  componentWillUnmount () {
    this.unregisterAuthObserver();
  }

  renderWidget (loginConfig) {
    const targetFrame = document.querySelector('#echo-content');
    console.log(targetFrame)
    const container = targetFrame.contentDocument.body.querySelector(`#${FirebaseUIContainer}`);
    this.uiWidget.start(container, loginConfig);
  }

  render () {
    if (this.state.signedIn) {
      return (
        <Button onClick={() => this.props.fb.auth().signOut()}>Sign out</Button>
      )
    }
    // TODO: requires firebase ui container to exist in both instances 
    return <div id={FirebaseUIContainer}></div>
  }
}

export default LoginScreen;
