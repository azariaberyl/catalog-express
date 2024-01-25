import Joi from 'joi';

export const registerUserValidation = Joi.object({
  email: Joi.string().max(100).email().required(),
  password: Joi.string().max(100).required(),
  username: Joi.string().alphanum().max(100).required(),
  name: Joi.string().max(100),
});

export const loginUserValidation = Joi.object({
  email: Joi.string().max(100).email().required(),
  password: Joi.string().max(100).required(),
});

export const updateUserValidation = Joi.object({
  email: Joi.string().max(100).email().required(),
  password: Joi.string().max(100).optional(),
  username: Joi.string().alphanum().max(100).required(),
  name: Joi.string().max(100).optional(),
});

export const getUserValidation = Joi.object({
  email: Joi.string().max(100).email().required(),
  username: Joi.string().max(100).required(),
});
