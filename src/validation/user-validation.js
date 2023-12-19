import Joi from 'joi';

export const registerUserValidation = Joi.object({
  email: Joi.string().max(100).email().required(),
  password: Joi.string().max(100).required(),
  username: Joi.string().max(100).required(),
  name: Joi.string().max(100).required(),
});

export const loginUserValidation = Joi.object({
  email: Joi.string().max(100).email().required(),
  password: Joi.string().max(100).required(),
});
