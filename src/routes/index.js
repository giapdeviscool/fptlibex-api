import express from 'express';
import usersRouter from './users.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
const router = express.Router();

/* GET home page. */
router.use('/users', authMiddleware, usersRouter);

export default router;
