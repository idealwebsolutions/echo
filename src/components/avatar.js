import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import { withStyles } from '@material-ui/core/styles';
import randomMC from 'random-material-color';
import PropTypes from 'prop-types';

const styles = {
  root: {
    width: 64,
    height: 64,
    backgroundColor: randomMC.getColor()
  }
};

const CustomAvatar = (props) => {
  if (props.staticSizing) {
    return <Avatar alt={props.alt} src={props.src} />;
  }
  
  return ( props.src ?
    <Avatar alt={props.alt} src={props.src} className={props.classes.root} /> 
    : <Avatar alt={props.alt} className={props.classes.root}>{props.alt[0].toUpperCase()}</Avatar>
  );
}

CustomAvatar.defaultProps = {
  staticSizing: false,
  alt: 'avatar'
};

CustomAvatar.propTypes = {
  staticSizing: PropTypes.bool,
  alt: PropTypes.string.isRequired,
  src: PropTypes.string
};

export default withStyles(styles)(CustomAvatar);
