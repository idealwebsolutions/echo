import { Component } from 'inferno';

const withDatabase = (WrappedComponent) => {
  class RealtimeDatabase extends Component {
    componentDidMount () {
      importApp().then((app) => {
        importDatabase().then(() => {
          /*const db = app.initializeApp().database();
          db.ref('/').once('value').then((snapshot) => {
            console.log(snapshot.val())
          })*/
        })
      }).catch((err) => {
        console.error(err)
      })
    }

    render () {
      return <WrappedComponent />
    }
  }

  return RealtimeDatabase;
}

const withStorage = (WrappedComponent) => {
}

const withAuth = (WrappedComponent) => {
}

function importApp () {
  return import(/* chunkname: 'firebase-app' */ 'firebase/app');
}

function importDatabase () {
  return import(/* chunkname: 'firebase-database' */ 'firebase/database');
}

function importStorage () {
  return import(/* chunkname: 'firebase-storage' */ 'firebase/storage');
}

function importAuth () {
  return import(/* chunkname: 'firebase-auth' */ 'firebase/auth');
}

export default withDatabase;
// export withStorage;
// export withAuth;
