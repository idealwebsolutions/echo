import React from 'react';
// import Loadable from 'inferno-loadable';
import Style from 'style-it';

import LoginScreen from './login';
import Loading from './loading';

/*const Preview = Loadable({
  loader: () => import('react-markdown'),
  loading: Loading
})*/

const Editor = (props) => (
  <Style>
    {`
      .editor textarea {
        resize: none;
        margin: 8px 0;
        padding: 10px;
        width: 100%;
        max-width: 100%;
        border: 2px solid #adafbd;
        border-bottom: none;
      }
    `}
    <div className='editor'>
      <textarea 
        name='post' 
        rows={4}
        placeholder='Add to the discussion...'
        value={props.post}
        onChange={props.onChange}
      />
    </div>
  </Style>
)

const ActionBar = ({ children }) => (
  <Style>
    {`
      .action-bar {
        margin-top: -13px;
        min-height: 40px;
        width: 100%;
        max-width: 100%;
        background-color: #adafbd;
        border: 2px solid #adafbd;
      }
    `}
    <div className='action-bar'>{children}</div>
  </Style>
)

class TextEditor extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      ready: false,
      post: ''
    };
  }

  handleInput (event) {
    this.setState({ post: event.target.value })
  }

  render () {
    return (
      <React.Fragment>
        <Editor 
          post={this.state.post} 
          onChange={this.handleInput.bind(this)} 
        />
        <ActionBar>
          <LoginScreen fb={this.props.fb} />
        </ActionBar>
      </React.Fragment>
    );
  }
}

export default TextEditor;
