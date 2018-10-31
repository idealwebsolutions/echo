import { Component, Fragment } from 'inferno';
import { withDatabase } from './firebase';

class Comment extends Component {
  constructor (props) {
    super(props);
  }
}

class CommentList extends Component {
  constructor (props) {
    super(props);
  }
}

export default withDatabase(CommentList);
