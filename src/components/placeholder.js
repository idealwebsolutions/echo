import { Fragment } from 'inferno';
import Style from 'style-it';

const Placeholder = (props) => (
  <Style>
    {`
      .placeholder {
        text-align: center;      
        padding: 10px;
      }

      .placeholder > .icon {
        font-size: 3rem;
        margin-bottom: 0;
      }

      .placeholder > .title {
        margin-top: -5px;
      }
    `}
    <div class="placeholder">
      <i className="icon ion-md-text"></i>
      <h3 className="title">{props.title}</h3>
    </div>
  </Style>
)

export default (props) => (
  <Placeholder title={props.title}></Placeholder>
)
