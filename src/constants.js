export LoginUIConfig (providers = []) => {
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
