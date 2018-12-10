import React from 'react';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  placeholder: {
    'text-align': 'center',
    padding: '20px 10px'
  },
  icon: {
    'font-size': '3rem'
  },
  title: {
    'margin-top': -1
  }
};

const Placeholder = (props) => (
  <div className={props.classes.placeholder}>
    <Icon className={props.classes.icon}>{props.icon}</Icon>
    <Typography variant="h6" className={props.classes.title}>
      {props.title}
    </Typography>
  </div>
);

export default withStyles(styles)(Placeholder);
