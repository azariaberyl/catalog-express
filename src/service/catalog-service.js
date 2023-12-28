import { v4 } from 'uuid';
import { prismaClient } from '../application/database.js';
import {
  createCatalogValidation,
  deleteCatalogValidation,
  getAllCatalogValidation,
  getCatalogValidation,
  updateCatalogValidation,
} from '../validation/catalog-validation.js';
import { validation } from '../validation/validate.js';
import ResponseError from '../error/response-error.js';
import fs from 'fs';

const create = async (request) => {
  const result = validation(createCatalogValidation, request);
  const id = v4();

  const catalog = await prismaClient.catalog.create({
    data: {
      title: result.title,
      desc: result.desc,
      id,
      user_id: result.username,
      imagePath: result.image,
    },
    include: {
      user: {
        select: {
          username: true,
          name: true,
        },
      },
    },
  });

  return catalog;
};

const getAll = async (request) => {
  const result = validation(getAllCatalogValidation, request);
  const catalogs = await prismaClient.user.findUnique({
    where: {
      username: result,
    },
    select: {
      username: true,
      name: true,
      catalog: true,
    },
  });

  if (!catalogs) {
    throw new ResponseError(404, `Username '${result}' not found`);
  }

  return catalogs;
};

const get = async (request) => {
  const result = validation(getCatalogValidation, request);
  const catalog = await prismaClient.catalog.findFirst({
    where: {
      user_id: result.username,
      id: result.catalogId,
    },
  });

  if (!catalog) {
    throw new ResponseError(404, `Catalog is not found`);
  }
  return catalog;
};

const update = async (request) => {
  const result = validation(updateCatalogValidation, request);
  const data = {};

  const catalog = await prismaClient.catalog.findFirst({
    where: {
      user_id: result.username,
      id: result.catalogId,
    },
    select: {
      id: true,
      imagePath: true,
    },
  });
  if (!catalog) {
    throw new ResponseError(404, 'Catalog is not found');
  }

  if (result.title) {
    data.title = result.title;
  }

  if (result.desc) {
    data.desc = result.desc;
  }

  if (result.image) {
    fs.unlinkSync(catalog.imagePath);
  }

  const updated = await prismaClient.catalog.update({
    data: {
      title: result.title,
      desc: result.desc,
      imagePath: result.image,
    },
    where: {
      id: catalog.id,
    },
  });
  return updated;
};

const del = async (request) => {
  const result = validation(deleteCatalogValidation, request);
  const catalogCount = await prismaClient.catalog.count({
    where: {
      user_id: result.username,
      id: result.catalogId,
    },
  });

  if (catalogCount !== 1) {
    throw new ResponseError(404, 'Catalog already deleted');
  }

  const catalog = await prismaClient.catalog.delete({
    where: {
      user_id: result.username,
      id: result.catalogId,
    },
  });

  if (catalog.imagePath) {
    fs.unlinkSync(catalog.imagePath);
  }

  return catalog;
};

export default { create, getAll, get, update, del };
