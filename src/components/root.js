import React from 'react';

import Toolbar from './toolbar';
import TextEditor from './editor';
import CommentList from './comment';

export default (props) =>
  <React.Fragment>
    <header>
      <Toolbar />
    </header>
    <main>
      <TextEditor fb={props.fb} user={props.user} updateAuthState={props.updateAuthState} />
      <CommentList fb={props.fb} />
    </main>
    <footer>
    </footer>
  </React.Fragment>
