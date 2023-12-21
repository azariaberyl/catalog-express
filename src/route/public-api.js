import express from 'express';
import userController from '../controller/user-controller';

const publicApi = express.Router();

publicApi.post('/users/register', userController.register);
publicApi.post('/users/login', userController.login);

export default publicApi;
