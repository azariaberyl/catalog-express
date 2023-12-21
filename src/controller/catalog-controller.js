import catalogService from '../service/catalog-service';

const create = async (req, res, next) => {
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

export default { create, getAll };
