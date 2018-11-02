import { Component, Fragment } from 'inferno';

import Placeholder from './placeholder';
import { withDatabase } from './firebase';

class Comment extends Component {
  constructor (props) {
    super(props);
  }

  render () {
  }
}

class CommentList extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    return <Placeholder title="No comments found"></Placeholder>
  }
}

export default withDatabase(CommentList);
