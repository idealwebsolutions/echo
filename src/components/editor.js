import React from 'react';
import Style from 'style-it';

import LoginScreen from './login';
import Loading from './loading';
import Button from './button';

import { importStorage } from '../firebase';

const Preview = React.lazy(() => import('react-markdown'));
const Avatar = React.lazy(() => import('./avatar'));

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
      { this.props.user ? <div className='editor-toolbar'></div> : null }
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

const Level = ({ children }) => (
  <Style>
    {`
      .level {
        display: flex;
      }
    `}
    <div className='level'>{children}</div>
  </Style>
)

const LevelItem = (props) => (
  <Style>
    {`
      .level-item {
        flex: ${props.flex};
      }
    `}
    <div className='level-item'>{props.children}</div>
  </Style>
)

class TextEditor extends React.Component {
  constructor (props) {
    super(props);
    
    this.state = {
      preview: false,
      ready: false,
      post: ''
    };
    this.storage = null;
  }

  handleInput (event) {
    this.setState({ 
      post: event.target.value, 
      preview: false 
    });
  }

  previewPost () {
    this.setState({ preview: true });
  }

  submitPost () {
  
  }

  componentWillMount () {
    if (this.props.user) {
      importStorage().then(() => {
        this.storage = this.props.fb.storage();
        console.log(this.storage);
      })
    }
  }

  render () {
    return (
      <React.Fragment>
        { this.props.user ? 
          <Level>
            <LevelItem flex={1}>
              <React.Suspense fallback={Loading}>
                <Avatar user={this.props.user} />
              </React.Suspense>
            </LevelItem>
            <LevelItem flex='5 auto'>
              { this.state.preview ? 
                <React.Suspense fallback={Loading}>
                  <Preview source={this.state.post} />
                </React.Suspense> : <Editor post={this.state.post} onChange={this.handleInput.bind(this)} />
              }
            </LevelItem>
          </Level> : <Editor post={this.state.post} onChange={this.handleInput.bind(this)} /> 
        }
        <ActionBar>
          { this.props.user ? 
              <Button 
                onClick={this.state.ready ? this.submitPost.bind(this) : this.previewPost.bind(this) } 
                value={this.state.preview ? `Post as ${this.props.user.name}` : 'Preview'} 
              /> : null 
          }
              <LoginScreen fb={this.props.fb} updateAuthState={this.props.updateAuthState} />
        </ActionBar>
      </React.Fragment>
    );
  }
}

export default TextEditor;
