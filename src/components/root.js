import { Fragment } from 'inferno';

import Toolbar from './toolbar';
import Editor from './editor';
import CommentList from './comment';

export default () =>
  <Fragment>
    <header>
      <Toolbar />
    </header>
    <main>
      <Editor />
      <CommentList />
    </main>
    <footer>
    </footer>
  </Fragment>
