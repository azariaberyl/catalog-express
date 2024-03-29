import { v4 } from 'uuid';
import { prismaClient } from '../application/database.js';
import {
  checkCodeValidation,
  createCatalogValidation,
  deleteCatalogValidation,
  getAllCatalogValidation,
  getCatalogValidation,
  searchValidation,
  updateCatalogValidation,
} from '../validation/catalog-validation.js';
import { validation } from '../validation/validate.js';
import ResponseError from '../error/response-error.js';
import fs from 'fs';
import multer from 'multer';
import { imageWhitelist } from '../utils/global.js';
import { Prisma } from '@prisma/client';

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

  if (result.items) {
    const data = {
      title: result.title,
      desc: result.desc,
      id,
      user_id: result.username,
      custom_code: result.customToken,
      catalogs: {
        create: result.items.map((_, i) => {
          if (_.tags) {
            return {
              id: _.id,
              title: _.title,
              desc: _.desc,
              imagePath: _.imagePath,
              tags: {
                connectOrCreate: _.tags.map((val) => ({
                  where: {
                    id: val.id,
                  },
                  create: {
                    id: val.id,
                    name: val.text,
                  },
                })),
              },
            };
          }
          return {
            id: _.id,
            title: _.title,
            desc: _.desc,
            imagePath: _.imagePath,
          };
        }),
      },
    };
    const catalog = await prismaClient.catalogContainer.create({
      data,
      include: {
        catalogs: true,
      },
    });

    return catalog;
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
      catalogs: {
        include: {
          tags: true,
        },
      },
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
      catalogs: {
        include: {
          tags: true,
        },
      },
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

  if (result.customToken) {
    data.custom_code = result.customToken;
  }

  if (result.items) {
    catalogs.push(...result.items);
  }

  try {
    const updatedContainer = await prismaClient.catalogContainer.update({
      data,
      where: {
        id: catalog.id,
      },
    });

    // Deleted items
    const oldCatalogs = [...catalog.catalogs];
    const deleted = oldCatalogs.filter((val) => {
      return !catalogs.some((_) => {
        return val.id === _.id;
      });
    });
    const deleteItems = await Promise.all(
      deleted.map((val) => {
        return prismaClient.catalog.delete({
          where: {
            id: val.id,
          },
        });
      })
    );

    // Deleted tags
    const deletedTags = await Promise.all(
      oldCatalogs.map((val) => {
        const _newVal = catalogs.find((_) => _.id === val.id);
        if (!_newVal) return;
        if (_newVal.tags) {
          const _deletedTags = val.tags.filter((_) => !_newVal.tags.some((_val) => _val.id === _.id));
          return prismaClient.catalog.update({
            where: { id: val.id },
            data: {
              tags: {
                disconnect: _deletedTags.map((_) => ({ id: _.id })),
              },
            },
          });
        }
      })
    );
    // Add items
    if (catalogs.length <= 0) return updatedContainer;
    const updatedCatalogs = await Promise.all(
      catalogs.map((item) => {
        if (item.tags && item.tags.length > 0) {
          return prismaClient.catalog.upsert({
            where: {
              id: item.id,
            },
            update: {
              ...item,
              tags: {
                set: item.tags.map((_) => ({
                  id: _.id,
                  name: _.text,
                })),
              },
            },
            create: {
              ...item,
              tags: {
                connectOrCreate: item.tags.map((_) => ({
                  where: { id: _.id },
                  create: { id: _.id, name: _.text },
                })),
              },
              catalog_container: {
                connect: { id: catalog.id },
              },
            },
          });
        }

        return prismaClient.catalog.upsert({
          where: {
            id: item.id,
          },
          update: item,
          create: {
            ...item,
            catalog_container: {
              connect: { id: catalog.id },
            },
          },
        });
      })
    );

    return [updatedContainer, updatedCatalogs];
  } catch (e) {
    console.log(e);
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      if (e.code === 'P2002') {
        throw new ResponseError(400, e.message);
      }
    }
  }
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
  const customCode = await prismaClient.catalogContainer.findMany({
    where: {
      custom_code: { startsWith: result.username },
    },
    select: { custom_code: true, id: true },
  });

  return customCode;
};

const search = async (req) => {
  const result = validation(searchValidation, req);
  const catalogId = await prismaClient.catalogContainer.findMany({
    where: {
      OR: [
        {
          id: {
            contains: result,
          },
        },
        {
          custom_code: {
            contains: result,
          },
        },
      ],
    },
    select: {
      id: true,
      custom_code: true,
      title: true,
      user_id: true,
    },
  });

  return catalogId;
};

export default { create, getAll, get, update, del, getCustomCode, search };
