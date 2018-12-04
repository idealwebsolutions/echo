import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import { withStyles } from '@material-ui/core/styles';
import deepOrange from '@material-ui/core/colors/deepOrange';

const styles = {
  avatar: {
    width: 64,
    height: 64
  },
  textAvatar: {
    backgroundColor: deepOrange[500]
  }
};

/* display: flex, 
  * flex-direction: column, 
  * justify-content: center */

const ImageAvatar = (props) => (
  <Avatar alt={props.user.name} src={props.user.avatar} className={props.classes.avatar} />
);

const IconAvatar = (props) => (
  <Avatar alt={props.user.name} className={props.classes.avatar.concat(props.classes.textAvatar)}>${props.user.name[0].toUpperCase()}</Avatar>
);

export default withStyles(styles)(ImageAvatar);
