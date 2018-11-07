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

export { importApp, importAuth, importDatabase, importStorage };
