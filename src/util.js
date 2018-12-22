import { get } from 'axios';
import { toast } from 'react-toastify';
// No-op
export const Noop = () => {};
// Creates a custom toast
export const makeToast = (message, error=false, placement={ position: toast.POSITION_BOTTOM_CENTER }) => {
  return error ? toast.error(message, { position: toast.POSITION_BOTTOM_CENTER })
    : toast.success(message, { position: toast.POSITION_BOTTOM_CENTER });
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
