import React from 'react';
import { withStyles } from '@material-ui/core/styles'; 
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = {
  loading: {
    width: 60,
    marginLeft: 'auto',
    marginRight: 'auto'
  }
};

const Loading = (props) => (
  <div className={props.classes.loading}>
    <CircularProgress color="primary" width={60} height={60} />
  </div>
);

export default withStyles(styles)(Loading);
