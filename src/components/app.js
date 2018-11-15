import React from 'react';
import { get } from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import Style from 'style-it';

import Loading from './loading';
import Toolbar from './toolbar';
import TextEditor from './editor';
import CommentList from './comment';
import ResizableFrame from './frame';

import { importApp, importDatabase } from '../firebase';
import { ConfigSchema } from '../constants';
import { validateSchema } from '../util';

import 'react-toastify/dist/ReactToastify.min.css';

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

class App extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      ready: false,
      authenticated: false
    };
    this.fb = null;
  }

  updateAuthState (user) {
    this.setState({
      authenticated: !user || Object.keys(user).length === 0 ? false : user
    });
    console.log(this.state.authenticated);
  }

  alertError (errorMessage) {
    toast.error(errorMessage, { 
      position: toast.POSITION.BOTTOM_CENTER 
    });
  }

  componentDidMount () {
    this.setState({ ready: false });
    getConfiguration(this.props.configPath)
      .then((response) => {
        const valid = validateSchema(ConfigSchema, response.data);
        
        if (!valid) {
          return this.alertError('Invalid schema found: wrong configuration file');
        }

        console.log(window.location.pathname);
        
        importApp().then((app) => {
          importDatabase().then(() => {
            this.fb = app.initializeApp(response.data);
            
            const db = this.fb.database();

            db.ref('/demo').once('value').then((snapshot) => console.log(snapshot.val()));
            // db.ref('/demo/threads').on('value', (snapshot) => console.log(snapshot.val()));
            this.setState({ ready: true });
          });
        });
      })
      .catch((error) => {
        console.error(error);
        this.alertError('Unable to fetch firebase configuration');
      });
  }

  render () {
    return (
      <React.Fragment>
        <ResizableFrame 
          id="echo-content" 
          style={{ minWidth: '100%', minHeight: '320px', overflow: 'hidden', border: 'none' }}>
          <Base>
            {
              this.state.ready ?
                <React.Fragment>
                  <header>
                    <Toolbar />
                  </header>
                  <main>
                    <TextEditor 
                      fb={this.fb} 
                      user={this.state.authenticated} 
                      updateAuthState={this.updateAuthState.bind(this)} />
                    <CommentList fb={this.fb} />
                  </main>
                  <footer>
                  </footer>
                </React.Fragment> : <Loading />
            }
          </Base>
        </ResizableFrame>
        <ToastContainer />
      </React.Fragment>
    );
  }
};

export default App;
