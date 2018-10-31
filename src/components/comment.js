import { Component, Fragment } from 'inferno';
import withDatabase from './firebase';

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
    return <div></div>
  }
}

export default withDatabase(CommentList);
