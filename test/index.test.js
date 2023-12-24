import { v4 } from 'uuid';
import { prismaClient } from '../src/application/database';
import { createTestCatalog, createTestUser, deleteTestCatalog, deleteTestUser } from './test-utils';

it('Delete all', async () => {
  const id = v4();
  await prismaClient.user.create({
    data: {
      email: 'sajd@gmail.com',
      name: 'Test15',
      password: 'test15',
      username: id,
      token: 'menghadeh',
    },
  });
  await prismaClient.catalog.create({
    data: {
      id: 'test15',
      title: 'test15',
      desc: 'This is test15',
      user_id: id,
    },
  });

  await prismaClient.catalog.deleteMany({});
  await prismaClient.user.deleteMany({});
});
