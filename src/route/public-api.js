import express from 'express';
import userController from '../controller/user-controller';

const publicApi = express.Router();

publicApi.post('/users/register', userController.register);

export default publicApi;
