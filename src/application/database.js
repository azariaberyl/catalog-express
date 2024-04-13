import { PrismaClient } from '@prisma/client';

export const prismaClient = new PrismaClient({
  log: [
    { level: 'info', emit: 'event' },
    { level: 'warn', emit: 'event' },
    { level: 'error', emit: 'event' },
  ],
});

prismaClient.$on('query', (e) => {
  console.info(e);
});
prismaClient.$on('warn', (e) => {
  console.warn(e);
});
prismaClient.$on('info', (e) => {
  console.info(e);
});
prismaClient.$on('error', (e) => {
  console.log(e.message);
});
