import express from 'express';
import upload from 'multer';
import UploadController from '../controller/upload.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();
const storage = upload.memoryStorage();
const multerUpload = upload({ storage });

// Route upload ảnh dùng chung
router.post('/', authMiddleware, multerUpload.single('image'), UploadController.uploadImage);

export default router;
