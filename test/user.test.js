import supertest from 'supertest';
import { app } from '../src/application/web';
import { createTestUser, deleteTestUser } from './test-utils';
import { prismaClient } from '../src/application/database';
import { compare, hash } from 'bcrypt';

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
    expect(res.body.errors).toBeDefined();
  });
});

describe('POST users/login', () => {
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

  it('not login if password or email wrong', async () => {
    const res = await supertest(app).post('/users/login').send({
      email: 'test@gmail.com',
      password: 'wrongpasword',
    });

    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors).toBe('Invalid email or password');
  });
});

describe('PATCH /users/current', () => {
  beforeEach(async () => {
    await createTestUser();
  });
  afterEach(async () => {
    await deleteTestUser();
  });

  it('update user', async () => {
    const result = await supertest(app).patch('/users/current').set('Authorization', 'test').send({
      name: 'New Full Name', // Optional
      password: 'new_secure_password', // Optional
    });

    expect(result.status).toBe(200);
    const user = await prismaClient.user.findUnique({
      where: {
        username: 'test',
      },
    });
    expect(user.name).toBe('New Full Name');
    expect(await compare('new_secure_password', user.password)).toBe(true);
  });

  it('not update user if no data is sent', async () => {
    const result = await supertest(app).patch('/users/current').set('Authorization', 'test');

    expect(result.status).toBe(200);
    const user = await prismaClient.user.findUnique({
      where: {
        username: 'test',
      },
    });
    expect(user.name).toBe('test');
    expect(await compare('test', user.password)).toBe(true);
  });

  it('not update user if token invalid', async () => {
    const result = await supertest(app)
      .patch('/users/current')
      .send({
        name: 'New Full Name', // Optional
        password: 'new_secure_password', // Optional
      })
      .set('Authorization', 'invalid');

    expect(result.status).toBe(401);
    expect(result.body.errors).toBe('Unauthorized, Please login again');
  });

  it('not update user if token invalid', async () => {
    const result = await supertest(app).patch('/users/current').set('Authorization', 'wrongtoken').send({
      name: 'New Full Name', // Optional
      password: 'new_secure_password', // Optional
    });

    expect(result.status).toBe(401);
    expect(result.body.errors).toBe('Unauthorized, Please login again');
  });
});

describe('DELETE /users/current', () => {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await deleteTestUser();
  });

  it('delete user if token valid', async () => {
    const result = await supertest(app).delete('/users/current').set('Authorization', 'test');

    expect(result.status).toBe(200);
    const user = await prismaClient.user.findUnique({
      where: {
        username: 'test',
      },
      select: {
        token: true,
      },
    });
    expect(user.token).toBe(null);
  });

  it('error if token invalid', async () => {
    const result = await supertest(app).delete('/users/current').set('Authorization', 'invalid');

    expect(result.status).toBe(401);
    expect(result.body.errors).toBe('Unauthorized, Please login again');
  });
});

describe('GET /users/current', () => {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await deleteTestUser();
  });

  it('get user', async () => {
    const result = await supertest(app).get('/users/current').set('Authorization', 'test');

    expect(result.status).toBe(200);
    expect(result.body.data).toEqual({ username: 'test', name: 'test', email: 'test@test.com' });
  });

  it('not get user if token invalid', async () => {
    const result = await supertest(app).get('/users/current').set('Authorization', 'invalid');

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });
});
