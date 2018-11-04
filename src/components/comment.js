import { Component, Fragment } from 'inferno';
// import Loadable from 'inferno-loadable';
import ReactMarkdown from 'react-markdown';
import spacetime from 'spacetime';

import Placeholder from './placeholder';
import Avatar from './avatar';

import Style from 'style-it';

/*
{
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

const Comment = (props) => (
  <Style>
    {`
      .comment {
        display: flex;
        padding: 10px;
      }

      .comment-avatar {
        flex: 1;
      }

      .comment-container {
        flex: 2 auto;
        padding: 15px;
      }
    `}
    <li key={props.id} className="comment">
      <Avatar className="comment-avatar" user={props.user} />
      <article className="comment-container">
        <header className="comment-header">
          <span>{props.user.name}</span>
        </header>
        <ReactMarkdown className="comment-body" source={props.content}></ReactMarkdown>
        <footer className="comment-footer"></footer>
      </article>
    </li>
  </Style>
)

class CommentList extends Component {
  constructor (props) {
    super(props);
    this.state = {
      comments: []
    };
  }

  render () {
    if (!this.state.comments.length) {
      return <Placeholder title="No comments found" icon="ion-md-text" />
    }

    const comments = this.state.comments.map((comment) => (
      <Comment
        id={comment.id}
        user={comment.user}
        date={comment.date}
        upvotes={comment.upvotes}
        downvotes={comment.downvotes}
        content={comment.content}
      />
    ));

    return (<ul className="comments">{comments}</ul>)
  }
}

export default CommentList;
