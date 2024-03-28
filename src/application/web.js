import express from 'express';
import errorMiddleware from '../middleware/error-middleware.js';
import publicApi from '../route/public-api.js';
import privateApi from '../route/private-api.js';
import cors from 'cors';

const allowedOrigin = [
  'https://catalog-nextjs-git-dev-azariaberyls-projects.vercel.app',
  'https://catalog-nextjs.vercel.app',
];

export const app = express();
app.use(
  cors({
    origin: allowedOrigin,
  })
);
app.use(express.json());
app.use(publicApi);
app.use(privateApi);
app.use(errorMiddleware);
