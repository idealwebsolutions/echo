import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import deepOrange from '@material-ui/core/colors/deepOrange';
import Style from 'style-it';

const ImageAvatar = (props) => (
  <Style>
    {`
      .avatar {
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 64px;
        height: 64px;
      }
    `}
    <Avatar alt={props.user.name} src={props.user.avatar} className="avatar" height={64} width={64} />
  </Style>
);

const IconAvatar = (props) => {
  <Style>
    {`
      .avatar {
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 64px;
        height: 64px;
        backgroundColor: ${deepOrange[500]};
      }
    `}
    <Avatar alt={props.user.name} className="avatar">${props.user.name[0].toUpperCase()}</Avatar>
  </Style>
}

export default ImageAvatar;
