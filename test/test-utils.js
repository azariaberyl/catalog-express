import { prismaClient } from '../src/application/database';

const deleteTestUser = async () => {
  await prismaClient.user.delete({
    where: {
      username: 'test',
    },
  });
};

export { deleteTestUser };
