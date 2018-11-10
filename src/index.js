import ready from 'document-ready';
import React from 'react';
import { render } from 'react-dom';

import App from './components/app';

ready(() => {
  const rootElement = document.querySelector('#echo-thread');
  
  if (!rootElement) {
    throw new Error('Root element (#echo-thread) was not found. Unable to display comments');
  }

  const configPath = rootElement.getAttribute('data-config-path');

  render(<App configPath={configPath} />, rootElement);
});
