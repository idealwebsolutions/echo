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
}; // should generate random background color

/* display: flex, 
  * flex-direction: column, 
  * justify-content: center */

const CustomAvatar = (props) => ( props.user.avatar ?
  <Avatar alt={props.user.name} src={props.user.avatar} className={props.classes.avatar} /> 
  : <Avatar alt={props.user.name} className={props.classes.avatar.concat(props.classes.textAvatar)}>${props.user.name[0].toUpperCase()}</Avatar>
);

export default withStyles(styles)(CustomAvatar);
