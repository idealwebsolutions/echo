import React from 'react';
import ShowMoreText from 'react-show-more-text';
import ReactMarkdown from 'react-markdown';
import { withStyles } from '@material-ui/core/styles';
import spacetime from 'spacetime';

import Placeholder from './placeholder';
import Avatar from './avatar';

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
  comment: {
    padding: 10
  }
};

const Comment = (props) => (
      /*.comment-avatar {
        flex: 1;
      }

      .comment-container {
        flex: 2 auto;
        margin-left: 15px;
      }

      .comment-header, .comment-footer {
        display: flex;
        flex-direction: row;
        font-size: 0.9rem;
      }

      .comment-author {
        color: #FF5733;
        font-weight: bold;
      }

      .comment-date {
        margin-left: 15px;
      }

      .comment-footer > .icon {
        font-size: 1.5rem;
        cursor: pointer;
      }

      .comment-footer > .icon:not(:first-child):not(:last-child) {
        margin-left: 15px;
        margin-right: 15px;
      }*/
    <li key={props.id} className="comment">
      <Avatar className="comment-avatar" user={props.user} />
      <article className="comment-container">
        <header className="comment-header">
          <span className="comment-author">{props.user.name}</span>
          <span className="comment-date">{spacetime(props.date).fromNow().qualified}</span>
        </header>
        <ReactMarkdown 
          className="comment-body" 
          source={props.content}
          skipHtml={true}
        />
        <footer className="comment-footer">
          <i className="icon ion-ios-arrow-up"></i>
          <i className="icon ion-ios-arrow-down"></i>
          <i className="icon ion-ios-flag"></i>
        </footer>
      </article>
    </li>
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

  return (<ul className="comments">{comments}</ul>);
}

export default withStyles(styles)(CommentList);
