import Joi from 'joi';

export const createCatalogValidation = Joi.object({
  email: Joi.string().max(100).email().required(),
  username: Joi.string().max(100).required(),
  title: Joi.string().max(100).required(),
  desc: Joi.string(),
});

export const getAllCatalogValidation = Joi.string().max(100).required();

export const getCatalogValidation = Joi.object({
  username: Joi.string().max(100).required(),
  catalogId: Joi.string().max(100).required(),
});
