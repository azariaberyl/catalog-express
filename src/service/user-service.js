import { validation } from '../validation/validate';
import bcrypt from 'bcrypt';
import { prismaClient } from '../application/database.js';
import ResponseError from '../error/response-error.js';
import { loginUserValidation, registerUserValidation } from '../validation/user-validation.js';
import { v4 as uuid } from 'uuid';

const register = async (request) => {
  const user = validation(registerUserValidation, request);

  const userCount = await prismaClient.user.count({
    where: {
      username: user.username,
    },
  });

  const emailCount = await prismaClient.user.count({
    where: {
      email: user.email,
    },
  });

  if (userCount > 0) {
    throw new ResponseError(400, 'Username already exist');
  }

  if (emailCount > 0) {
    throw new ResponseError(400, 'Email already exist');
  }

  user.password = await bcrypt.hash(user.password, 10);
  const result = await prismaClient.user.create({
    data: user,
    select: {
      name: true,
      username: true,
      email: true,
    },
  });

  return result;
};

const login = async (request) => {
  const result = validation(loginUserValidation, request);
  const user = await prismaClient.user.findUnique({
    where: {
      email: result.email,
    },
    select: {
      username: true,
      email: true,
      password: true,
    },
  });

  if (!user) {
    throw new ResponseError(400, 'Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(result.password, user.password);
  if (isPasswordValid) {
    // TODO: Update token usage
    const token = uuid();
    return prismaClient.user.update({
      where: {
        email: result.email,
      },
      data: {
        token: token,
      },
      select: {
        token: true,
      },
    });
  }
};

export default {
  register,
  login,
};
