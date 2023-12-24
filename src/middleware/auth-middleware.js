import { prismaClient } from '../application/database.js';
import ResponseError from '../error/response-error.js';

const authFunction = async (req) => {
  const token = req.get('Authorization');
  if (!token) {
    throw new ResponseError(401, 'Unauthorized');
  }
  const user = await prismaClient.user.findFirst({
    where: {
      token,
    },
    select: {
      email: true,
      username: true,
    },
  });

  if (!user) {
    throw new ResponseError(401, 'Unauthorized, Please login again');
  }

  req.body.username = user.username;
  req.body.email = user.email;
};

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.get('Authorization');
    if (!token) {
      next('router');
    }
    const user = await prismaClient.user.findFirst({
      where: {
        token,
      },
      select: {
        email: true,
        username: true,
      },
    });

    if (!user) {
      throw new ResponseError(401, 'Unauthorized, Please login again');
    }

    req.body.username = user.username;
    req.body.email = user.email;
    next();
  } catch (e) {
    next(e);
  }
};

export default authMiddleware;
export { authFunction };
