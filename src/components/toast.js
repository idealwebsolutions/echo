import React from 'react';
import PropTypes from 'prop-types';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import IconButton from '@material-ui/core/IconButton';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import WarningIcon from '@material-ui/icons/Warning';
import ErrorIcon from '@material-ui/icons/Error';
import CloseIcon from '@material-ui/icons/Close';
import Fade from '@material-ui/core/Fade';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import red from '@material-ui/core/colors/red';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  success: {
    backgroundColor: green[600]
  },
  warning: {
    backgroundColor: amber[700]
  },
  error: {
    backgroundColor: red[800]
  },
  message: {
    display: 'flex',
    alignItems: 'center'
  },
  icon: {
    opacity: 0.9,
    marginRight: '3px'
  }
};

const IconVariant = {
  success: CheckCircleIcon,
  error: ErrorIcon,
  warning: WarningIcon
};

const Toast = (props) => {
  const Icon = IconVariant[props.variant];
  return (
    <Snackbar 
      open={props.open}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center'
      }}
      onClose={props.onClose}
      autoHideDuration={5000}>
      <SnackbarContent 
        className={props.classes[props.variant]}
        aria-describedby="Toast display"
        message={
          <span className={props.classes.message}>
            <Icon className={props.classes.icon}/>
            { props.message }
          </span>
        } /> 
    </Snackbar>
  );
};

Toast.propTypes = {
  variant: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default withStyles(styles)(Toast);
