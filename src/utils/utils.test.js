import { prismaClient } from '../application/database';
import { fetchUser } from './utils';

describe('fetchUser', () => {
  beforeEach(async () => {
    // Create a test user
    await prismaClient.user.create({
      data: {
        id: 'testUserId',
        name: 'Test User',
        email: 'test@test.com',
        username: 'testuser',
        password: 'testpassword',
      },
    });
  });

  afterEach(async () => {
    // Delete the test user
    await prismaClient.user.delete({
      where: {
        id: 'testUserId',
      },
    });
  });

  it('should fetch a user by id', async () => {
    const user = await fetchUser(prismaClient, 'testUserId');

    expect(user).toBeDefined();
    expect(user.id).toBe('testUserId');
    expect(user.name).toBe('Test User');
    expect(user.email).toBe('test@test.com');
    expect(user.username).toBe('testuser');
    expect(user.password).toBe('testpassword');
  });

  it('should return null if user is not found', async () => {
    const user = await fetchUser(prismaClient, 'nonExistentUserId');

    expect(user).toBeNull();
  });

  it('should fetch a user without specifying id', async () => {
    const user = await fetchUser(prismaClient);

    expect(user).toBeDefined();
    expect(user.id).toBe('testUserId');
    expect(user.name).toBe('Test User');
    expect(user.email).toBe('test@test.com');
    expect(user.username).toBe('testuser');
    expect(user.password).toBe('testpassword');
  });
});
