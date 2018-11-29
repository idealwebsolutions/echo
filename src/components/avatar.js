import React from 'react';
import Image from 'react-image-resizer';
// import Avatar from '@material-ui/core/Avatar';
import Style from 'style-it';
import uuidv4 from 'uuid/v4';

const GenericAvatar = (props) => (
  <Style>
    {`
      .avatar {
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
    `}
    <div id={props.id} className="avatar"></div>
  </Style>
);

class Avatar extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      uid: uuidv4() 
    };
  }

  componentDidMount () {
  }

  render () {
    return this.props.user.avatar ? 
      <Image src={this.props.user.avatar} height={64} width={64}/> : <GenericAvatar id={this.state.uid} />;
  }
}

export default Avatar;
