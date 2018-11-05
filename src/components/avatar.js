import { createHash } from 'crypto';
import { Component } from 'inferno';
// import Image from 'react-image-resizer';
import Style from 'style-it';
import uuidv4 from 'uuid/v4';
import hashicon from 'hashicon';

const AvatarContainer = (props) => (
  <Style>
    {`
      .avatar-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
    `}
    <div id={props.id} className="avatar-container"></div>
  </Style>
);

class Avatar extends Component {
  constructor (props) {
    super(props);
    this.state = {
      uid: uuidv4() 
    };
  }

  componentDidMount () {
    //if (!user.avatar) {
    this.generateTempIcon(this.props.user);
    //}
  }

  generateTempIcon (user) {
    const hash = createHash('sha1').update(user.name).toString('hex');
    const icon = hashicon(hash, 64);
    const frame = document.querySelector('#echo-content');
    frame.contentDocument.body.querySelector(`[id='${this.state.uid}']`).appendChild(icon);
  }

  render () {
    return <AvatarContainer id={this.state.uid} />;
  }
}

export default Avatar;
