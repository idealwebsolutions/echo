import { Component } from 'inferno';

const withDatabase = (WrappedComponent) => {
  class RealtimeDatabase extends Component {
    componentDidMount () {
      importApp().then((app) => {
        importDatabase().then(() => {
          const db = app.initializeApp(config).database()
        })
      })
    }

    render () {
      return (
        <WrappedComponent>
      )
    }
  }
}

const withStorage = (WrappedComponent) => {
  class Storage extends Component {
  }
}

const withAuth = (WrappedComponent) => {
}

function importApp () {
  return import('firebase/app');
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

export withDatabase;
export withStorage;
export withAuth;
