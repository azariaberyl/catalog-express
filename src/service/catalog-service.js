import { v4 } from 'uuid';
import { prismaClient } from '../application/database.js';
import {
  checkCodeValidation,
  createCatalogValidation,
  deleteCatalogValidation,
  getAllCatalogValidation,
  getCatalogValidation,
  updateCatalogValidation,
} from '../validation/catalog-validation.js';
import { validation } from '../validation/validate.js';
import ResponseError from '../error/response-error.js';
import fs from 'fs';
import multer from 'multer';
import { imageWhitelist } from '../utils/global.js';

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

export var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (!imageWhitelist.includes(file.mimetype)) {
      return cb(new ResponseError(400, 'file is not allowed'));
    }

    cb(null, true);
  },
});

// TODO: create test
const create = async (request) => {
  const result = validation(createCatalogValidation, request);
  const id = `${v4()}-${+new Date()}`;

  if (result.items) {
    const catalog = await prismaClient.catalogContainer.create({
      data: {
        title: result.title,
        desc: result.desc,
        id,
        user_id: result.username,
        custom_code: result.customToken,
        catalogs: {
          createMany: {
            data: result.items,
          },
        },
      },
      select: {
        id: true,
        title: true,
        desc: true,
      },
    });

    return catalog;
  }

  if (result.customToken) {
    const code = await prismaClient.catalogContainer.findUnique({
      where: {
        custom_code: result.customToken,
      },
      select: {
        custom_code: true,
      },
    });
    if (code) {
      throw new ResponseError(400, 'Custom code is already used. Please check it first :)');
    }
  }

  const catalog = await prismaClient.catalogContainer.create({
    data: {
      title: result.title,
      desc: result.desc,
      id,
      user_id: result.username,
      custom_code: result.customToken,
    },
    select: {
      id: true,
      title: true,
      desc: true,
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
      Catalog: {
        select: {
          id: true,
          title: true,
          desc: true,
        },
      },
    },
  });

  if (!catalogs) {
    throw new ResponseError(404, `Username '${result}' not found`);
  }

  return catalogs;
};

const get = async (request) => {
  const result = validation(getCatalogValidation, request);
  const catalog = await prismaClient.catalogContainer.findFirst({
    where: {
      user_id: result.username,
      id: result.catalogId,
    },
    include: {
      catalogs: true,
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
  const catalogs = [];

  const catalog = await prismaClient.catalogContainer.findFirst({
    where: {
      user_id: result.username,
      id: result.catalogId,
    },
    select: {
      id: true,
    },
  });
  if (!catalog) {
    throw new ResponseError(404, 'Catalog is not found');
  }

  if (result.customToken) {
    const code = await prismaClient.catalogContainer.findUnique({
      where: {
        custom_code: result.customToken,
      },
      select: {
        custom_code: true,
      },
    });
    if (code) {
      throw new ResponseError(400, 'Custom code is already used. Please check it first :)');
    }
  }

  if (result.title) {
    data.title = result.title;
  }

  if (result.desc) {
    data.desc = result.desc;
  }

  if (result.customToken) {
    data.custom_code = result.customToken;
  }

  if (result.items) {
    catalogs.push(...result.items);
  }

  const updated = await prismaClient.$transaction(async (prisma) => {
    const updatedContainer = await prisma.catalogContainer.update({
      data,
      where: {
        id: catalog.id,
      },
    });
    if (catalogs.length <= 0) return updatedContainer;

    const updatedCatalogs = await Promise.all(
      catalogs.map((item) =>
        prisma.catalog.upsert({
          where: {
            id: item.id,
          },
          update: item,
          create: {
            catalog_container: {
              connect: { id: catalog.id },
            },
            ...item,
          },
        })
      )
    );
    return [updatedContainer, updatedCatalogs];
  });

  return updated;
};

const del = async (request) => {
  const result = validation(deleteCatalogValidation, request);
  const catalogCount = await prismaClient.catalogContainer.count({
    where: {
      user_id: result.username,
      id: result.catalogId,
    },
  });

  if (catalogCount !== 1) {
    throw new ResponseError(404, 'Catalog is not found');
  }

  // TODO: delete the corresponding image of each item
  const catalogItem = await prismaClient.catalog.deleteMany({
    where: {
      container_id: result.catalogId,
    },
  });

  const catalog = await prismaClient.catalogContainer.delete({
    where: {
      user_id: result.username,
      id: result.catalogId,
    },
  });

  if (catalog.imagePath) {
    fs.unlinkSync(catalog.imagePath);
  }

  return [catalog, catalogItem];
};

const getCustomCode = async (req) => {
  const result = validation(checkCodeValidation, req);
  console.log(result.username);
  const customCode = await prismaClient.catalogContainer.findMany({
    where: {
      custom_code: { startsWith: result.username },
    },
    select: { custom_code: true },
  });

  return customCode;
};

export default { create, getAll, get, update, del, getCustomCode };
