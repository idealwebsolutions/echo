import { Component } from 'inferno';
import Loadable from 'inferno-loadable';
import Frame from 'react-frame-component';
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
    // const { configRoot } = this.props;
    this.setState({ loading: true });
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
    return ( 
      <Frame>
        this.state.loading ? <Loading /> : <PopulatedRoot />
      </Frame>
    )
  }
};

export default App;
