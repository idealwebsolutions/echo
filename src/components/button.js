import React from 'react';
import Style from 'style-it';

const Button = (props) => (
  <Style>
  {`
    .button-container button {
      width: 100%;
      font-size: 1.2rem;
      padding: 15px;
      border: none;
      border-radius: 3px;
      background-color: transparent;
    }
  `}
   <div className='button-container'>
    <button onClick={props.onClick}>{props.value}</button>
   </div>
  </Style>
)

export default Button;
