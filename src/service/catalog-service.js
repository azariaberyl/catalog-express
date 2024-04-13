import fs from 'fs';
import multer from 'multer';
import { v4 } from 'uuid';
import { prismaClient } from '../application/database.js';
import ResponseError from '../error/response-error.js';
import { imageWhitelist } from '../utils/global.js';
import { deleteFilesFromDrive } from '../utils/utils.js';
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

export var upload = multer({
  fileFilter: (req, file, cb) => {
    if (!imageWhitelist.includes(file.mimetype)) {
      return cb(new ResponseError(400, 'file type is not allowed'));
    }

    cb(null, true);
  },
});

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

  // Retrieve the catalog container from the database
  const catalog = await prismaClient.catalogContainer.findUnique({
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

  // Check if catalog exists
  if (!catalog) {
    throw new ResponseError(404, 'Catalog is not found');
  }

  // Prepare data object for updating
  if (result.title) {
    data.title = result.title;
  }

  if (result.desc) {
    data.desc = result.desc;
  }

  if (result.customToken) {
    data.custom_code = result.customToken;
  }

  // Update the catalog container
  const updatedContainer = await prismaClient.catalogContainer.update({
    data,
    where: {
      id: catalog.id,
    },
  });

  // Process items
  if (result.items) {
    const updatedItems = await Promise.all(
      result.items.map(async (item) => {
        // Find the item in the database
        const existingItem = catalog.catalogs.find((catalogItem) => catalogItem.id === item.id);
        const formattedTags = item.tags && {
          connectOrCreate: item.tags.map((tag) => ({
            where: { id: tag.id },
            create: { id: tag.id, name: tag.text },
          })),
        };

        // If the item exists, update it
        if (existingItem) {
          // Update the item
          const id = item.id;
          const _item = { ...item };
          delete _item.id;
          return prismaClient.catalog.update({
            where: { id },
            data: { ..._item, tags: formattedTags, catalog_container: { connect: { id: catalog.id } } },
          });
        } else {
          // If the item doesn't exist, create it
          return prismaClient.catalog.create({
            data: {
              ...item,
              tags: formattedTags,
              catalog_container: { connect: { id: catalog.id } },
            },
          });
        }
      })
    );

    // Find image ID of deleted items
    const deletedImgs = catalog.catalogs
      .filter((oldItem) => !updatedItems.some((updatedItem) => updatedItem.id === oldItem.id))
      .flatMap((deletedItem) => (deletedItem.imagePath ? deletedItem.imagePath.split('d/')[1] : []));

    // Find IDs of deleted items
    const deletedItemIds = catalog.catalogs
      .filter((oldItem) => !result.items.some((updatedItem) => updatedItem.id === oldItem.id))
      .map((deletedItem) => deletedItem.id);

    // Find changed images by used and going to be deleted
    const deletedChangedImgIds = catalog.catalogs.flatMap((oldItem) => {
      if (!oldItem.imagePath) return [];
      const _updatedItem = updatedItems.find((updatedItem) => updatedItem.id === oldItem.id);
      if (!_updatedItem) return [];
      if (!_updatedItem.imagePath) return [];

      return _updatedItem.imagePath.split('d/')[1] === oldItem.imagePath.split('d/')[1]
        ? []
        : oldItem.imagePath.split('d/')[1];
    });

    // Delete the corresponding items
    // Delete the corresponding image based on deleted id
    await Promise.all([
      ...deletedItemIds.map(async (deletedItemId) => {
        await prismaClient.catalog.delete({ where: { id: deletedItemId } });
      }),
      deleteFilesFromDrive(deletedImgs),
      deleteFilesFromDrive(deletedChangedImgIds),
    ]);

    // Delete tags
    const deletedTags = await Promise.all(
      catalog.catalogs.map((val) => {
        if (result.items.length === 0) return;
        const _newVal = result.items.find((_) => _.id === val.id);
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

    // Return the updated container and items
    return [updatedContainer, updatedItems];
  }

  // If no items were provided, return only the updated container
  return updatedContainer;
};

const del = async (request) => {
  const result = validation(deleteCatalogValidation, request);

  // Check if the catalog exists
  const catalog = await prismaClient.catalogContainer.findUnique({
    where: {
      user_id: result.username,
      id: result.catalogId,
    },
    include: {
      catalogs: {
        select: {
          imagePath: true,
        },
      },
    },
  });

  if (!catalog) {
    throw new ResponseError(404, 'Catalog is not found');
  }

  // Extract image IDs from image paths
  const deletedImgIds = catalog.catalogs.flatMap((item) => (item.imagePath ? item.imagePath.split('d/')[1] : []));
  // Delete files from drive using the extracted image IDs
  deleteFilesFromDrive(deletedImgIds);

  // Delete the catalog items
  await prismaClient.catalog.deleteMany({
    where: {
      container_id: result.catalogId,
    },
  });

  // Delete the catalog container
  const deletedCatalogContainer = await prismaClient.catalogContainer.delete({
    where: {
      user_id: result.username,
      id: result.catalogId,
    },
  });

  return [deletedCatalogContainer, catalog.catalogs];
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
