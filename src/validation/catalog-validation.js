import Joi from 'joi';

export const createCatalogValidation = Joi.object({
  email: Joi.string().max(100).email().required(),
  username: Joi.string().max(100).required(),
  title: Joi.string().max(100).required(),
  desc: Joi.string().optional(),
  items: Joi.array().items({
    id: Joi.number().required(),
    title: Joi.string().max(100).optional(),
    desc: Joi.string().optional(),
    imgPath: Joi.string().optional(),
  }),
});

export const getAllCatalogValidation = Joi.string().max(100).required();

export const getCatalogValidation = Joi.object({
  username: Joi.string().max(100).required(),
  catalogId: Joi.string().max(100).required(),
});

export const updateCatalogValidation = Joi.object({
  email: Joi.string().max(100).required(),
  username: Joi.string().max(100).required(),
  catalogId: Joi.string().max(100).required(),
  title: Joi.string().max(100).required(),
  desc: Joi.string().allow('').optional(),
  image: Joi.string().optional(),
});

export const deleteCatalogValidation = Joi.object({
  email: Joi.string().max(100).required(),
  username: Joi.string().max(100).required(),
  catalogId: Joi.string().max(100).required(),
});
