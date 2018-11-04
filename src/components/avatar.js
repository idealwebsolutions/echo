import { createHash } from 'crypto';
import { Component } from 'inferno';
// import Image from 'react-image-resizer';
import uuidv4 from 'uuid/v4';
import hashicon from 'hashicon';

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
    const icon = hashicon(hash, 78);
    const frame = document.querySelector('#echo-content');
    frame.contentDocument.body.querySelector(`[id='${this.state.uid}']`).appendChild(icon);
  }

  render () {
    return <div id={this.state.uid}></div>;
  }
}

export default Avatar;
