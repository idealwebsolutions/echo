import validator from 'is-my-json-valid';
// No-op
export const Noop = () => {};
// Validates a schema against a payload
export const validateSchema = (schema, payload) => validator(schema)(payload);
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
