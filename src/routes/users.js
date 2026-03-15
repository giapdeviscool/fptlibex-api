import express from 'express';
import UserController from '../controller/user.controller.js';

const router = express.Router();

router.get('/', UserController.getAll);
router.get('/profile', UserController.getById);
router.post('/create', UserController.create);
router.put('/profile', UserController.update);
router.delete('/:id', UserController.delete);

export default router;
