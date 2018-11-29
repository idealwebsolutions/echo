import ready from 'document-ready';
import React from 'react';
import { render } from 'react-dom';

import App from './components/app';

import { RootElement } from './constants';

ready(() => {
  const rootElement = document.querySelector(`#${RootElement}`);
  
  if (!rootElement) {
    throw new Error(`Root element (#${RootElement}) was not found. Unable to display comments`);
  }

  render(
    <App 
      firebaseApiKey={rootElement.getAttribute('data-firebase-apikey') || ''}
      firebaseProjectId={rootElement.getAttribute('data-firebase-projectid') || ''}
      firebaseMessagingSenderId={rootElement.getAttribute('data-firebase-messagingsenderid') || ''} 
    />, rootElement
  );
});
