const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

exports.postProcessPostCreated = functions.database.ref('/forums/demo/threads/{threadId}').onCreate((snapshot) => {
  const post = snapshot.toJSON();
  
  console.log(`Processing new post created: ${post}`);

  return snapshot.ref.update(Object.assign({}, post, {
    created: Date.now(),
    upvotes: 0,
    downvotes: 0
  }));
});

exports.createUserOnSignIn = functions.auth.user().onCreate((user, context) => {
  console.log(`Creating new user: ${user.displayName}`);

  return admin.database().ref('/users/' + user.uid).set({
    name: user.displayName,
    avatar: user.photoURL,
    permissions: 'user'
  });
});

// exports.removeUserIfDelete = functions.auth.user().onDelete((user) => {});
