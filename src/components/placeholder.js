import React from 'react';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  placeholder: {
    textAlign: 'center',
    padding: '20px 10px'
  },
  icon: {
    fontSize: '3rem'
  },
  title: {
    marginTop: -1
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
