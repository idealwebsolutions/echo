import React from 'react';
import Files from 'react-files';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import { auth } from 'firebase/app';
import Style from 'style-it';

import LoginScreen from './login';
import Loading from './loading';
import ActionButton from './button';

import { importStorage } from '../firebase';
import { Attachments } from '../constants';

const Preview = React.lazy(() => import('react-markdown'));
const ImageAvatar = React.lazy(() => import('./avatar'));

const Editor = (props) => (
  <Style>
    {`
      .editor textarea {
        padding: 10px;
        width: 100%;
        max-width: 100%;
      }

      .editor .editor-toolbar {
        margin-top: -15px;
      }

      .editor .editor-toolbar .btn {
        border: none;
        box-shadow: none;
        background-color: transparent;
      }

      .editor .editor-toolbar .icon {
        font-size: 1.7rem;
      }
    `}
    <form className="editor" noValidate autoComplete="off">
      <TextField
        label="Add to the discussion"
        name="post"
        rows={4}
        fullWidth
        multiline
        variant="outlined"
        margin="normal"
        value={props.post}
        onChange={props.onChange}
        disabled={!props.user}
      />
      { props.user ? 
        <div className="editor-toolbar">
          <Files 
            accepts={['image/*']}
            onError={(err) => console.error(err)}
            onChange={props.handleAssetInput}>
            <button className='btn'>
              <i className='icon ion-md-images'></i>
            </button>
          </Files>
        </div> : null 
      }
    </form>
  </Style>
)

const ActionBar = (props) => (
  <Style>
    {`
      .action-bar {
        min-height: 40px;
        width: 100%;
        max-width: 100%;
        background-color: transparent;
        /*border: 2px solid #adafbd;*/
      }
    `}
    <div className='action-bar'>{props.children}</div>
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
      post: ''
    };
    this.storage = null;
  }

  handleTextInput ({ target }) {
    this.setState({ 
      post: target.value, 
      preview: false
    });
  }

  handleAssetInput (files) {
    const storageRef = this.storage.ref();
    const file = files[0];
    const uploadTask = storageRef.child(`${Attachments}/${file.name}`).put(file, {
      contentType: file.type
    });
    uploadTask.then((snapshot) => {
      snapshot.ref.getDownloadURL().then((downloadURL) => {
        this.setState({ 
          post: this.state.post.concat(`\n![user attachment](${downloadURL})\n`)
        })
      });
    });
    uploadTask.catch((err) => {
      console.error(err);
    });
  }

  previewPost () {
    this.setState({ preview: true });
  }

  submitPost () {
    if (!this.props.user || !this.state.preview) {
      return;
    }

    const users = this.props.fb.database().ref(`/users/${this.props.user.uid}`);
    users.set({
      name: this.props.user.name,
      avatar: this.props.user.avatar
    })
    .then(() => console.log('created new user'))
    .catch((err) => console.error(err));

    const newThread = this.props.fb.database().ref('/forums/demo/threads').push();
    newThread.set({
      uid: this.props.user.uid,
      created: Date.now(),
      content: this.state.post,
      upvotes: 0,
      downvotes: 0
    })
    .then(() => console.log('created new post'))
    .catch((err) => console.error(err));
  }

  componentWillMount () {
    importStorage().then(() => {
      this.storage = this.props.fb.storage();
    })
  }

  render () {
    return (
      <React.Fragment>
        { this.props.user ? 
          <Level>
            <LevelItem flex={1}>
              <React.Suspense fallback={Loading}>
                <ImageAvatar user={this.props.user} />
              </React.Suspense>
            </LevelItem>
            <LevelItem flex='5 auto'>
              { this.state.preview ? 
                <React.Suspense fallback={Loading}>
                  <Preview source={this.state.post} />
                </React.Suspense> : <Editor post={this.state.post} user={this.props.user} handleAssetInput={this.handleAssetInput.bind(this)} onChange={this.handleTextInput.bind(this)} />
              }
            </LevelItem>
          </Level> : <Editor post={this.state.post} user={this.props.user} handleAssetInput={this.handleAssetInput.bind(this)} onChange={this.handleTextInput.bind(this)} /> 
        }
        <ActionBar>
          { this.props.user ? 
              <ActionButton
                onClick={!this.state.preview ? this.previewPost.bind(this) : this.submitPost.bind(this) } 
                color='primary'
                value={this.state.preview ? `Post as ${this.props.user.name}` : 'Preview'} /> : null 
          }
              <LoginScreen fb={this.props.fb} updateAuthState={this.props.updateAuthState} />
        </ActionBar>
      </React.Fragment>
    );
  }
}

export default TextEditor;
