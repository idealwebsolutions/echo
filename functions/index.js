const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

exports.processNewPostCreated = functions.firestore.document('/posts/{postId}').onCreate((snapshot, context) => {
  const post = snapshot.data();
  
  const topicRef = admin.firestore().collection('topics').doc(post.topic);
  const userRef = admin.firestore().collection('users').doc(post.author);
 
  // TODO: This should be done at validation level
  // VALIDATE REPLIED USER ACTUALLY EXISTS
  if (post.reply) {
    admin.firestore().collection('users').doc(post.reply).get()
    .then((snapshot) => {
      if (snapshot.empty) {
        const batch = admin.firestore().batch();
        snapshot.forEach((doc) => batch.delete(doc.ref));
        return null;
      }
    })
    .catch((err) => console.error(err));
  }

  // Don't extend object, we don't want to include any data we don't need/care about
  return snapshot.ref.update({
    created: Date.now(),
    topic: topicRef,
    author: userRef,
    content: post.content,
    reply: post.reply,
    upvotes: [],
    downvotes: []
  });
});

exports.createUserOnSignIn = functions.auth.user().onCreate((user, context) => {
  console.log(`Creating new user: ${user.displayName}`);

  return admin.firestore().collection('users').doc(user.uid).set({
    name: user.displayName,
    avatar: user.photoURL,
    created: Date.now(),
    roles: ['user'],
    disabled: false
  });
});

// exports.removeUserIfDelete = functions.auth.user().onDelete((user) => {});
