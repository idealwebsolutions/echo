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

function importMessaging () {
  return import(/* chunkname: 'firebase-messaging' */ 'firebase/messaging');
}

export { importApp, importAuth, importDatabase, importStorage };
