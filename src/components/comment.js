import React from 'react';
import ShowMoreText from 'react-show-more-text';
import ReactMarkdown from 'react-markdown';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import { withStyles } from '@material-ui/core/styles';
import spacetime from 'spacetime';

import Placeholder from './placeholder';
import CustomAvatar from './avatar';

const styles = {
  root: {
    width: '100%'
  },
  commentAuthor: {
    display: 'inline',
    'margin-right': 15
    //color: '#FF5733',
    //'font-weight': 'bold'
  },
  commentIcon: {
    'font-size': '1.5rem',
    cursor: 'pointer'
  },
  footer: {
    'font-size': '0.9rem'
  }
};

/* .icon:not(:first-child):not(:last-child) { margin-left: 15px; margin-right: 15px} */

class Comment extends React.Component {
  constructor () {
    super();
    this.state = {
      ready: false,
      author: null
    };
  }

  componentDidMount () {
    this.setState({ ready: false });
    this.props.fetchUser(this.props.uid, (snapshot) => this.setState({ 
      author: snapshot.val(), 
      ready: true 
    }));
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
              {spacetime(this.props.created).fromNow().qualified}
            </React.Fragment>
          }
          secondary={
            <React.Fragment>
              <header>
                <ReactMarkdown 
                  source={this.props.content}
                  disallowedItems={['link', 'linkReference']}
                />
              </header>
              <footer className={this.props.classes.footer}>
                <Grid container spacing={24}>
                  <Grid item>
                    <Icon className={this.props.classes.commentIcon}>keyboard_arrow_up</Icon>
                  </Grid>
                  <Grid item>
                    <Icon className={this.props.classes.commentIcon}>keyboard_arrow_down</Icon>
                  </Grid>
                  <Grid item>
                    <Icon className={this.props.classes.commentIcon}>flag</Icon>
                  </Grid>
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
      fetchUser={props.fetchUser}
      classes={props.classes}
      uid={comment.uid}
      created={comment.created}
      upvotes={comment.upvotes}
      downvotes={comment.downvotes}
      content={comment.content}
    />
  ));
  return (<List className={props.classes.root}>{comments}</List>);
}

export default withStyles(styles)(CommentList);
