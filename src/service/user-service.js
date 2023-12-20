import { validation } from '../validation/validate';
import bcrypt from 'bcrypt';
import { prismaClient } from '../application/database.js';
import ResponseError from '../error/response-error.js';
import { loginUserValidation, registerUserValidation, updateUserValidation } from '../validation/user-validation.js';
import { v4 as uuid } from 'uuid';
import { logger } from '../application/logging.js';

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
  throw new ResponseError(400, 'Invalid email or password');
};

const update = async (request) => {
  const result = validation(updateUserValidation, request);
  const userCount = await prismaClient.user.count({
    where: {
      username: result.username,
    },
  });

  if (userCount !== 1) {
    throw new ResponseError(404, 'User not found');
  }

  const data = {};
  if (result.name) {
    data.name = result.name;
  }
  if (result.password) {
    data.password = await bcrypt.hash(result.password, 10);
  }

  return prismaClient.user.update({
    where: {
      username: result.username,
    },
    data,
    select: {
      name: true,
    },
  });
};

export default {
  register,
  login,
  update,
};
