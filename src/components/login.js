import { Component, Fragment } from 'inferno';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

import { LoginUIConfig } from '../constants';

class Login extends Component {
  constructor (props) {
    super(props);
  }

  componentDidMount () {
  
  }

  componentWillUnmount () {
  }

  render () {
    const { signedIn } = this.props
    return (
      <Fragment>
        <span>You must sign in first</span>
        <StyledFirebaseAuth uiConfig={} firebaseAuth={} />
      </Fragment>
    )
  }
}
