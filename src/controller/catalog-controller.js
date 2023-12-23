import catalogService from '../service/catalog-service';

const create = async (req, res, next) => {
  // TODO: Handle image
  try {
    const result = await catalogService.create(req.body);
    res
      .status(200)
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
  // TODO: Handle image
  try {
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
        data: {
          ...result,
        },
      })
      .end();
  } catch (e) {
    next(e);
  }
};

export default { create, getAll, get, update, del };
