import express from 'express';
import catalogController from '../controller/catalog-controller.js';
import userController from '../controller/user-controller.js';
import authMiddleware from '../middleware/auth-middleware.js';
import { upload } from '../service/catalog-service.js';

const privateApi = express.Router();
privateApi.use(authMiddleware);

privateApi.get('/users/current', userController.get);
privateApi.patch('/users/current', userController.update);
privateApi.delete('/users/current', userController.logout);

//Catalog

privateApi.get('/catalog/customCode', catalogController.getCustomCode);
privateApi.get('/catalog/:username', catalogController.getAll);
privateApi.post('/catalog/create', upload.array('images'), catalogController.create);
privateApi.put('/catalog/update/:id', upload.array('images'), catalogController.update);
privateApi.delete('/catalog/delete/:id', catalogController.del);

export default privateApi;
