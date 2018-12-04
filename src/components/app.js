import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/core/styles';

import Loading from './loading';
import Toolbar from './toolbar';
import TextEditor from './editor';
import CommentList from './comment';
import ResizableFrame from './frame';

import { importApp, importDatabase } from '../firebase';

import 'react-toastify/dist/ReactToastify.min.css';

const styles = {
  base: {
    'font-family': '\'Roboto\', sans-serif'
  }
};

class App extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      ready: false,
      user: false,
      comments: []
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

    if (!this.props.firebaseMessagingSenderId.length) {
      return this.alertError('Configuration failed: Invalid Firebase Messaging Sender Id');
    }

    console.log(window.location.pathname);
    
    importApp().then((app) => {
      importDatabase().then(() => {
        this.fb = app.initializeApp({
          apiKey: this.props.firebaseApiKey,
          authDomain: `${this.props.firebaseProjectId}.firebaseapp.com`,
          databaseURL: `https://${this.props.firebaseProjectId}.firebaseio.com`,
          projectId: this.props.firebaseProjectId,
          storageBucket: `${this.props.firebaseProjectId}.appspot.com`,
          messagingSenderId: this.props.firebaseMessagingSenderId
        });
        
        const db = this.fb.database();

        db.ref('/demo').once('value').then((snapshot) => console.log(snapshot.val()));
        // db.ref('/demo/threads').on('value', (snapshot) => console.log(snapshot.val()));
        //const t = db.ref('/threads/demo').push()
        this.setState({ ready: true });
      }).catch((err) => console.error(err));
    }).catch((err) => console.error(err));
  }

  render () {
    return (
      <React.Fragment>
        <CssBaseline />
        <ResizableFrame 
          id="echo-content" 
          style={{ minWidth: '100%', minHeight: '320px', overflow: 'hidden', border: 'none' }}>
            <div className={this.props.classes.base}>
            {
              this.state.ready ?
                <React.Fragment>
                  <header>
                    <Toolbar totalComments={this.state.comments.length} />
                  </header>
                  <main>
                    <TextEditor 
                      fb={this.fb} 
                      user={this.state.user} 
                      alertError={this.alertError}
                      updateAuthState={this.updateAuthState.bind(this)} />
                  </main>
                  <footer>
                    <CommentList comments={this.state.comments} />
                  </footer>
                </React.Fragment> : <Loading />
            }
            </div>
          </ResizableFrame>
        <ToastContainer />
      </React.Fragment>
    );
  }
};

export default withStyles(styles)(App);
