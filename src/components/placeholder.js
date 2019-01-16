import React from 'react';
import ReactPlaceholder from 'react-placeholder';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  root: {
    width: '100%'
  }
};

const Placeholder = (props) => (
  <ReactPlaceholder className={props.classes.root} type="media" delay={5000} rows={props.rows} ready={props.ready}>
    {props.children}
  </ReactPlaceholder>
);

export default withStyles(styles)(Placeholder);
