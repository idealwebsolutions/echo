import React from 'react';
import Files from 'react-files';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Hidden from '@material-ui/core/Hidden';
import { withStyles } from '@material-ui/core/styles';
import { auth } from 'firebase/app';

import LoginScreen from './login';
import Loading from './loading';

import { importStorage } from '../firebase';
import { Attachments } from '../constants';
import { generatePostsUrl } from '../util';

const Preview = React.lazy(() => import('react-markdown'));
const ImageAvatar = React.lazy(() => import('./avatar'));

const styles = {
  editor: {
    padding: 10,
    width: '100%'
  },
  avatar: {
    padding: '50px 25px !important'
  },
  actionBar: {
    'min-height': 40,
    'margin-top': 20
  }
};

const Editor = (props) => (
  <form className={props.classes.editor} noValidate autoComplete="off">
    <TextField
      fullWidth
      label="Add to the discussion"
      name="post"
      rows={4}
      multiline
      margin="normal"
      variant="outlined"
      value={props.post || ''}
      onChange={props.handleInputChange}
      disabled={!props.user}
    />
  </form>
);

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

  togglePreview (preview) {
    this.setState({ preview });
  }

  submitPost () {
    if (!this.props.user || !this.state.preview) {
      return;
    }

    const newPost = this.props.fb.database().ref(generatePostsUrl('demo')).push();
    newPost.set({
      uid: this.props.user.uid,
      content: this.state.post,
      reply: null
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
          <Grid container spacing={24}>
            <Hidden xsDown>
              <Grid className={this.props.classes.avatar} item xs={2}>
                <React.Suspense fallback={Loading}>
                  <ImageAvatar user={this.props.user} />
                </React.Suspense>
              </Grid>
            </Hidden>
            <Grid item xs={12} sm={10}>
              { this.state.preview ? 
                <React.Suspense fallback={Loading}>
                  <Preview disallowedTypes={['link', 'linkReference']} source={this.state.post} />
                </React.Suspense> : <Editor classes={this.props.classes} post={this.state.post} user={this.props.user} handleInputChange={this.handleTextInput.bind(this)} />
              }
              <Grid className={this.props.classes.editorToolbar} spacing={16} justify="space-between" container>
                <Grid item>
                  <Files 
                    accepts={['image/*']}
                    onError={(err) => console.error(err)}
                    onChange={this.handleAssetInput.bind(this)}>
                    <Button color="primary">
                      Upload
                    </Button>
                  </Files>
                </Grid>
                <Grid item>
                  <Button color="primary" onClick={this.state.preview ? this.submitPost.bind(this) : this.togglePreview.bind(this, true)}>{this.state.preview ? 'Submit' : 'Preview'}</Button>
                </Grid>
                {
                  this.state.preview ? 
                  <Grid item>
                    <Button color="primary" onClick={this.togglePreview.bind(this, false)}>Edit</Button>
                  </Grid> : null
                }
              </Grid>
            </Grid>
          </Grid> : <Editor classes={this.props.classes} user={this.props.user} onChange={() => {}} /> 
        }
        <div className={this.props.classes.actionBar}>
          <LoginScreen fb={this.props.fb} updateAuthState={this.props.updateAuthState} />
        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(TextEditor);
