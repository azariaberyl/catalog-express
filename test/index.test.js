import { v4 } from 'uuid';
import { prismaClient } from '../src/application/database';
import { createTestCatalog, createTestUser, deleteTestCatalog, deleteTestUser } from './test-utils';

it('Delete all', async () => {
  const id = v4();
  await prismaClient.user.create({
    data: {
      email: `${id}@sasad.com`,
      name: 'Test1123',
      password: 'test1123',
      username: id,
      token: 'menghadeh',
    },
  });
  await prismaClient.catalogContainer.create({
    data: {
      id: 'test15',
      title: 'test15',
      user_id: id,
      catalogs: {
        create: {
          id: '8374213123',
          title: 'deletion',
        },
      },
    },
  });

  await prismaClient.catalog.deleteMany({});
  await prismaClient.catalogContainer.deleteMany({});
  await prismaClient.user.deleteMany({});
});
