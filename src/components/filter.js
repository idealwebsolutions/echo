import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

const FilterBar = () => (
  <FormControl>
    <Select value="new" inputProps={{ name: "sort" }}>
      <MenuItem value="new">Newest</MenuItem>
      <MenuItem value="best">Best</MenuItem>
    </Select>
  </FormControl>
);

export default FilterBar;
