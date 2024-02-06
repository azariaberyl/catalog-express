import ResponseError from '../error/response-error.js';
import { authFunction } from '../middleware/auth-middleware.js';
import catalogService from '../service/catalog-service.js';
import { imageWhitelist } from '../utils/global.js';

const create = async (req, res, next) => {
  try {
    if (req.file) {
      const { fileTypeFromFile } = await import('file-type');
      const meta = await fileTypeFromFile(req.file.path);
      if (!imageWhitelist.includes(meta.mime)) {
        throw new ResponseError(400, 'file is not allowed');
      }
      req.body.image = req.file.path;
    }

    if (req.body.items) {
      req.body.items = JSON.parse(req.body.items);
      if (req.files.length > 0)
        req.body.items = req.body.items.map((item) => {
          const theImg = req.files.find((file) => {
            return file.originalname.split('.')[0] == item.id;
          });
          if (!theImg) return item;

          return { ...item, imagePath: theImg.path };
        });
    }
    await authFunction(req);

    const result = await catalogService.create(req.body);
    res
      .status(201)
      .json({
        data: { ...result },
      })
      .end();
  } catch (e) {
    next(e);
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
    if (req.file) {
      const { fileTypeFromFile } = await import('file-type');
      const meta = await fileTypeFromFile(req.file.path);
      if (!imageWhitelist.includes(meta.mime)) {
        return next(new ResponseError(400, 'file is not allowed'));
      }
      req.body.image = req.file.path;
    }

    await authFunction(req);
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
        data: 'OK',
      })
      .end();
  } catch (e) {
    next(e);
  }
};

export default { create, getAll, get, update, del };
