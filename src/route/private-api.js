import express from 'express';
import multer from 'multer';
import catalogController from '../controller/catalog-controller.js';
import userController from '../controller/user-controller.js';
import ResponseError from '../error/response-error.js';
import authMiddleware from '../middleware/auth-middleware.js';
import { imageWhitelist } from '../utils/global.js';

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (!imageWhitelist.includes(file.mimetype)) {
      return cb(new ResponseError(400, 'file is not allowed'));
    }

    cb(null, true);
  },
});

const privateApi = express.Router();
privateApi.use(authMiddleware);

privateApi.get('/users/current', userController.get);
privateApi.patch('/users/current', userController.update);
privateApi.delete('/users/current', userController.logout);

//Catalog

privateApi.get('/catalog/:username', catalogController.getAll);
privateApi.post('/catalog/create', upload.array('images'), catalogController.create);
privateApi.put('/catalog/update/:id', upload.array('images'), catalogController.update);
privateApi.delete('/catalog/delete/:id', catalogController.del);

export default privateApi;
