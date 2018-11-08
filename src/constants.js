export const ConfigSchema = {
  required: true,
  type: 'object',
  properties: {
    apiKey: {
      required: true,
      type: 'string',
    },
    authDomain: {
      required: true,
      type: 'string'
    },
    databaseURL: {
      required: true,
      type: 'string'
    },
    projectId: {
      required: true,
      type: 'string'
    },
    storageBucket: {
      required: true,
      type: 'string'
    },
    messagingSenderId: {
      required: true,
      type: 'string'
    }
  }
};
