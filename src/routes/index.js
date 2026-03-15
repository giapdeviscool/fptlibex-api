import express from 'express';
import usersRouter from './users.js';
import bookRouter from './book.js';
import authRouter from './auth.js';
import chatRouter from './chat.js';
import uploadRouter from './upload.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
const router = express.Router();

/* GET home page. */
router.use('/auth', authRouter);
router.use('/users', authMiddleware,usersRouter);
router.use('/books', authMiddleware, bookRouter);
router.use('/chat', authMiddleware,chatRouter);
router.use('/upload', uploadRouter);

export default router;
