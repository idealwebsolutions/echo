import Loader from 'react-loader-spinner';
/*import Style from 'style-it';

const LoaderContainer = ({ children }) => {
  <Style>
    {`
      .loader-container {
        margin-left: 40px;
      }
    `}
     <div className="loader-container">{children}</div>
   </Style>
}*/

const Loading = () => (
  <Loader type="Bars" color="#000" width={60} height={60} />
);

export default Loading;
