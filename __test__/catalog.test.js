import supertest from 'supertest';
import { app } from '../src/application/web';
import { createTestCatalog, createTestUser, deleteTestCatalog, deleteTestUser, getAllTestCatalog } from './test-utils';
import { prismaClient } from '../src/application/database';

describe.skip('POST /catalog/create', () => {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await deleteTestCatalog();
    await deleteTestUser();
  });

  it('Create catalog', async () => {
    const result = await supertest(app).post('/catalog/create').set('Authorization', 'test').send({
      title: 'test',
      desc: 'test',
    });

    expect(result.status).toBe(200);
    expect(result.body.data).toMatchObject({
      user_id: 'test',
      title: 'test',
      desc: 'test',
      user: {
        username: 'test',
        email: 'test@test.com',
        name: 'test',
        token: 'test',
      },
    });
  });

  it('not create catalog if no token', async () => {
    const result = await supertest(app).post('/catalog/create').send({
      title: 'test',
      desc: 'test',
    });

    expect(result.status).toBe(401);
    expect(result.body.errors).toBe('Unauthorized');
  });

  it('not create catalog if no title', async () => {
    const result = await supertest(app).post('/catalog/create').set('Authorization', 'test').send({
      desc: 'test',
    });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBe('ValidationError: "title" is required');
  });
});

describe('GET /catalog/:username', () => {
  describe('Catalogs exist', () => {
    beforeEach(async () => {
      await createTestUser();
      await createTestCatalog('1');
      await createTestCatalog('2');
    });
    afterEach(async () => {
      await deleteTestCatalog();
      await deleteTestUser();
    });

    it('Get all catalog', async () => {
      const result = await supertest(app).get('/catalog/test');
      expect(result.status).toBe(200);
      expect(result.body.data).toBeDefined();
      expect(result.body.data.catalog.length).toBe(2);
    });

    it('not Get all catalog if invalid username', async () => {
      const result = await supertest(app).get('/catalog/invalid');

      expect(result.status).toBe(404);
      expect(result.body.errors).toBeDefined();
    });
  });
  it('return empty array if empty', async () => {
    await createTestUser();
    const result = await supertest(app).get('/catalog/test');

    expect(result.body.data.catalog.length).toBe(0);

    await deleteTestUser();
  });
});

describe('GET /catalog/:username/:id', () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestCatalog();
  });
  afterEach(async () => {
    await deleteTestCatalog();
    await deleteTestUser();
  });

  it('get specific catalog', async () => {
    const catalogs = await getAllTestCatalog();
    const result = await supertest(app).get(`/catalog/test/${catalogs[0].id}`);

    expect(result.body.data).toEqual({
      ...catalogs[0],
    });
  });
  it('not get catalog if id or username wrong', async () => {
    const result = await supertest(app).get('/catalog/wrong/wrong');
  });
});

describe.skip('PUT /catalog/update/:id', () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestCatalog();
  });
  afterEach(async () => {
    await deleteTestCatalog();
    await deleteTestUser();
  });

  it('update catalog', async () => {
    const catalogId = (await getAllTestCatalog())[0].id;
    const result = await supertest(app).put(`/catalog/update/${catalogId}`).set('Authorization', 'test').send({
      title: 'test1',
      desc: 'new Desc',
    });
    expect(result.status).toBe(200);
    expect(result.body.data).toEqual({
      id: catalogId,
      user_id: 'test',
      title: 'test1',
      desc: 'new Desc',
    });
  });

  it('not update catalog if id is wrong', async () => {
    const result = await supertest(app).put(`/catalog/update/halodek`).set('Authorization', 'test').send({
      title: 'test1',
      desc: 'new Desc',
    });

    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
    expect(result.body.errors).toBe('Catalog is not found');
  });

  it('update if only 1 data is sent', async () => {
    const catalogId = (await getAllTestCatalog())[0].id;
    const result = await supertest(app).put(`/catalog/update/${catalogId}`).set('Authorization', 'test').send({
      title: 'test1',
    });

    expect(result.status).toBe(200);
  });
});

describe('DELETE /catalog/delete/:id', () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestCatalog();
  });
  afterEach(async () => {
    await deleteTestUser();
  });
  it('delete catalog', async () => {
    const catalogId = (await getAllTestCatalog())[0].id;
    const result = await supertest(app).delete(`/catalog/delete/${catalogId}`).set('Authorization', 'test');

    const catalogsCount = await prismaClient.catalog.count({
      where: {
        id: catalogId,
      },
    });
    expect(result.status).toBe(200);
    expect(result.body.data).toBe('OK');
    expect(catalogsCount).toBe(0);
  });
  it('error if token wrong for deletion', async () => {
    const catalogId = (await getAllTestCatalog())[0].id;
    const result = await supertest(app).delete(`/catalog/delete/${catalogId}`).set('Authorization', 'invalid');

    await deleteTestCatalog();
    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });

  it('error if id not found', async () => {
    const result = await supertest(app).delete(`/catalog/delete/test`).set('Authorization', 'test');

    await deleteTestCatalog();
    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
  });
});
