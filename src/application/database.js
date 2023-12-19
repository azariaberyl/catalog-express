import { PrismaClient } from '@prisma/client';
import { logger } from './logging';

export const prismaClient = new PrismaClient({
  log: [
    { level: 'info', emit: 'event' },
    { level: 'warn', emit: 'event' },
    { level: 'error', emit: 'event' },
  ],
});

prisma.$on('query', (e) => {
  logger.info(e);
});
prisma.$on('warn', (e) => {
  logger.warn(e);
});
prisma.$on('info', (e) => {
  logger.info(e);
});
prisma.$on('error', (e) => {
  logger.error(e);
});
