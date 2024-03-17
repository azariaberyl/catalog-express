import express from 'express';
import userController from '../controller/user-controller.js';
import catalogController from '../controller/catalog-controller.js';

const publicApi = express.Router();
// Get image url
publicApi.use('/images', express.static('images')); // Prefix path

// user
publicApi.post('/users/register', userController.register);
publicApi.post('/users/login', userController.login);
// catalog
publicApi.get('/catalog/:username/:id', catalogController.get);
publicApi.get('/catalog/search', catalogController.search);

export default publicApi;
