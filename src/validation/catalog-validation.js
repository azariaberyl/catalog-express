import Joi from 'joi';

export const createCatalogValidation = Joi.object({
  email: Joi.string().max(100).email().required(),
  username: Joi.string().max(100).required(),
  title: Joi.string().max(100).required(),
  desc: Joi.string().optional(),
  customToken: Joi.string().optional(),
  items: Joi.array()
    .optional()
    .items({
      id: Joi.string().required(),
      title: Joi.string().max(100),
      desc: Joi.string().allow('').optional(),
      imagePath: Joi.string().optional(),
      tags: Joi.array()
        .optional()
        .items({
          id: Joi.string().max(10),
          text: Joi.string().max(10),
        }),
    }),
});

export const getAllCatalogValidation = Joi.string().max(100).required();

export const getCatalogValidation = Joi.object({
  username: Joi.string().max(100).required(),
  catalogId: Joi.string().max(100).required(),
});

export const updateCatalogValidation = Joi.object({
  email: Joi.string().max(100).email().required(),
  username: Joi.string().max(100).required(),
  title: Joi.string().max(100).required(),
  catalogId: Joi.string().max(100).required(),
  desc: Joi.string().optional(),
  customToken: Joi.string().max(50).optional(),
  items: Joi.array()
    .optional()
    .items({
      id: Joi.string().required(),
      title: Joi.string().max(100),
      desc: Joi.string().allow('').optional(),
      imagePath: Joi.string().optional(),
      tags: Joi.array()
        .optional()
        .items({
          id: Joi.string().max(10),
          text: Joi.string().max(10),
        }),
    }),
});

export const deleteCatalogValidation = Joi.object({
  email: Joi.string().max(100).required(),
  username: Joi.string().max(100).required(),
  catalogId: Joi.string().max(100).required(),
});

export const checkCodeValidation = Joi.object({
  email: Joi.string().max(100).required(),
  username: Joi.string().max(100).required(),
  // customCode: Joi.string().max(50).pattern(`^(.)+\\(.)+$`, 'Custom Token Pattern').required(),
});

export const searchValidation = Joi.string().max(100).required();
