import express from 'express';
import userController from '../controller/user-controller';
import authMiddleware from '../middleware/auth-middleware';
import catalogController from '../controller/catalog-controller';

const privateApi = express.Router();
privateApi.use(authMiddleware);

privateApi.get('/users/current', userController.get);
privateApi.patch('/users/current', userController.update);
privateApi.delete('/users/current', userController.logout);

//Catalog

privateApi.post('/catalog/create', catalogController.create);
privateApi.put('/catalog/update/:id', catalogController.update);
privateApi.delete('/catalog/delete/:id', catalogController.del);

export default privateApi;
