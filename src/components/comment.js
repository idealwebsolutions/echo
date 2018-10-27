import { Component, Fragment } from 'inferno';
import { initializeApp } from 'firebase/app';

const loadDatabase = (config) => initializeApp(config).database()

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

export default CommentList;
