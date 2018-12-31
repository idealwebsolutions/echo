import React from 'react';
import Files from 'react-files';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Hidden from '@material-ui/core/Hidden';
import CloudUpload from '@material-ui/icons/CloudUpload';
import { withStyles } from '@material-ui/core/styles';
import { auth } from 'firebase/app';

import LoginScreen from './login';
import Loading from './loading';

import { importStorage } from '../firebase';
import { Attachments } from '../constants';
import { makeToast } from '../util';

const Preview = React.lazy(() => import('react-markdown'));
const CustomAvatar = React.lazy(() => import('./avatar'));

const styles = {
  root: {
    padding: 10,
    width: '100%'
  },
  avatar: {
    padding: '50px 25px !important'
  },
  actionBar: {
    minHeight: 40,
    marginTop: 20
  }
};

const Editor = (props) => (
  <form className={props.classes.root} noValidate autoComplete="off">
    <TextField
      fullWidth
      label="Add to the discussion"
      name="post"
      rows={2}
      multiline
      margin="normal"
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
    uploadTask.catch((err) => makeToast(err.message, true));
  }

  togglePreview (preview) {
    this.setState({ preview });
  }

  submitPost () {
    if (!this.props.user || !this.state.preview) {
      return;
    }

    return this.props.getFirestore().collection('posts').doc()
    .set({
      topic: 'demo',
      author: this.props.user.uid,
      content: this.state.post,
      reply: null
    }).then(() => {
      this.setState({
        post: '',
        preview: false
      });
      console.log('Comment submitted');
    })
    .catch((err) => makeToast(err.message, true));
  }

  componentWillMount () {
    importStorage().then(() => {
      this.storage = this.props.getStorage();
    }).catch((err) => console.error(err));
  }

  render () {
    return (
      <React.Fragment>
        { this.props.user ? 
          <Grid container spacing={24}>
            <Hidden xsDown>
              <Grid className={this.props.classes.avatar} item xs={2}>
                <React.Suspense fallback={Loading}>
                  <CustomAvatar user={this.props.user} />
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
                    <Button variant="contained" color="default">
                      Upload
                      <CloudUpload />
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
      </React.Fragment>
    );
  }
}

// ref=postId

export default withStyles(styles)(TextEditor);
