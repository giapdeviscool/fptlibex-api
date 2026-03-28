import express from 'express';
import AdminController from '../controller/admin.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { adminMiddleware } from '../middleware/admin.middleware.js';

const router = express.Router();

// Tất cả các route admin đều cần login và quyền admin
router.use(authMiddleware, adminMiddleware);

// Thống kê
router.get('/stats', AdminController.getStats);

// Quản lý người dùng
router.get('/users', AdminController.getAllUsers);
router.put('/users/:id/role', AdminController.updateUserRole);
router.put('/users/:id/status', AdminController.updateUserStatus);
router.delete('/users/:id', AdminController.deleteUser);

// Quản lý và phê duyệt sách
router.get('/books/pending', AdminController.getPendingBooks);
router.put('/books/:id/approve', AdminController.approveBook);
router.put('/books/:id/reject', AdminController.rejectBook);

// Xem tất cả đơn hàng
router.get('/orders', AdminController.getAllOrders);

export default router;
