import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';

import Loading from './loading';
import Toast from './toast';
import Navigation from './navigation';
import LoginPanel from './login';
import FilterBar from './filter';
import TextEditor from './editor';
import CommentList from './comment';
import ResizableFrame from './frame';

import { importApp, importFirestore } from '../firebase';

class App extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      ready: false,
      triggeredAlert: false,
      user: null,
      totalComments: 0,
      comments: []
    };
    this.fb = null;
  }

  updateAuthState (user) {
    if (!user || Object.keys(user).length === 0) {
      this.setState({
        user: null
      });
      return;
    }
    
    const accessRef = this.getFirestore().collection('access').doc(user.uid);
    accessRef.get()
    .then((doc) => {
      this.setState({
        user: !doc.exists ? Object.assign({}, user, {
          roles: ['user']
        }) : Object.assign({}, user, doc.data())
      });
    })
    .catch((err) => console.error(err));
  }

  notify (message, type='error') {
    this.setState({
      triggeredAlert: {
        type,
        message
      }
    });
  }

  handleAlertClose () {
    this.setState({
      triggeredAlert: false
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
      this.notify('Configuration failed: Invalid Firebase API key');
      return;
    }

    if (!this.props.firebaseProjectId.length) {
      this.notify('Configuration failed: Invalid Firebase Project Id');
      return;
    }

    if (!this.props.firebaseMessagingSenderId.length) {
      this.notify('Configuration failed: Invalid Firebase Messaging Sender Id');
      return;
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

        // COST - MAX 10 READS
        const threadQuery = this.getFirestore().collection('posts')
          .where('topic', '==', demoRef)
          .where('reply', '==', null)
          .orderBy('created', 'desc')
          .limit(10);

        threadQuery.onSnapshot((snapshot) => {
          if (snapshot.empty) {
            return;
          }

          this.setState({
            comments: snapshot.docs.map((doc) => Object.assign({}, doc.data(), {
              id: doc.id
            }))
          });
        }, (err) => console.error(err));
        // 
        this.setState({ ready: true });
      }).catch((err) => console.error(err));
    }).catch((err) => console.error(err));
  }
  
  render () {
    if (!this.state.ready && this.state.triggeredAlert) {
      return (
        <React.Fragment>
          <CssBaseline />
          <Toast 
            open={typeof this.state.triggeredAlert === 'object' || false}
            variant={this.state.triggeredAlert.type || 'error'}
            message={this.state.triggeredAlert.message || ''}
            onClose={this.handleAlertClose.bind(this)} />
        </React.Fragment>
      );
    }

    return (
      <ResizableFrame 
        id="echo_content" 
        style={{ minWidth: '100%', minHeight: '1px', overflow: 'hidden', border: 'none' }}>
          {
            this.state.ready ?
              <React.Fragment>
                <CssBaseline />
                <Navigation 
                  user={this.state.user}
                  totalComments={this.state.totalComments}
                  getAuth={this.getAuth.bind(this)}
                  getFirestore={this.getFirestore.bind(this)} />
                <main>
                  <FilterBar />
                  <Divider variant="middle" />
                  { this.state.user ? 
                    <TextEditor 
                      user={this.state.user} 
                      getStorage={this.getStorage.bind(this)}
                      getAuth={this.getAuth.bind(this)}
                      getFirestore={this.getFirestore.bind(this)} />
                    : <LoginPanel
                        updateAuthState={this.updateAuthState.bind(this)}
                        getAuth={this.getAuth.bind(this)} />
                  }
                </main>
                <footer>
                  <CommentList 
                    user={this.state.user}
                    comments={this.state.comments}
                    getFirestore={this.getFirestore.bind(this)} />
                </footer>
                <Toast 
                  open={typeof this.state.triggeredAlert === 'object' || false} 
                  variant={this.state.triggeredAlert.type || 'error'}
                  message={this.state.triggeredAlert.message || ''}
                  onClose={this.handleAlertClose.bind(this)} />
              </React.Fragment> : <Loading />
          }
        </ResizableFrame>
    );
  }
};

export default App;
