import { Fragment } from 'inferno';
// import Select from 'react-select';
import Style from 'style-it';

const Level = ({ children }) => (
  <Style>
    {` 
      .level { 
        display: flex;
        justify-content: space-between;
        width: 100%;
        padding: 1px;
        margin-bottom: 5px;
      } 
    `}
    <nav className="level">{children}</nav>
  </Style>
)

const LevelItem = ({ props, children }) => (
  <Style>
    {`
      .level-item {
        flex: props.flex;
      }
    `}
    <div className="level-item">{children}</div>
  </Style>
)

const options = [
  { value: 'new', label: 'Sort by Newest' },
  { value: 'old', label: 'Sort by Oldest' },
  { value: 'best', label: 'Sort by Best' }
]

export default (props) =>
  <Fragment>
    <Level>
      <LevelItem flex={5}>0 comments</LevelItem>
      <LevelItem flex={1}>
        <select>
          <option value="old">Sort by oldest</option>
        </select>
      </LevelItem>
    </Level>
  </Fragment>
