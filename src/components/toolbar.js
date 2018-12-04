import React from 'react';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import { withStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const styles = {
  commentCountContainer: {
    'padding-left': 20
  },
};

const Toolbar = (props) =>
  <nav className="main-toolbar">
    <Grid container spacing={16} direction="row" justify="space-between" alignItems="baseline">
      <Grid className={props.classes.commentCountContainer} item xs={9}>
        <span>{props.totalComments} comments</span>
      </Grid>
      <Grid item xs={3}>
        <FormControl>
          <Select value='new' inputProps={{ name: 'sort' }}>
            <MenuItem value='new'>Newest</MenuItem>
            <MenuItem value='best'>Best</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  </nav>

export default withStyles(styles)(Toolbar);
