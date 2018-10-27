export function importApp () {
  return import('firebase/app');
}

export function importDatabase () {
  return import(/* chunkname: 'firebase-database' */ 'firebase/database');
}

export function importStorage () {
  return import(/* chunkname: 'firebase-storage' */ 'firebase/storage');
}

export function importAuth () {
  return import(/* chunkname: 'firebase-auth' */ 'firebase/auth');
}
