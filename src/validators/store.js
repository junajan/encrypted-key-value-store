import Joi from 'joi';

const encryptionKey = Joi.string().required();

export const getItem = {
  headers: {
    'encryption-key': encryptionKey
  },
  params: {
    id: Joi.string().regex(/[a-zA-Z0-9-*]{1,30}/).required()
  }
};

export const setItem = {
  body: Joi.object().required(),
  headers: {
    'encryption-key': encryptionKey
  },
  params: {
    id: Joi.string().regex(/[a-zA-Z0-9-]{1,30}/).required()
  }
};
