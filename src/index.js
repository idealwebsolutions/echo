import ready from 'document-ready';
import { render } from 'inferno';

ready(() => {
  const rootElement = document.querySelector('#echo-thread');
  // const opts = root.dataset // 

  if (!root) {
    throw new Error('#echo-thread was not found');
  }
  
  render(null, rootElement);
})
