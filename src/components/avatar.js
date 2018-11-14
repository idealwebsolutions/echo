import { createHash } from 'crypto';
import React from 'react';
import Image from 'react-image-resizer';
import Style from 'style-it';
import uuidv4 from 'uuid/v4';
import hashicon from 'hashicon';

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
    if (!this.props.user.avatar) {
      this.generateTempIcon(this.props.user);
    }
  }

  generateTempIcon (user) {
    const hash = createHash('sha1').update(user.name).toString('hex');
    const icon = hashicon(hash, 64);
    const frame = document.querySelector('#echo-content');
    frame.contentDocument.body.querySelector(`[id='${this.state.uid}']`).appendChild(icon);
  }

  render () {
    return this.props.user.avatar ? 
      <Image src={this.props.user.avatar} height={64} width={64}/> : <GenericAvatar id={this.state.uid} />;
  }
}

export default Avatar;
