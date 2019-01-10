import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import { withStyles } from '@material-ui/core/styles';
import randomMC from 'random-material-color';

const styles = {
  avatar: {
    width: 64,
    height: 64,
    backgroundColor: randomMC.getColor()
  }
};

const CustomAvatar = (props) => ( props.user.avatar ?
  <Avatar alt={props.user.name} src={props.user.avatar} className={props.classes.avatar} /> 
  : <Avatar alt={props.user.name} className={props.classes.avatar}>${props.user.name[0].toUpperCase()}</Avatar> 
);

export default withStyles(styles)(CustomAvatar);
