import { Component, Fragment, linkEvent } from 'inferno';
import Loadable from 'inferno-loadable';
import Style from 'style-it';

import Loading from './loading';

const Preview = Loadable({
  loader: () => import('react-markdown'),
  loading: Loading
})

const Editor = (props) => (
  <Style>
    {`
      .editor {
        resize: none;
        margin: 8px 0;
        padding: 10px;
        width: 100%;
        max-width: 100%;
        border: 2px solid #adafbd;
        border-bottom: none;
      }
    `}
    <textarea 
      name='post' 
      className='editor'
      rows={4}
      placeholder='Add to the discussion...'
      value={props.post}
      onInput={props.onInput}
    />
  </Style>
)

const ActionBar = ({ children }) => (
  <Style>
    {`
      .action-bar {
        display: flex;
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

class TextEditor extends Component {
  constructor (props) {
    super(props);

    this.state = {
      ready: false,
      post: ''
    };
  }

  handleInput (component, event) {
    component.setState({ post: event.target.value })
  }

  render () {
    return (
      <Fragment>
        <Editor 
          post={this.state.post} 
          onInput={linkEvent(this, this.handleInput)} 
        />
        <ActionBar>
        </ActionBar>
      </Fragment>
    );
  }
}

export default TextEditor;
