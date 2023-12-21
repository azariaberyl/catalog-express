import supertest from 'supertest';
import { app } from '../src/application/web';
import { createTestCatalog, createTestUser, deleteTestCatalog, deleteTestUser } from './test-utils';
import { logger } from '../src/application/logging';

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

describe.only('GET /catalog/:username', () => {
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

    console.log(result.body);

    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
  });
});
