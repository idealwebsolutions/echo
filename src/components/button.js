import React from 'react';
import Button from '@material-ui/core/Button';
import Style from 'style-it';

const ActionButton = (props) => (
  <Style>
  {`
    .button button {
      width: 100%;
    }
  `}
   <div className='button'>
    <Button id={props.id} color={props.color} onClick={props.onClick}>{props.value}</Button>
   </div>
  </Style>
)

export default ActionButton;
