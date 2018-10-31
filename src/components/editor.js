import { Component, Fragment } from 'inferno';
// import ReactMarkdown from 'react-markdown';
import Style from 'style-it';

const StyledEditor = ({ state }) => (
  <Style>
    {`
      .editor {
        resize: none;
        margin: 8px 0;
        padding: 15px 15px 10px 15px;
        width: 95%;
        border: 2px solid #adafbd;
        border-bottom: none;
      }
    `}
    <textarea 
      name='post' 
      className='editor'
      rows={4}
      placeholder='Add to the discussion...'
    />
  </Style>
)

const ActionBar = ({ children }) => (
  <Style>
    {`
      .action-bar {
        display: flex;
        margin-top: -8px;
        padding: 5px;
        height: 30px;
        width: 98.2%;
        background-color: #adafbd;
        border: 2px solid #adafbd;
      }
    `}
    <div className='action-bar'>{children}</div>
  </Style>
)

class Editor extends Component {
  constructor (props) {
    super(props);

    this.state = {
      ready: false,
      post: ''
    };
  }

  updatePost ({ target }) {
    console.log(target)
  }

  render () {
    return (
      <Fragment>
        <StyledEditor {...this.state} />
        <ActionBar>
        </ActionBar>
      </Fragment>
    );
  }
}

export default Editor;
