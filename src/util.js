import { get } from 'axios';
import { toast } from 'react-toastify';
// No-op
export const Noop = () => {};
// Creates a custom toast
export const makeToast = (message, error=false, placement={ position: toast.POSITION_BOTTOM_CENTER }) => {
  return error ? toast.error(message, placement) : toast.success(message, placement);
}
// Generates login configuration based on providers
export const generateLoginConfig = (providers = []) => {
  if (!providers.length) {
    throw new RangeError('One login provider must be provided');
  }
  
  return {
    signInFlow: 'popup',
    signInOptions: providers,
    callbacks: {
      // Avoid redirects after sign-in
      signInSuccessWithAuthResult: () => false
    }
  };
};
// Fetches post based on topic
export const fetchPostCount = (app, topic) => {
  return get(`https://${app}.firebaseio.com/forums/${topic}/posts.json?shallow=true`);
}
// Generates a posts url based on topic
export const generatePostsUrl = (topic) => `/forums/${topic}/posts`;
