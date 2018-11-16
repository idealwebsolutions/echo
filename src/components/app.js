import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Style from 'style-it';

import Loading from './loading';
import Toolbar from './toolbar';
import TextEditor from './editor';
import CommentList from './comment';
import ResizableFrame from './frame';

import { importApp, importDatabase } from '../firebase';

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

class App extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      ready: false,
      user: false
    };
    this.fb = null;
  }

  updateAuthState (user) {
    this.setState({
      user: !user || Object.keys(user).length === 0 ? false : user
    });
  }

  alertError (errorMessage) {
    toast.error(errorMessage, { 
      position: toast.POSITION.BOTTOM_CENTER 
    });
  }

  componentDidMount () {
    this.setState({ ready: false });
    
    if (!this.props.firebaseApiKey.length) {
      return this.alertError('Configuration failed: Invalid Firebase API key');
    }

    if (!this.props.firebaseProjectId.length) {
      return this.alertError('Configuration failed: Invalid Firebase Project Id');
    }

    console.log(window.location.pathname);
    
    importApp().then((app) => {
      importDatabase().then(() => {
        this.fb = app.initializeApp({
          apiKey: this.props.firebaseApiKey,
          authDomain: `${this.props.firebaseProjectId}.firebaseapp.com`,
          databaseURL: `https://${this.props.firebaseProjectId}.firebaseio.com`,
          projectId: this.props.firebaseProjectId,
          storageBucket: `${this.props.firebaseProjectId}.appspot.com`
        });
        
        const db = this.fb.database();
        
        db.ref('/demo').once('value').then((snapshot) => console.log(snapshot.val()));
        // db.ref('/demo/threads').on('value', (snapshot) => console.log(snapshot.val()));
        this.setState({ ready: true });
      });
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
                      user={this.state.user} 
                      alertError={this.alertError}
                      updateAuthState={this.updateAuthState.bind(this)} />
                    <CommentList 
                      fb={this.fb} 
                    />
                  </main>
                  <footer></footer>
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
