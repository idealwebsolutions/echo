import { Component } from 'inferno';
import { get } from 'axios';
import Style from 'style-it';

import Loading from './loading';
import ResizableFrame from './frame';
import Root from './root';

import { importApp, importDatabase } from '../firebase';
import { ConfigSchema } from '../constants';
import { validateSchema } from '../util';

// Applies global styles across app
const Base = ({ children }) => (
  <Style>
    {`
      @import url('https://fonts.googleapis.com/css?family=Pontano+Sans');
      @import url('https://unpkg.com/ionicons@4.4.6/dist/css/ionicons.min.css');
      @import url('https://cdn.firebase.com/libs/firebaseui/3.4.1/firebaseui.css');

      * {
        box-sizing: border-box;
      }

      ul {
        list-style-type: none;
        padding: 0;
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
    this.fb = null;
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
        
        importApp().then((app) => {
          importDatabase().then(() => {
            this.fb = app.initializeApp(response.data.firebase);
            const db = this.fb.database();
            db.ref('/demo').once('value').then((snapshot) => {
              console.log(snapshot.val())
            });
            this.setState({ ready: true });
          });
        });
      })
      .catch((error) => {
        // TODO: do something
        console.error(error);
      });
  }

  render () {
    return (
      <ResizableFrame id="echo-content" style={{ 'min-width': '100%', 'min-height': '320px', overflow: 'hidden', border: 'none' }}>
        <Base>
          {this.state.ready ? <Root fb={this.fb} /> : <Loading />}
        </Base>
      </ResizableFrame>
    );
  }
};

export default App;
