import React from 'react';
import Icon from '@material-ui/core/Icon';
import Style from 'style-it';

const Placeholder = (props) => (
  <Style>
    {`
      .placeholder {
        text-align: center;      
        padding: 10px;
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
