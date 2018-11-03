import { Component } from 'inferno';
import { get } from 'axios';
import Style from 'style-it';

import Loading from './loading';
import ResizableFrame from './frame';
import Root from './root';

import { ConfigSchema } from '../constants';
import { validateSchema } from '../util';

const Base = ({ children }) => (
  <Style>
    {`
      @import url('https://fonts.googleapis.com/css?family=Pontano+Sans');
      @import url('https://unpkg.com/ionicons@4.4.6/dist/css/ionicons.min.css');
      
      * {
        box-sizing: border-box;
      }

      .base {
        font-family: 'Pontano Sans', sans-serif;
      }
      
      .base > div {
        width: 60px;
        margin-left: auto;
        margin-right: auto;
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
      ready: false,
      authenticated: {}
    };
    this.config = {}
  }

  updateAuthState (user) {
    this.setState({
      authenticated: !user ? {} : user
    });
  }

  componentDidMount () {
    this.setState({ ready: false });
    getConfiguration(this.props.configPath)
      .then((response) => {
        const valid = validateSchema(ConfigSchema, response.data);
        
        if (!valid) {
          // TODO: render error message
          return;
        } 
        
        this.config = response.data;
        this.setState({ ready: true });
      })
      .catch((error) => {
        // TODO: do something
        console.error(error);
      })
  }

  render () {
    return (
      <ResizableFrame id="echo-content" style={{ 'min-width': '100%', 'min-height': '320px', overflow: 'hidden', border: 'none' }}>
        <Base>
          {this.state.ready ? <Root config={this.config} /> : <Loading />}
        </Base>
      </ResizableFrame>
    );
  }
};

export default App;
