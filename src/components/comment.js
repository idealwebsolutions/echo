import React from 'react';
import ShowMoreText from 'react-show-more-text';
import ReactMarkdown from 'react-markdown';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Icon from '@material-ui/core/Icon';
import { withStyles } from '@material-ui/core/styles';
import spacetime from 'spacetime';

import Placeholder from './placeholder';
import CustomAvatar from './avatar';

/*
Comment {
  id: Number,
  user: {
    avatar: Optional<String>,
    name: String
  },
  date: Number,
  upvotes: Number,
  downvotes: Number,
  content: String
}
*/

const styles = {
  commentAuthor: {
    color: '#FF5733',
    'font-weight': 'bold'
  },
  commentDate: {
    'margin-left': 15
  },
  commentIcon: {
    'font-size': '1.5rem',
    cursor: 'pointer'
  },
  commentHeader: {
    display: 'flex',
    'flex-direction': 'row',
    'font-size': '0.9rem'
  }
};

/* .icon:not(:first-child):not(:last-child) { margin-left: 15px; margin-right: 15px} */

const Comment = (props) => (
  <ListItem key={props.id} alignItems="flex-start">
    <ListItemAvatar>
      <Avatar user={props.user} />
    </ListItemAvatar>
    <ListItemText>
      <article>
        <header className={props.classes.commentHeader}>
          <span className={props.classes.commentAuthor}>{props.user.name}</span>
          <span className={props.classes.commentDate}>{spacetime(props.date).fromNow().qualified}</span>
        </header>
        <ReactMarkdown 
          source={props.content}
          disallowedItems={['link', 'linkReference']}
          skipHtml={true}
        />
        <footer className={props.classes.commentHeader}>
          <Icon className={props.classes.commentIcon}>keyboard_arrow_up</Icon>
          <Icon className={props.classes.commentIcon}>keyboard_arrow_down</Icon>
          <Icon className={props.classes.commentIcon}>flag</Icon>
        </footer>
      </article>
    </ListItemText>
  </ListItem>
)

const CommentList = (props) => {
  if (!props.comments.length) {
    return <Placeholder title="No comments found" icon="comment" />;
  }

  const comments = props.comments.map((comment) => (
    <Comment
      id={comment.id}
      className={props.classes.comment}
      user={comment.user}
      date={comment.date}
      upvotes={comment.upvotes}
      downvotes={comment.downvotes}
      content={comment.content}
    />
  ));

  return (<List className={props.classes.root}>{comments}</List>);
}

export default withStyles(styles)(CommentList);
