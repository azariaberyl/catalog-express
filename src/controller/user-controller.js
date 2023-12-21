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

const update = async (req, res, next) => {
  try {
    const result = await userService.update(req.body);
    res
      .status(200)
      .json({
        data: {
          name: result,
        },
      })
      .end();
  } catch (e) {
    next(e);
  }
};

const logout = async (req, res, next) => {
  try {
    const result = await userService.logout(req.body);
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

export default {
  register,
  login,
  update,
  logout,
};
