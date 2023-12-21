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

const createTestCatalog = async () => {
  await prismaClient.catalog.create({
    data: {
      title: 'test',
      desc: 'test',
      id: 'test',
      user_id: 'test',
    },
  });
};

const deleteTestCatalog = async () => {
  await prismaClient.catalog.deleteMany({
    where: {
      title: 'test',
    },
  });
};

export { deleteTestUser, createTestUser, createTestCatalog, deleteTestCatalog };
