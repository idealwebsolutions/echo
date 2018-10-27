import { Dimmer, Loader, Segment } from 'semantic-ui-react';

const Loading = () => (
  <Segment>
    <Dimmer active inverted>
      <Loader />
    </Dimmer>
  </Segment>
);

export default Loading;
