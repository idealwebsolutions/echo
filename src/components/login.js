import { Component, Fragment } from 'inferno';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

import { importApp, importAuth } from './firebase';

import { LoginUIConfig } from '../constants';

class LoginScreen extends Component {
  constructor (props) {
    super(props);
    this.state = {
      ready: false
    };
    this.fb = null;
  }

  componentDidMount () {
    this.setState({ ready: false });
    importApp().then((app) => {
      importAuth().then(() => {
        this.fb = app.initializeApp(this.props.config.firebase);
        this.setState({ ready: true });
      });
    });
  }

  componentWillUnmount () {
  }

  render () {
    return (
      <Fragment>
        { this.state.ready ?
          <StyledFirebaseAuth 
            uiConfig={
              LoginUIConfig([
                this.fb.firebase_.auth.GoogleAuthProvider.PROVIDER_ID
              ])
            } 
            firebaseAuth={this.fb.auth()} />
          : <div id="firebaseui-auth-container"></div>}
      </Fragment>
    )
  }
}

export default LoginScreen;
