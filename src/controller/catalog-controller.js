import ResponseError from '../error/response-error.js';
import { authFunction } from '../middleware/auth-middleware.js';
import catalogService from '../service/catalog-service.js';
import { imageWhitelist } from '../utils/global.js';
import { handleFileUploads, updateItemPaths } from '../utils/utils.js';

const create = async (req, res, next) => {
  try {
    await authFunction(req);

    await handleFileUploads(req);
    updateItemPaths(req);
    const result = await catalogService.create(req.body);
    res.status(201).json({ data: { ...result } });
  } catch (error) {
    next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    const result = await catalogService.getAll(req.params.username);
    res.status(200).json({
      data: {
        ...result,
      },
    }).end;
  } catch (e) {
    next(e);
  }
};

const get = async (req, res, next) => {
  try {
    const body = {
      username: req.params.username,
      catalogId: req.params.id,
    };
    const result = await catalogService.get(body);
    res
      .status(200)
      .json({
        data: {
          ...result,
        },
      })
      .end();
  } catch (e) {
    next(e);
  }
};

const update = async (req, res, next) => {
  try {
    await authFunction(req);

    await handleFileUploads(req);
    updateItemPaths(req);
    req.body.catalogId = req.params.id;
    const result = await catalogService.update(req.body);
    res
      .status(200)
      .json({
        data: {
          ...result,
        },
      })
      .end();
  } catch (e) {
    next(e);
  }
};

const del = async (req, res, next) => {
  try {
    req.body.catalogId = req.params.id;
    const result = await catalogService.del(req.body);
    res
      .status(200)
      .json({
        data: result,
      })
      .end();
  } catch (e) {
    next(e);
  }
};

const getCustomCode = async (req, res, next) => {
  try {
    const result = await catalogService.getCustomCode(req.body);
    res.status(200).json({ data: result }).end();
  } catch (error) {
    next(error);
  }
};

const search = async (req, res, next) => {
  try {
    req.body = req.query.id;
    const result = await catalogService.search(req.body);
    res.status(200).json({ data: result }).end();
  } catch (error) {
    next(error);
  }
};

export default { create, getAll, get, update, del, getCustomCode, search };
