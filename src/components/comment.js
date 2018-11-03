import { Component, Fragment } from 'inferno';

import Placeholder from './placeholder';
import Icon from './icon';

import Style from 'style-it';

const CommentDisplay = (props) => (
  <Style>
    {`
      .comment {
      }
    `}
    <li className="comment">
      <article>
        <header className="comment-header"></header>
        <footer className="comment-footer"></footer>
      </article>
    </li>
  </Style>
)

class Comment extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    return <CommentDisplay />
  }
}

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

    return (
      <ul class="comments">
        this.state.comments.map((comment) => {
          return <Comment />
        })
      </ul>
    )
  }
}

export default CommentList;
