import React from 'react';
import Icon from '@material-ui/core/Icon';
import { withStyles } from '@material-ui/core/styles';
import Style from 'style-it';

const styles = {
  placeholder: {
    'text-align': 'center',
    padding: '20px 10px'
  },
  icon: {
    'font-size': '3rem'
  }
};

const Placeholder = (props) => (
  <Style>
    {`
      .placeholder {
        text-align: center;      
        padding: 20px 10px;
      }

      .placeholder > .icon {
        font-size: 3rem;
        margin-bottom: 0;
      }

      .placeholder > .title {
        margin-top: -5px;
        box-sizing: border-box;
      }
    `}
    <div className="placeholder">
      <Icon className="icon">{props.icon}</Icon>
      <h3 className="title">{props.title}</h3>
    </div>
  </Style>
)

export default (props) => (
  <Placeholder title={props.title} icon={props.icon}></Placeholder>
)
