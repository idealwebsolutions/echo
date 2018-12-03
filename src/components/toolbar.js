import React from 'react';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

export default (props) =>
  <nav>
    <Grid container direction="row" justify="space-between" alignItems="baseline">
      <Grid item xs={5}>
        <span>{props.totalComments} comments</span>
      </Grid>
      <Grid item xs={1}>
        <FormControl>
          <Select value='new' inputProps={{ name: 'sort' }}>
            <MenuItem value='new'>Newest</MenuItem>
            <MenuItem value='best'>Best</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  </nav>
