import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import Typography from '@material-ui/core/Typography';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  appBar: {
    boxShadow: 'none'
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between'
  }
};

const Navigation = (props) =>
  <AppBar position="static" className={props.classes.appBar} color="transparent">
    <Toolbar component="nav" className={props.classes.toolbar}>
      <Typography variant="subtitle1">
        {props.totalComments} comments
      </Typography>
      <div>
        { 
          props.user ?
            <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <MailIcon />
              </Badge>
            </IconButton> 
          : null
        }
        {
          props.user ? 
            <IconButton color="inherit">
              <Badge badgeContent={17} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          : null
        }
        { props.user ? 
            <IconButton color="inherit">
              <AccountCircle />
            </IconButton>
            : <Button variant="default">Sign In</Button>
        }
      </div>
    </Toolbar>
  </AppBar>

export default withStyles(styles)(Navigation);
