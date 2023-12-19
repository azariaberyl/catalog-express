import Joi from 'joi';

export const registerUserValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  username: Joi.string().required(),
  name: Joi.string().required(),
});
