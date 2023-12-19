import { prismaClient } from '../src/application/database';
import bcrypt from 'bcrypt';

const createTestUser = async () => {
  await prismaClient.user.create({
    data: {
      username: 'test',
      email: 'test@test.com',
      password: await bcrypt.hash('test', 10),
      name: 'test',
      token: 'test',
    },
  });
};

const deleteTestUser = async () => {
  await prismaClient.user.delete({
    where: {
      username: 'test',
    },
  });
};

export { deleteTestUser, createTestUser };
