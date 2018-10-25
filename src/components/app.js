import { Component } from 'inferno';
import Loadable from 'inferno-loadable';
import { get } from 'axios';

import Loading from './loading';

const PopulatedRoot = Loadable({
  loader: () => import('./root'),
  loading: Loading
});

const getConfiguration = (rootPath) => get(`${rootPath ? rootPath : '/'}config.json`)

class App extends Component {
  constructor (props) {
    super(props);
    this.state = {
      loading: false
    };
  }

  componentDidMount () {
    const { configRoot } = this.props;
    this.setState({ loading: true });
    console.log(configRoot);
    getConfiguration()
      .then((response) => {
        console.log(response.data);
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
