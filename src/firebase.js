function importApp () {
  return import(/* chunkname: 'firebase-app' */ 'firebase/app');
}

function importFirestore () {
  return import(/* chunkname: 'firebase-firestore' */ 'firebase/firestore');
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

export { importApp, importAuth, importFirestore, importStorage };
