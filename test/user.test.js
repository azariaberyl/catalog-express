import supertest from 'supertest';
import { app } from '../src/application/web';
import { createTestUser, deleteTestUser } from './test-utils';

describe('POST users/register', () => {
  it('create user', async () => {
    const res = await supertest(app).post('/users/register').send({
      email: 'test@test.com',
      password: 'test',
      username: 'test',
      name: 'test',
    });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      data: {
        email: 'test@test.com',
        username: 'test',
        name: 'test',
      },
    });

    await deleteTestUser();
  });

  it('not create user if email is invalid', async () => {
    const res = await supertest(app).post('/users/register').send({
      email: 'test',
      password: 'test',
      username: 'test',
      name: 'test',
    });

    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });
  it('not create user if username already exists', async () => {
    let res = await supertest(app).post('/users/register').send({
      email: 'test@test.com',
      password: 'test',
      username: 'test',
      name: 'test',
    });

    expect(res.status).toBe(201);
    expect(res.body.errors).toBeUndefined();

    res = await supertest(app).post('/users/register').send({
      email: 'test@test.com',
      password: 'test',
      username: 'test',
      name: 'test',
    });

    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors).toBe('Username already exist');

    await deleteTestUser();
  });

  it('not create a user if no data has been sent', async () => {
    const res = await supertest(app).post('/users/register').send({
      name: 'test',
    });

    expect(res.status).toBe(400);
    console.log(res.body);
    expect(res.body.errors).toBeDefined();
  });
});

describe.only('POST users/login', () => {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await deleteTestUser();
  });

  it('login a user', async () => {
    const res = await supertest(app).post('/users/login').send({
      email: 'test@test.com',
      password: 'test',
    });

    expect(res.status).toBe(200);
    expect(res.body.errors).toBeUndefined();
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.token).not.toBe('test');
  });

  it('not login if password or email invalid', async () => {
    const res = await supertest(app).post('/users/login').send({
      email: '',
      password: '',
    });

    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it('not login if password or email doesnt wrong', async () => {
    const res = await supertest(app).post('/users/login').send({
      email: 'test@gmail.com',
      password: 'wrongpasword',
    });

    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });
});
