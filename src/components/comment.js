import React from 'react';
// import ShowMoreText from 'react-show-more-text';
import ReactMarkdown from 'react-markdown';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import Flag from '@material-ui/icons/Flag';
import { withStyles } from '@material-ui/core/styles';
import spacetime from 'spacetime';

import Placeholder from './placeholder';
import CustomAvatar from './avatar';

const styles = {
  root: {
    width: '100%'
  },
  inline: {
    display: 'inline'
  },
  commentAuthor: {
    display: 'inline',
    'margin-right': 20,
    'font-weight': 'bold'
  },
  commentIcon: {
    'font-size': '1.3rem',
  },
  commentContent: {
    'margin-top': -1
  },
  commentUpvoteDownvote: {
    'margin-top': 12
  },
  footer: {
    'font-size': '0.9rem'
  }
};

class Comment extends React.Component {
  constructor () {
    super();
    this.state = {
      ready: false,
      author: null,
      upvotes: 0,
      downvotes: 0
    };
  }

  componentDidMount () {
    this.setState({ ready: false });
    
    const votes = this.props.getFirestore().collection('votes');
    
    const upvoteQuery = votes
    .where('post', '==', this.props.id)
    .where('positive', '==', true);

    upvoteQuery.onSnapshot((snapshot) => {
      if (snapshot.empty) {
        return this.setState({
          upvotes: 0
        });
      }
      
      this.setState({
        upvotes: snapshot.size
      });
    }, (err) => console.error(err));

    const downvoteQuery = votes
    .where('post', '==', this.props.id)
    .where('positive', '==', false);

    downvoteQuery.onSnapshot((snapshot) => {
      if (snapshot.empty) {
        return this.setState({
          downvotes: 0
        });
      }

      this.setState({
        downvotes: snapshot.size
      });
    }, (err) => console.error(err));

    this.props.authorRef.get().then((doc) => this.setState({ 
      author: doc.data(),
      ready: true 
    })).catch((err) => console.error(err));
  }

  toggleVote (like = true) {
    const votes = this.props.getFirestore().collection('votes');
    
    const likeQuery = votes
    .where('positive', '==', true)
    .where('user', '==', this.props.currentUser.uid)
    .where('post', '==', this.props.id)
    .limit(1);

    const dislikeQuery = votes
    .where('positive', '==', false)
    .where('user', '==', this.props.currentUser.uid)
    .where('post', '==', this.props.id)
    .limit(1);

    if (!like) {
      likeQuery.get()
      .then((snapshot) => {
        if (!snapshot.empty) {
          console.log('like exists')
          const batch = this.props.getFirestore().batch();
          snapshot.forEach((doc) => {
            batch.set(doc.ref, {
              positive: false
            }, { merge: true });
          });
          return batch.commit().then(() => {
            console.log('updated like to dislike')
          }).catch((err) => console.error(err));
        }

        dislikeQuery.get()
        .then((snapshot) => {
          if (!snapshot.empty) {
            const batch = this.props.getFirestore().batch();
            snapshot.forEach((doc) => batch.delete(doc.ref));
            return batch.commit().then(() => {
              console.log('deleted dislike');
            }).catch((err) => console.error(err));
          }
          
          votes.doc().set({
            positive: false,
            user: this.props.currentUser.uid,
            post: this.props.id
          })
          .then(() => {
            console.log('added dislike');
          })
        .catch((err) => console.error(err));
        }).catch((err) => console.error(err));
      })
      .catch((err) => console.error(err));
    } else {
      dislikeQuery.get()
      .then((snapshot) => {
        if (!snapshot.empty) {
          console.log('dislike exists')
          const batch = this.props.getFirestore().batch();
          snapshot.forEach((doc) => {
            batch.set(doc.ref, {
              positive: true
            }, { merge: true });
          });
          return batch.commit().then(() => {
            console.log('updated dislike to like');
          }).catch((err) => console.error(err));
        }

        likeQuery.get()
        .then((snapshot) => {
          if (!snapshot.empty) {
            const batch = this.props.getFirestore().batch();
            console.log('Like found')
            snapshot.forEach((doc) => batch.delete(doc.ref));
            return batch.commit().then(() => {
              console.log('delete like')
            }).catch((err) => console.error(err));
          }
          
          votes.doc().set({
            positive: true,
            user: this.props.currentUser.uid,
            post: this.props.id
          })
          .then(() => {
            console.log('Added like');
          })
          .catch((err) => console.error(err));
        })
      })
      .catch((err) => console.error(err));
    }
  }

  render () {
    if (!this.state.ready) {
      return null;
    }
    
    return (
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <CustomAvatar user={this.state.author} />
        </ListItemAvatar>
        <ListItemText 
          primary={
            <React.Fragment>
              <Typography variant="subtitle1" className={this.props.classes.commentAuthor} color="textPrimary">
                {this.state.author.name}
              </Typography>
              {spacetime(this.props.created).fromNow().rounded}
            </React.Fragment>
          }
          secondary={
            <React.Fragment>
              <header>
                <ReactMarkdown
                  className={this.props.classes.commentContent}
                  source={this.props.content}
                  disallowedItems={['link', 'linkReference']}
                />
              </header>
              <footer className={this.props.classes.footer}>
                <Grid container spacing={8}>
                  <Grid item className={this.props.classes.commentUpvoteDownvote}>
                    <Typography component="span">{this.state.upvotes}</Typography>
                  </Grid>
                  <Grid item>
                    <IconButton onClick={this.toggleVote.bind(this)} aria-label="upvote" className={this.props.classes.commentIcon}>
                      <KeyboardArrowUp />
                    </IconButton>
                  </Grid>
                  <Grid item className={this.props.classes.commentUpvoteDownvote}>
                    <Typography component="span">{this.state.downvotes}</Typography>
                  </Grid>
                  <Grid item>
                    <IconButton onClick={this.toggleVote.bind(this, false)} aria-label="downvote" className={this.props.classes.commentIcon}>
                      <KeyboardArrowDown />
                    </IconButton>
                  </Grid>
                  { this.state.author ? 
                    <Grid item>
                      <IconButton className={this.props.classes.commentIcon}>
                        <Flag />
                      </IconButton>
                    </Grid> : null 
                  }
                </Grid>
              </footer>
            </React.Fragment>
          }>
        </ListItemText>
      </ListItem>
    );
  }
};

const CommentList = (props) => {
  if (!props.comments.length) {
    return <Placeholder title="No comments found" icon="comment" />;
  }
  
  const comments = props.comments.map((comment) => (
    <Comment
      id={comment.id}
      authorRef={comment.author}
      created={comment.created}
      content={comment.content}
      classes={props.classes}
      currentUser={props.user}
      getFirestore={props.getFirestore}
    />
  ));
  return (<List className={props.classes.root}>{comments}</List>);
}

export default withStyles(styles)(CommentList);
