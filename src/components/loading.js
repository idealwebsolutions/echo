import React from 'react';
import { withStyles } from '@material-ui/core/styles'; 
import Loader from 'react-loader-spinner';

const styles = {
  loading: {
    width: 60,
    'margin-left': 'auto',
    'margin-right': 'auto'
  }
};

const Loading = (props) => (
  <div className={props.classes.loading}>
    <Loader type="Oval" color="#000" width={60} height={60} />
  </div>
);

export default withStyles(styles)(Loading);
