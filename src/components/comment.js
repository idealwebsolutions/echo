import React from 'react';
import ReactMarkdown from 'react-markdown';
import ShowMore from "@tedconf/react-show-more";
import Grid from '@material-ui/core/Grid';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import FormControl from '@material-ui/core/FormControl';
import MoreVertIcon from '@material-ui/icons/MoreVert';
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
import CommentIcon from '@material-ui/icons/Comment';
import Build from '@material-ui/icons/Build';
import Fade from '@material-ui/core/Fade';
import Grow from '@material-ui/core/Grow';
import withWidth from '@material-ui/core/withWidth';
import { withStyles } from '@material-ui/core/styles';
import approximate from 'approximate-number';

import Avatar from './avatar';
import Placeholder from './placeholder';

import {
  emojify, 
  isBiggerViewport, 
  timeSince 
} from '../util';

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
  commentUpvoteDownvote: {
    marginTop: 12
  },
  footer: {
    fontSize: '0.9rem'
  },
  actionButton: {
    padding: 30
  },
  textButton: {
    display: 'flex',
    alignItems: 'center'
  },
  placeholderContainer: {
    textAlign: 'center',
    padding: '20px 10px'
  },
  placeholderContent: {
    padding: '10px 0 10px 0'
  },
  placeholderIcon: {
    fontSize: '3rem'
  },
  placeholderTitle: {
    marginTop: -1
  }
};

class Comment extends React.Component {
  constructor () {
    super();
    this.state = {
      ready: false,
      processing: false,
      author: null,
      upvotes: 0,
      downvotes: 0,
      report: null,
      hidden: false,
      replyMode: false,
      optionsAnchor: null,
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

    this.props.removePost(this.props.id, () => this.setState({
      processing: false  
    }));
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

  beginReply () {
    this.setState({
      replyMode: true
    });
  }

  toggleProfile () {
  }

  toggleHide () {
    console.log('toggle hide');
    this.setState({ 
      hidden: !this.state.hidden
    });
  }

  openOptions (event) {
    this.setState({
      optionsAnchor: event.currentTarget
    });
  }

  closeOptions () {
    this.setState({
      optionsAnchor: null
    });
  }

  render () {
    if (!this.state.ready || (this.state.ready && this.state.processing)) {
      return (
        <ListItem alignItems="flex-start" divider={!this.props.lastItem}>
          <Placeholder rows={3} ready={this.state.ready && !this.state.processing}>{null}</Placeholder>
        </ListItem>
      );
    }
    
    return (
      <ListItem alignItems="flex-start" divider={!this.props.lastItem}>
        <ListItemAvatar>
          <Avatar alt={this.state.author.name} src={this.state.author.avatar} />
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
              <ReactMarkdown 
                source={emojify(this.props.content)}
                disallowedItems={['link', 'linkReference', 'image', 'imageReference', 'html']}
              />
              <footer className={this.props.classes.footer}>
                <Grid container justify="space-between">
                  <Grid item>
                    <Grid container spacing={8}>
                          { 
                            this.state.upvotes > 0 ? 
                            <Grid item className={this.props.classes.commentUpvoteDownvote}>
                              <Typography component="span">{approximate(this.state.upvotes)}</Typography>
                            </Grid> : null
                          }
                          <Grid item>
                            <IconButton color={this.state.currentUserVoted && this.state.currentUserVoted.positive ? 'primary' : 'default'} disabled={this.state.processing || !this.props.currentUser} onClick={this.toggleVote.bind(this)} aria-label="upvote" className={this.props.classes.commentIcon}>
                              <ThumbUp />
                            </IconButton>
                          </Grid>
                          { 
                            this.state.downvotes > 0 ? 
                            <Grid item className={this.props.classes.commentUpvoteDownvote}>
                              <Typography component="span">{approximate(this.state.downvotes)}</Typography>
                            </Grid> : null
                          }
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
                          { 
                            this.props.currentUser && isBiggerViewport(this.props.width) ? 
                            <Grid item className={this.props.classes.textButton}>
                              <Button onClick={this.beginReply.bind(this)}>REPLY</Button>
                            </Grid> : null
                          }
                        </Grid>
                      </Grid>
                      {
                        this.props.currentUser ?
                        <Grid item>
                          { 
                            isBiggerViewport(this.props.width) ?
                              (
                                <Grid container spacing={8}>
                                {
                                  this.props.currentUser.roles.indexOf('moderator') > -1 ||
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
                              ) :
                              (
                                <div>
                                  <IconButton className={this.props.classes.commentIcon} onClick={this.openOptions.bind(this)}>
                                    <MoreVertIcon />
                                  </IconButton>
                                  <Menu
                                    id="options"
                                    open={Boolean(this.state.optionsAnchor)}
                                    anchorEl={this.state.optionsAnchor}
                                    onClose={this.closeOptions.bind(this)}
                                    PaperProps={{
                                      style: {
                                        maxHeight: 48 * 4.5,
                                        width: 200,
                                      }
                                    }}>
                                    <MenuItem onClick={this.closeOptions.bind(this)}>
                                      Reply
                                    </MenuItem>
                                    <MenuItem onClick={this.closeOptions.bind(this)}>
                                      Edit
                                    </MenuItem>
                                    <MenuItem onClick={() => { 
                                      this.delete(); 
                                      this.closeOptions();
                                    }}>
                                      Delete
                                    </MenuItem>
                                    { 
                                      this.props.currentUser.roles.indexOf('moderator') > -1 ? 
                                        <MenuItem>Moderate</MenuItem> : null
                                    }
                                  </Menu>
                                </div>
                              )
                          }
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
  // TODO: handle locked state
  if (!props.totalCommentsCount) {
    return ( 
      <div className={props.classes.placeholderContainer}>
        <CommentIcon className={props.classes.placeholderIcon} />
        <Typography variant="h6" className={props.classes.placeholderTitle}>
          No Comments Found
        </Typography>
      </div>
    );
  }

  return (
    <List className={props.classes.root}>
      <ShowMore 
        items={props.comments}
        by={10}
        replace>
          {({ current, onMore }) => (
            <React.Fragment>
              { 
                current.map((comment, index) => 
                  <Comment
                    id={comment.id}
                    authorRef={comment.author}
                    created={comment.created}
                    content={comment.content}
                    classes={props.classes}
                    currentUser={props.user}
                    removePost={props.removePost}
                    getFirestore={props.getFirestore}
                    lastItem={index === props.comments.length - 1}
                    width={props.width} />) 
              }
              { 
                props.comments.length < props.totalCommentsCount ? 
                  <ListItem alignItems="center" button>
                    <ListItemText color="textPrimary" primary="Load more" />
                  </ListItem> : null
              }
            </React.Fragment>
          )}
      </ShowMore>
    </List>
  );
}

export default withStyles(styles)(withWidth()(CommentList));
