import express from 'express';
import userController from '../controller/user-controller.js';
import catalogController from '../controller/catalog-controller.js';

const publicApi = express.Router();
// Get image url
publicApi.use('/images', express.static('images')); // Prefix path

publicApi.post('/users/register', userController.register);
publicApi.post('/users/login', userController.login);
publicApi.get('/catalog/:username', catalogController.getAll);
publicApi.get('/catalog/:username/:id', catalogController.get);

export default publicApi;
