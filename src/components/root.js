import { Fragment } from 'inferno';

import Toolbar from './toolbar';
import TextEditor from './editor';
import CommentList from './comment';

export default (props) =>
  <Fragment>
    <header>
      <Toolbar />
    </header>
    <main>
      <TextEditor fb={props.fb} />
      <CommentList fb={props.fb} />
    </main>
    <footer>
    </footer>
  </Fragment>
