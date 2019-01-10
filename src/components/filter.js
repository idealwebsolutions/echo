import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

class FilterBar extends React.Component {
  constructor () {
    super();
    this.state = {
      mode: 'new'
    };
  }
  
  handleChange (event) {
    this.setState({ mode: event.target.value });
    this.props.sortBy(this.state.mode);
  }
  
  render () {
    return (
      <FormControl>
        <Select value={this.state.mode} onChange={this.handleChange.bind(this)} inputProps={{ name: "sort" }}>
          <MenuItem value="new">Newest</MenuItem>
          <MenuItem value="best">Best</MenuItem>
        </Select>
      </FormControl>
    );
  }
};

export default FilterBar;
