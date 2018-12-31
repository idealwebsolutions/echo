const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

exports.processNewPostCreated = functions.firestore.document('/posts/{postId}').onCreate((snapshot, context) => {
  const post = snapshot.data();
  
  const topicRef = admin.firestore().collection('topics').doc(post.topic);
  const userRef = admin.firestore().collection('users').doc(post.author);
 
  // TODO: This should be done at validation level
  // VALIDATE REPLIED USER ACTUALLY EXISTS
  // Cost: 1 READ
  if (post.reply) {
    admin.firestore().collection('users').doc(post.reply).get()
    .then((doc) => {
      if (!doc.exists) {
        return snapshot.ref.delete();
      }
    })
    .catch((err) => console.error(err));
  }
  
  // UPDATE COUNTER
  // 1 READ/1 WRITE
  topicRef.get().then((doc) => {
    // CHECK TOPIC SETTINGS
    const topic = doc.data();
    
    if (!topic.closed) {
      return snapshot.ref.delete();
    }

    topicRef.set({
      totalComments: doc.data().totalComments + 1
    }, { merge: true });
  }).catch((err) => console.error(err));

  // Don't extend object, we don't want to include any data we don't need/care about
  // Cost: 1 WRITE
  return snapshot.ref.update({
    created: Date.now(),
    topic: topicRef,
    author: userRef,
    content: post.content,
    reply: post.reply
  });
});

exports.deduplicateVotes = functions.firestore.document('/votes/{voteId}').onCreate((snapshot, context) => {
  const vote = snapshot.data();

  return admin.firestore().collection('votes')
  .where('user', '==', vote.user)
  .where('post', '==', vote.post)
  .get().then((querySnapshot) => {
    if (querySnapshot.size > 1) {
      return snapshot.ref.delete();
    }

    return snapshot.ref.update({
      positive: vote.positive,
      user: vote.user,
      post: vote.post,
      processed: true
    });
  });

  return voteRef;
});

exports.createUserOnSignIn = functions.auth.user().onCreate((user, context) => {
  console.log(`Creating new user: ${user.displayName}`);
  
  const totalUsersRef = admin.firestore().collection('totals').doc('users');
  const usersRef = admin.firestore().collection('users');

  // COST 1 READ
  return totalUsersRef.get().then((doc) => {
    if (!doc.exists) {
      return null;
    }

    totalUsersRef.set({
      active: doc.data().active + 1
    }, { merge: true }).then(() => {
      usersRef.doc(user.uid).set({
        name: user.displayName,
        avatar: user.photoURL,
        created: Date.now(),
        roles: doc.data().active > 0 ? ['user'] : ['user', 'moderator', 'admin']
      });
    }).catch((err) => console.error(err));
  });
});

// exports.removeUserIfDelete = functions.auth.user().onDelete((user) => {});
