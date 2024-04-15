import { prismaClient } from '../src/application/database';
import bcrypt from 'bcryptjs';

const createTestUser = async (username = '') => {
  await prismaClient.user.create({
    data: {
      username: `test`,
      email: `test${username}@test.com`,
      password: await bcrypt.hash('test', 10),
      name: 'test',
      token: `test`,
    },
  });
};

const deleteTestUser = async () => {
  await prismaClient.user.deleteMany({
    where: {
      username: {
        startsWith: 'test',
      },
    },
  });
};

const createTestCatalog = async (title = '', desc = '') => {
  const id = crypto.randomUUID();
  await prismaClient.catalog.create({
    data: {
      title: 'test' + title,
      desc: 'test ' + desc,
      id,
      user_id: `test`,
    },
  });
};

const deleteTestCatalog = async () => {
  await prismaClient.catalog.deleteMany({
    where: {
      title: {
        startsWith: 'test',
      },
    },
  });
};

const getAllTestCatalog = async () => {
  return prismaClient.catalog.findMany({
    where: {
      title: {
        startsWith: 'test',
      },
    },
  });
};

export { deleteTestUser, createTestUser, createTestCatalog, deleteTestCatalog, getAllTestCatalog };
