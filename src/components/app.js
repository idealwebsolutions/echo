import { Component } from 'inferno';
import Frame from 'react-frame-component';
import { get } from 'axios';
import Style from 'style-it';

import Loading from './loading';
import Root from './root';

// import { validateSchema } from '../util';

const Base = ({ children }) => (
  <Style>
    {`
      @import url('https://fonts.googleapis.com/css?family=Pontano+Sans');
      .base {
        font-family: 'Pontano Sans', sans-serif;
      }
    `}
    <div className="base">{children}</div>
  </Style>
);

const getConfiguration = (path) => get(`${path ? path : 'config.json'}`)

class App extends Component {
  constructor (props) {
    super(props);
    this.state = {
      loading: false,
      authenticated: {}
    };
    this.config = {}
    this.updateUser = this.updateUser.bind(this);
  }

  updateUser (user) {
    this.setState({
      authenticated: !user ? {} : user
    });
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
    return (
      <Frame style={{ 'min-width': '100%', overflow: 'hidden', border: 'none' }}>
        <Base>
          {this.state.loading ? <Loading /> : <Root />}
        </Base>
      </Frame>
    );
  }
};

export default App;
