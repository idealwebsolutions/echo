import { Fragment } from 'inferno';
import Style from 'style-it';

import LoginScreen from './login';

const Level = ({ children }) => (
  <Style>
    {` 
      .level { 
        display: flex;
        padding: 10px;
        border-bottom: 2px #000000 solid;
      } 
    `}
    <nav className="level">{children}</nav>
  </Style>
)

const LevelItem = ({ children }) => (
  <Style>
    {`
      .level-item {
        flex: 1 auto;
      }
    `}
    <div className="level-item">{children}</div>
  </Style>
)

export default (props) =>
  <Fragment>
    <Level>
      <LoginScreen config={props.config} />
    </Level>
  </Fragment>
