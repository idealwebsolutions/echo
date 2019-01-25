import React from 'react';
import Files from 'react-files';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Hidden from '@material-ui/core/Hidden';
import Divider from '@material-ui/core/Divider';
import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';
import Done from '@material-ui/icons/Done';
import Edit from '@material-ui/icons/Edit';
import Send from '@material-ui/icons/Send';
import CloudUpload from '@material-ui/icons/CloudUpload';
import { withStyles } from '@material-ui/core/styles';

import Loading from './loading';

import { importStorage } from '../firebase';
import { Attachments, MAX_POST_MESSAGE_LENGTH } from '../constants';
import { noop, emojify } from '../util';

const Preview = React.lazy(() => import('react-markdown'));
const Avatar = React.lazy(() => import('./avatar'));

const styles = {
  root: {
    padding: 10,
    width: '100%'
  },
  editorContainer: {
    marginBottom: 20
  },
  avatar: {
    padding: '50px 25px !important'
  }
};

const Editor = (props) => (
  <form className={props.classes.root} noValidate autoComplete="off">
    <TextField
      fullWidth
      label="Add to the discussion"
      name="post"
      rows={1}
      multiline
      margin="normal"
      value={props.post || ''}
      onChange={props.handleInputChange}
      disabled={!props.user || props.disabled}
    />
  </form>
);

class TextEditor extends React.Component {
  constructor (props) {
    super(props); 
    this.state = {
      preview: false,
      disabled: false,
      post: '',
      attachment: null
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
      snapshot.ref.getDownloadURL().then((downloadURL) => this.setState({ 
        attachment: {
          name: file.name,
          url: downloadURL
        }
      }));
    });
    uploadTask.catch((err) => console.error(err.message, true));
  }

  removeAsset () {
  
  }

  togglePreview (preview) {
    this.setState({ preview });
  }

  submitPost () {
    if (!this.props.user || !this.state.preview) {
      return;
    }

    this.setState({
      disabled: true
    });

    this.props.createPost(this.state.post, () => {
      this.setState({
        post: '',
        attachment: null,
        disabled: false,
        preview: false
      });
      console.log('Comment submitted');
    })
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
          <Grid container spacing={24} className={this.props.classes.editorContainer}>
            <Hidden xsDown>
              <Grid className={this.props.classes.avatar} item xs={2}>
                <React.Suspense fallback={Loading}>
                  <Avatar alt={this.props.user.name} src={this.props.user.avatar} />
                </React.Suspense>
              </Grid>
            </Hidden>
            <Grid item xs={12} sm={10}>
              { this.state.preview ? 
                <React.Suspense fallback={Loading}>
                  <Preview 
                    source={emojify(this.state.post)} 
                    disallowedTypes={['link', 'linkReference', 'image', 'imageReference', 'html']}
                  />
                </React.Suspense> : <Editor disabled={this.state.disabled} classes={this.props.classes} post={this.state.post} user={this.props.user} handleInputChange={this.handleTextInput.bind(this)} />
              }
              { this.state.preview ? <Divider variant="middle" /> : null }
              <Grid className={this.props.classes.editorToolbar} spacing={16} alignItems="center" justify="space-between" container>
                <Grid item>
                { this.state.attachment != null ?
                  <Chip 
                    avatar={
                      <Avatar staticSizing={true} alt={this.state.attachment.name} src={this.state.attachment.url} />
                    }
                    label={this.state.attachment.name}
                    onDelete={this.removeAsset.bind(this)} /> : 
                  <Files 
                    accepts={['image/*']}
                    onError={(err) => console.error(err)}
                    onChange={this.handleAssetInput.bind(this)}>
                    <IconButton variant="contained" color="default">
                      <CloudUpload />
                    </IconButton>
                  </Files>
                }
                </Grid>
                {
                  this.state.preview ? 
                  <Grid item>
                    <IconButton color="default" onClick={this.togglePreview.bind(this, false)}>
                      <Edit />
                    </IconButton>
                  </Grid> : null
                }
                <Grid item>
                  <Grid spacing={8} alignItems="center" justify="flex-end" container>
                    <Grid item>
                      <Typography
                        color={this.state.post.length <= 0 || this.state.post.length > MAX_POST_MESSAGE_LENGTH ? 'error' : 'default'}
                        variant="overline">
                        {this.state.post.length} / {MAX_POST_MESSAGE_LENGTH}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <IconButton 
                        color="primary" 
                        disabled={this.state.post.length <= 0 || this.state.post.length > 256}
                        onClick={this.state.preview ? this.submitPost.bind(this) : this.togglePreview.bind(this, true)}>
                        {this.state.preview ? <Send /> : <Done />}
                      </IconButton>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid> : <Editor disabled={true} classes={this.props.classes} user={this.props.user} onChange={Noop} /> 
        }
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(TextEditor);
