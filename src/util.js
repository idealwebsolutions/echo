import validator from 'is-my-json-valid';

export const validateSchema = (schema, payload) => validator(schema)(payload);
