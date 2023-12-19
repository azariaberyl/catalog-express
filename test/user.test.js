import supertest from 'supertest';
import { app } from '../src/application/web';
import { deleteTestUser } from './test-utils';

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
