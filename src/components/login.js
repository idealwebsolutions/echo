import { Component, Fragment, linkEvent } from 'inferno';
import { auth } from 'firebase/app';

import { importAuth } from '../firebase';

import { FirebaseUIContainer } from '../constants';
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
    const container = targetFrame.contentDocument.body.querySelector(`#${FirebaseUIContainer}`);

    importAuth().then(() => {
      uiWidget = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(this.props.fb.auth());
      uiWidget.reset();
      
      this.unregisterAuthObserver = this.props.fb.auth().onAuthStateChanged((user) => {
        if (!user && this.state.signedIn) {
          uiWidget.reset();
        }

        this.setState({ signedIn: !!user });
        
        if (user) {
          // Temp fix for broken fn call
          targetFrame.contentDocument.body.querySelector('#sign-out').addEventListener(
            'click', () => this.props.fb.auth().signOut()
          )
        }
      });

      uiWidget.start(container, generateLoginConfig([
        auth.GoogleAuthProvider.PROVIDER_ID,
        auth.EmailAuthProvider.PROVIDER_ID
      ]));
      
      this.setState({ ready: true });
    });
  }

  componentWillUnmount () {
    this.unregisterAuthObserver();
  }

  render () {
    if (this.state.signedIn) {
      return (
        <Fragment>
          <div>Signed in as {this.props.fb.auth().currentUser.displayName}</div>
          <button id="sign-out">Sign out</button>
        </Fragment>
      )
    }
    
    return <div id={FirebaseUIContainer}></div>
  }
}

export default LoginScreen;
