import express from 'express';
import userController from '../controller/user-controller';
import authMiddleware from '../middleware/auth-middleware';

const privateApi = express.Router();
privateApi.use(authMiddleware);

privateApi.patch('/users/current', userController.update);
privateApi.delete('/users/current', userController.logout);

export default privateApi;
