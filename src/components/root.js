import { Fragment } from 'inferno';

import Toolbar from './toolbar';
import TextEditor from './editor';
import CommentList from './comment';

export default (props) =>
  <Fragment>
    <header>
      <Toolbar config={props.config} />
    </header>
    <main>
      <TextEditor />
      <CommentList config={props.config} />
    </main>
    <footer>
    </footer>
  </Fragment>
