import express from 'express';
import userController from '../controller/user-controller';
import catalogController from '../controller/catalog-controller';

const publicApi = express.Router();

publicApi.post('/users/register', userController.register);
publicApi.post('/users/login', userController.login);
publicApi.get('/catalog/:username', catalogController.getAll);
publicApi.get('/catalog/:username/:id', catalogController.get);

export default publicApi;
