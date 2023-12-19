import userService from '../service/user-service';

const register = async (req, res, next) => {
  try {
    const result = await userService.register(req.body);
    res
      .status(201)
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

const login = async (req, res, next) => {
  try {
    const result = await userService.login(req.body);
    res.status(200).json({
      data: {
        ...result,
      },
    });
  } catch (e) {
    next(e);
  }
};

export default {
  register,
  login,
};
