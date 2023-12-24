import express from 'express';
import errorMiddleware from '../middleware/error-middleware.js';
import publicApi from '../route/public-api.js';
import privateApi from '../route/private-api.js';
import cors from 'cors';

export const app = express();
app.use(cors());
app.use(express.json());
app.use(publicApi);
app.use(privateApi);
app.use(errorMiddleware);
