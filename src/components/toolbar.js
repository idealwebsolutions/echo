import React from 'react';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  item: {
    'text-align': 'center'
  }
};

const Toolbar = (props) =>
  <nav className="main-toolbar">
    <Grid container spacing={24} direction="row" justify="space-between" alignItems="baseline">
      <Grid className={props.classes.item} item xs={3}>
        <Typography variant="subtitle1">
          {props.totalComments} comments
        </Typography>
      </Grid>
      <Grid className={props.classes.item} item xs={3}>
        <FormControl>
          <Select value="new" inputProps={{ name: "sort" }}>
            <MenuItem value="new">Newest</MenuItem>
            <MenuItem value="best">Best</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  </nav>

export default withStyles(styles)(Toolbar);
