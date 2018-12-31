import React from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import { auth } from 'firebase/app';

import { importAuth } from '../firebase';
import { FirebaseUIContainer } from '../constants';
import { generateLoginConfig, Noop } from '../util';

const styles = {
  signOut: {
    width: '100%'
  }
};

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
        auth.EmailAuthProvider.PROVIDER_ID
      ]));
    }).catch((err) => console.error(err));
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
    if (this.state.signedIn) {
      return (
        <Button variant="contained" color="secondary" className={this.props.classes.signOut} onClick={() => this.props.getAuth().signOut()}>Sign out</Button>
      )
    }

    // TODO: requires firebase ui container to exist in both instances 
    return <div id={FirebaseUIContainer}></div>
  }
}

export default withStyles(styles)(LoginScreen);
