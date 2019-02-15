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
//import 'react-placeholder/lib/reactPlaceholder.css';

class App extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      ready: false,
      triggeredAlert: false,
      user: null,
      topic: '',
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
    
    this.getFirestore().collection('access').doc(user.uid)
    .get()
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

  sortBy (mode = 'new') {
    if (mode === 'best') {
      console.log('sort by best')
    } else {
      console.log('sort by new')
    }
  }

  pullThreads (topic, offset = 0, limit = 10) {
    const topicRef = this.getFirestore().collection('topics').doc(topic);
    // COST - MAX 10 READS INITIALLY
    this.getFirestore().collection('posts')
    .where('topic', '==', topicRef)
    .where('reply', '==', null)
    .orderBy('created', 'desc')
    .limit(limit)
    .get().then((snapshot) => {
      if (snapshot.empty) {
        return;
      }

      this.setState({
        comments: snapshot.docs.map((doc) => Object.assign({}, doc.data(), {
          id: doc.id
        }))
      });
    }).catch((err) => console.error(err));
  }

  createPost (post, onFinish = () => {}) {
    this.getFirestore().collection('posts').doc()
    .set({
      topic: 'demo',
      author: this.state.user.uid,
      content: post,
      reply: null
    }).then(() => {
      onFinish();

      this.setState({
        comments: this.state.comments.unshift({
        
        })
      });
    })
    .catch((err) => console.error(err)); 
  }

  removePost (id, onFinish = () => {}) {
    const postRef = this.getFirestore().collection('posts').doc(id);
    postRef.delete()
    .then(() => {
      console.log(`Removing post(${id})`);
      
      onFinish();
      
      this.setState({
        comments: this.state.comments.filter((comment) => {
          return id !== comment.id;
        }),
        totalComments: this.state.totalComments--
      });
    })
    .catch((err) => console.error(err));
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

          const totalComments = topic.totalComments;
          const locked = topic.closed;
          
          if (totalComments < 10) {
            this.pullThreads('demo');
          }

          this.setState({
            totalComments,
            ready: true
          });
        }, (err) => console.error(err));
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
                  { 
                    this.state.user ? 
                      <TextEditor 
                        user={this.state.user} 
                        createPost={this.createPost.bind(this)}
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
                    totalCommentsCount={this.state.totalComments}
                    removePost={this.removePost.bind(this)}
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
