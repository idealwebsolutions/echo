import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';

import Loading from './loading';
import Navigation from './navigation';
import FilterBar from './filter';
import TextEditor from './editor';
import CommentList from './comment';
import ResizableFrame from './frame';

import { importApp, importFirestore } from '../firebase';
import { makeToast } from '../util';

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

  getFirestore() {
    const firestore = this.fb.firestore();
    firestore.settings({
      timestampsInSnapshots: true
    });
    return firestore;
  }

  getStorage () {
    return this.fb.storage();
  }

  getAuth () {
    return this.fb.auth();
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
      importFirestore().then(() => {
        this.fb = app.initializeApp({
          apiKey: this.props.firebaseApiKey,
          authDomain: `${this.props.firebaseProjectId}.firebaseapp.com`,
          databaseURL: `https://${this.props.firebaseProjectId}.firebaseio.com`,
          projectId: this.props.firebaseProjectId,
          storageBucket: `${this.props.firebaseProjectId}.appspot.com`,
          messagingSenderId: this.props.firebaseMessagingSenderId
        });

        /*this.getFirestore().enablePersistence()
        .catch((err) => {
          console.error(err);
        });*/

        const demoRef = this.getFirestore().collection('topics').doc('demo');
        
        demoRef.onSnapshot((snapshot) => {
          const topic = snapshot.data();

          this.setState({ totalComments: topic.totalComments }); 
        }, (err) => console.error(err));

        // COST - 10 READS
        const threadQuery = this.getFirestore().collection('posts')
          .where('topic', '==', demoRef)
          .where('reply', '==', null)
          .orderBy('created')
          .limit(10);

        threadQuery.get().then((snapshot) => {
          if (snapshot.empty) {
            return;
          }
          
          this.setState({
            comments: this.state.comments.concat(snapshot.docs.map((doc) => Object.assign({}, doc.data(), {
              id: doc.id
            })))
          });
        })
        .catch((err) => console.error(err));
        /* 
        postsRef.on('child_changed', (snapshot) => {
          console.log(snapshot.val());
        });*/
        // 
        this.setState({ ready: true });
      }).catch((err) => console.error(err));
    }).catch((err) => console.error(err));
  }
  
  render () {
    return (
      <ResizableFrame 
        id="echo-content" 
        style={{ minWidth: '100%', minHeight: '320px', overflow: 'hidden', border: 'none' }}>
          {
            this.state.ready ?
              <React.Fragment>
                <CssBaseline />
                <Navigation 
                  user={this.state.user}
                  totalComments={this.state.totalComments}
                  getFirestore={this.getFirestore.bind(this)} />
                <main>
                  <FilterBar />
                  <Divider variant="middle" />
                  <TextEditor 
                    user={this.state.user} 
                    updateAuthState={this.updateAuthState.bind(this)}
                    getStorage={this.getStorage.bind(this)}
                    getAuth={this.getAuth.bind(this)}
                    getFirestore={this.getFirestore.bind(this)} />
                </main>
                <footer>
                  <CommentList 
                    user={this.state.user}
                    comments={this.state.comments}
                    getFirestore={this.getFirestore.bind(this)} />
                </footer>
              </React.Fragment> : <Loading />
          }
        </ResizableFrame>
    );
  }
};

export default App;
