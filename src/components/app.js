import React from 'react';
import { ToastContainer } from 'react-toastify';
import CssBaseline from '@material-ui/core/CssBaseline';

import Loading from './loading';
import Toolbar from './toolbar';
import TextEditor from './editor';
import CommentList from './comment';
import ResizableFrame from './frame';

import { importApp, importDatabase } from '../firebase';
import { 
  makeToast, 
  generatePostsUrl, 
  fetchPostCount 
} from '../util';

import 'react-toastify/dist/ReactToastify.min.css';

class App extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      ready: false,
      user: null,
      totalComments: 0,
      comments: []
    };
    this.fb = null;
  }

  updateAuthState (user) {
    this.setState({
      user: !user || Object.keys(user).length === 0 ? false : user
    });
  }

  fetchUser (uid, done) {
    this.fb.database().ref('/users/' + uid).once('value', done);
  }

  componentDidMount () {
    this.setState({ ready: false });
    
    if (!this.props.firebaseApiKey.length) {
      return makeToast('Configuration failed: Invalid Firebase API key', true);
    }

    if (!this.props.firebaseProjectId.length) {
      return makeToast('Configuration failed: Invalid Firebase Project Id', true);
    }

    if (!this.props.firebaseMessagingSenderId.length) {
      return makeToast('Configuration failed: Invalid Firebase Messaging Sender Id', true);
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

        const postsRef = this.fb.database().ref(generatePostsUrl('demo'));
        // 
        postsRef.orderByChild('created').limitToFirst(10).once('value', (snapshot) => {
          const comments = snapshot.val();
          this.setState({
            comments: this.state.comments.concat(Object.keys(comments).map((key) => comments[key]))
          });
        });
        // 
        postsRef.on('child_changed', (snapshot) => {
          console.log(snapshot.val());
        });
        // 
        fetchPostCount(this.props.firebaseProjectId, 'demo')
          .then((response) => {
            const postKeys = response.data;
            
            if (!postKeys) {
              return;
            }

            this.setState({ totalComments: Object.keys(postKeys).length })
          })
          .catch((err) => console.error(err));
        //
        this.setState({ ready: true });
      }).catch((err) => console.error(err));
    }).catch((err) => console.error(err));
  }
  
  // TODO: replace fb with functions that require firebase data
  render () {
    return (
      <React.Fragment>
        <ResizableFrame 
          id="echo-content" 
          style={{ minWidth: '100%', minHeight: '320px', overflow: 'hidden', border: 'none' }}>
            {
              this.state.ready ?
                <React.Fragment>
                  <CssBaseline />
                  <header>
                    <Toolbar 
                      fb={this.fb}
                      totalComments={this.state.totalComments} />
                  </header>
                  <main>
                    <TextEditor 
                      fb={this.fb} 
                      user={this.state.user} 
                      updateAuthState={this.updateAuthState.bind(this)} />
                  </main>
                  <footer>
                    <CommentList 
                      comments={this.state.comments}
                      fetchUser={this.fetchUser.bind(this)} />
                  </footer>
                </React.Fragment> : <Loading />
            }
          </ResizableFrame>
        <ToastContainer />
      </React.Fragment>
    );
  }
};

export default App;
