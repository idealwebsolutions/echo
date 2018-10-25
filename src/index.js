import ready from 'document-ready';
import { render } from 'inferno';

import App from './components/app';

ready(() => {
  const rootElement = document.querySelector('#echo-thread');
  
  if (!rootElement) {
    throw new Error('Root element (#echo-thread) was not found. Unable to display comments');
  }

  const configRoot = rootElement.getAttribute('config-root');
  
  render(<App configRoot />, rootElement);
})
