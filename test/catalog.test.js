import supertest from 'supertest';
import { app } from '../src/application/web';
import { createTestCatalog, createTestUser, deleteTestCatalog, deleteTestUser, getAllTestCatalog } from './test-utils';
import { logger } from '../src/application/logging';
import { v4 } from 'uuid';

describe('POST /catalog/create', () => {
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

    it('Get all  catalog', async () => {
      const result = await supertest(app).get('/catalog/test');

      expect(result.status).toBe(200);
      expect(result.body.data.catalog).toBeDefined();
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
    console.log(result.body);
  });
});
