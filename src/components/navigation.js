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
    boxShadow: 'none',
    backgroundColor: 'transparent'
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between'
  }
};

class Navigation extends React.Component {
  constructor () {
    super();
    this.state = {
      loginActivated: false
    };
  }
  
  render () {
    return (
      <AppBar position="static" className={this.props.classes.appBar}>
        <Toolbar component="nav" className={this.props.classes.toolbar}>
          <Typography variant="subtitle1">
            Comments ({this.props.totalComments})
          </Typography>
          <div>
          { 
            this.props.user ?
            <IconButton color="default">
              <Badge badgeContent={4} color="secondary">
                <MailIcon />
              </Badge>
            </IconButton> 
            : null
          }
          {
            this.props.user ? 
            <IconButton color="default">
              <Badge badgeContent={17} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            : null
          }
          { 
            this.props.user ? 
            <IconButton color="default">
              <AccountCircle />
            </IconButton>
            : null
          }
        </div>
      </Toolbar>
    </AppBar>
    )
  }
}

export default withStyles(styles)(Navigation);
