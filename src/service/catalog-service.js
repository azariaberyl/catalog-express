import { v4 } from 'uuid';
import { prismaClient } from '../application/database';
import { createCatalogValidation } from '../validation/catalog-validation';
import { validation } from '../validation/validate';

const create = async (request) => {
  const result = validation(createCatalogValidation, request);
  const id = v4();

  const catalog = await prismaClient.catalog.create({
    data: {
      title: result.title,
      desc: result.desc,
      id,
      user_id: result.username,
    },
    include: {
      user: true,
    },
  });

  return catalog;
};

export default { create };
