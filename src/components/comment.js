import React from 'react';
import ShowMoreText from 'react-show-more-text';
import ReactMarkdown from 'react-markdown';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import FormControl from '@material-ui/core/FormControl';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ThumbUp from '@material-ui/icons/ThumbUpAlt';
import ThumbDown from '@material-ui/icons/ThumbDownAlt';
import Edit from '@material-ui/icons/Edit';
import Delete from '@material-ui/icons/Delete';
import Flag from '@material-ui/icons/Flag';
import Build from '@material-ui/icons/Build';
import Grow from '@material-ui/core/Grow';
import { withStyles } from '@material-ui/core/styles';

import Placeholder from './placeholder';
import CustomAvatar from './avatar';

import { emojify, timeSince } from '../util';

const styles = {
  root: {
    width: '100%'
  },
  inline: {
    display: 'inline'
  },
  commentAuthor: {
    display: 'inline',
    marginRight: 20,
    fontWeight: 'bold'
  },
  commentLink: {
    color: '#111111',
    textDecoration: 'none'
  },
  commentIcon: {
    fontSize: '1.3rem',
  },
  commentContent: {
    marginTop: 0
  },
  commentUpvoteDownvote: {
    marginTop: 12
  },
  footer: {
    fontSize: '0.9rem'
  },
  expansionPanel: {
    display: 'flex',
    alignItems: 'flex-end',
    paddingLeft: '40px'
  },
  actionButton: {
    padding: 30
  },
  textButton: {
    display: 'flex',
    alignItems: 'center'
  }
};

const CommandList = ({ isHovering = false }) => {
  console.log(isHovering);
  return <div></div>;
}

/*const CommandList = ({ isHovering = false }) => (
  <div className="activated-command">
    { isHovering ? 
      <IconButton>
        <KeyboardArrowUp />
      </IconButton> : null
    }
  </div>
);*/

class Comment extends React.Component {
  constructor () {
    super();
    this.state = {
      ready: false,
      author: null,
      upvotes: 0,
      downvotes: 0,
      report: null,
      hidden: false,
      processing: false,
      currentUserVoted: null
    };
  }

  componentDidMount () {
    this.setState({ ready: false });
    
    const votes = this.props.getFirestore().collection('votes');
    
    const upvoteQuery = votes
    .where('post', '==', this.props.id)
    .where('positive', '==', true)
    .where('processed', '==', true);

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
    .where('positive', '==', false)
    .where('processed', '==', true);

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
      author: Object.assign({}, doc.data(), {
        uid: doc.id
      }),
      ready: true 
    })).catch((err) => console.error(err));
  }

  delete () {
    if (!this.props.currentUser) {
      return;
    }

    this.setState({
      processing: true
    });

    const postRef = this.props.getFirestore().collection('posts').doc(this.props.id);
    postRef.delete()
    .then(() => {
      console.log(`Removing post(${this.props.id})`);
      this.setState({
        processing: false
      });
    })
    .catch((err) => console.error(err));
  }

  toggleVote (like = true) {
    if (!this.props.currentUser) {
      return;
    }

    this.setState({
      processing: true
    });
    
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
          const batch = this.props.getFirestore().batch();
          snapshot.forEach((doc) => {
            batch.set(doc.ref, {
              positive: false
            }, { merge: true });
          });
          return batch.commit().then(() => {
            console.log('updated like to dislike')
            this.setState({
              currentUserVoted: {
                positive: false
              },
              processing: false
            });
          }).catch((err) => console.error(err));
        }

        dislikeQuery.get()
        .then((snapshot) => {
          if (!snapshot.empty) {
            const batch = this.props.getFirestore().batch();
            snapshot.forEach((doc) => batch.delete(doc.ref));
            return batch.commit().then(() => {
              console.log('deleted dislike');
              this.setState({
                currentUserVoted: null,
                processing: false
              });
            }).catch((err) => console.error(err));
          }
          
          votes.doc().set({
            positive: false,
            user: this.props.currentUser.uid,
            post: this.props.id
          })
          .then(() => {
            console.log('added dislike');
            this.setState({
              currentUserVoted: {
                positive: false,
              },
              processing: false
            });
          })
        .catch((err) => console.error(err));
        }).catch((err) => console.error(err));
      })
      .catch((err) => console.error(err));
    } else {
      dislikeQuery.get()
      .then((snapshot) => {
        if (!snapshot.empty) {
          const batch = this.props.getFirestore().batch();
          snapshot.forEach((doc) => {
            batch.set(doc.ref, {
              positive: true
            }, { merge: true });
          });
          return batch.commit().then(() => {
            console.log('updated dislike to like');
            this.setState({
              currentUserVoted: {
                positive: true,
              },
              processing: false
            });
          }).catch((err) => console.error(err));
        }

        likeQuery.get()
        .then((snapshot) => {
          if (!snapshot.empty) {
            const batch = this.props.getFirestore().batch();
            snapshot.forEach((doc) => batch.delete(doc.ref));
            return batch.commit().then(() => {
              console.log('delete like')
              this.setState({
                currentUserVoted: null,
                processing: false
              });
            }).catch((err) => console.error(err));
          }
          
          votes.doc().set({
            positive: true,
            user: this.props.currentUser.uid,
            post: this.props.id
          })
          .then(() => {
            console.log('Added like');
            this.setState({
              currentUserVoted: {
                positive: true,
              },
              processing: false
            });
          })
          .catch((err) => console.error(err));
        })
      })
      .catch((err) => console.error(err));
    }
  }

  makeReport () {
    if (!this.props.currentUser) {
      return;
    }

    this.props.getFirestore().collection('reports').doc()
    .set({
      post: this.props.id,
      user: this.props.currentUser.uid,
      details: this.props.report
    })
    .then(() => {
    
    })
    .catch((err) => console.error(err));
  }

  toggleProfile () {
  }

  toggleHide () {
    console.log('toggle hide');
    this.setState({ 
      hidden: !this.state.hidden
    });
  }

  render () {
    if (!this.state.ready) {
      return null;
    }
    
    return (
      <ListItem key={(Date.now() * 9999)} alignItems="flex-start" divider={!this.props.lastItem}>
        <ListItemAvatar>
          <CustomAvatar user={this.state.author} />
        </ListItemAvatar>
        <ListItemText 
          primary={
            <React.Fragment>
              <Typography variant="subtitle1" className={this.props.classes.commentAuthor} color="textPrimary">
                <a onClick={this.toggleProfile.bind(this)} className={this.props.classes.commentLink}>{this.state.author.name}</a>
              </Typography>
              {timeSince(this.props.created)}
            </React.Fragment>
          }
          secondary={
            <React.Fragment>
              <Grid container spacing={24}>
                <Grid item sm={this.props.currentUser ? 7 : 12}>
                  <ShowMoreText anchorClass="block">
                    <ReactMarkdown
                      className={this.props.classes.commentContent}
                      source={emojify(this.props.content)}
                      disallowedItems={['link', 'linkReference']}
                    />
                  </ShowMoreText>
                  <footer className={this.props.classes.footer}>
                    <Grid container spacing={8}>
                      <Grid item className={this.props.classes.commentUpvoteDownvote}>
                        <Typography component="span">{this.state.upvotes}</Typography>
                      </Grid>
                      <Grid item>
                        <IconButton color={this.state.currentUserVoted && this.state.currentUserVoted.positive ? 'primary' : 'default'} disabled={this.state.processing || !this.props.currentUser} onClick={this.toggleVote.bind(this)} aria-label="upvote" className={this.props.classes.commentIcon}>
                          <ThumbUp />
                        </IconButton>
                      </Grid>
                      <Grid item className={this.props.classes.commentUpvoteDownvote}>
                        <Typography component="span">{this.state.downvotes}</Typography>
                      </Grid>
                      <Grid item>
                        <IconButton color={this.state.currentUserVoted && !this.state.currentUserVoted.positive ? 'secondary' : 'default'} disabled={this.state.processing || !this.props.currentUser} onClick={this.toggleVote.bind(this, false)} aria-label="downvote" className={this.props.classes.commentIcon}>
                          <ThumbDown />
                        </IconButton>
                      </Grid>
                      { 
                        this.props.currentUser ? 
                        <Grid item>
                          <IconButton disabled={this.state.processing || !this.props.currentUser || (this.props.currentUser.uid === this.state.author.uid)} onClick={this.makeReport.bind(this)} className={this.props.classes.commentIcon}>
                            <Flag />
                          </IconButton>
                        </Grid> : null
                      }
                      <Grid item className={this.props.classes.textButton}>
                        <Button>REPLY</Button>
                      </Grid>
                    </Grid>
                  </footer>
                </Grid>
                {
                  this.props.currentUser ? 
                  <Grid item sm={5} justify="center" className={this.props.classes.expansionPanel}>
                    <Grid container spacing={8}>
                      {
                        this.props.currentUser.roles.indexOf('administrator') > -1 || 
                        this.state.author.uid === this.props.currentUser.uid ?
                        <Grid item>
                          <IconButton className={this.props.classes.commentIcon}>
                            <Edit />
                          </IconButton>
                        </Grid> : null
                      }
                      { 
                        this.state.author.uid === this.props.currentUser.uid ?
                        <Grid item>
                          <IconButton className={this.props.classes.commentIcon} onClick={this.delete.bind(this)}>
                            <Delete />
                          </IconButton>
                        </Grid> : null
                      }
                      {
                        this.props.currentUser.roles.indexOf('moderator') > -1 ?
                        <Grid item>
                          <IconButton className={this.props.classes.commentIcon}>
                            <Build />
                          </IconButton>
                        </Grid> : null
                      }
                      </Grid>
                  </Grid> : null
                }
              </Grid>
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
  
  const comments = props.comments.map((comment, index) => (
    <Comment
      id={comment.id}
      authorRef={comment.author}
      created={comment.created}
      content={comment.content}
      classes={props.classes}
      currentUser={props.user}
      getFirestore={props.getFirestore}
      lastItem={index === props.comments.length - 1}
    />
  ));
  return <List className={props.classes.root}>{comments}</List>;
}

export default withStyles(styles)(CommentList);
