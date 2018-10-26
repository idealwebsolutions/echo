import { Component } from 'inferno';
import Loadable from 'inferno-loadable';
import { get } from 'axios';
import { initializeApp } from 'firebase/app';

import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

import Loading from './loading';

const PopulatedRoot = Loadable({
  loader: () => import('./root'),
  loading: Loading
});

const getConfiguration = (path) => get(`${path ? path : '/config.json'}`)

class App extends Component {
  constructor (props) {
    super(props);
    this.state = {
      loading: false
    };
  }

  componentDidMount () {
    const { configPath } = this.props;
    this.setState({ loading: true });
    getConfiguration(configPath)
      .then((response) => {
        // TODO: verify json with is-my-json-valid
        const { firebase } = response.data;
        console.log(firebase)
        const fb = initializeApp(firebase);
        this.setState({ loading: false });
      })
      .catch((error) => {
        console.error(error);
      })
  }

  render () {
    return this.state.loading ? <Loading /> : <PopulatedRoot />
  }
};

export default App;
