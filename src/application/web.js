import express from 'express';
import errorMiddleware from '../middleware/error-middleware';
import publicApi from '../route/public-api';
import privateApi from '../route/private-api';

export const app = express();
app.use(express.json());
app.use(publicApi);
app.use(privateApi);
app.use(errorMiddleware);
