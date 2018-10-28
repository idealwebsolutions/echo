import { Component } from 'inferno';
import Frame from 'react-frame-component';

import { get } from 'axios';
// import { initializeApp } from 'firebase/app';

// import 'firebase/auth';
// import 'firebase/database';
// import 'firebase/storage';

import Loading from './loading';
import Root from './root';

// import { validateSchema } from '../util';

const getConfiguration = (path) => get(`${path ? path : 'config.json'}`)

class App extends Component {
  constructor (props) {
    super(props);
    this.state = {
      loading: false,
      authenticated: false
    };
    this.config = {}
  }

  componentDidMount () {
    const { configPath } = this.props;
    this.setState({ loading: true });
    getConfiguration()
      .then((response) => {
        // TODO: verify json with is-my-json-valid
        this.config = response.data;
        this.setState({ loading: false });
      })
      .catch((error) => {
        // TODO: do something
        console.error(error);
      })
  }

  render () {
    const { loading } = this.state;
    return (
      <Frame style={{ display: 'block', overflow: 'scroll', border: 0 }}>
        {loading ? <Loading /> : <Root />}
      </Frame>
    );
  }
};

export default App;
