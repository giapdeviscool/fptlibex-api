import express from 'express';
import BookController from '../controller/book.controller.js';
import upload from 'multer';

const router = express.Router();

const storage = upload.memoryStorage();
const multerUpload = upload({ storage });

// --- ROUTES CHO SÁCH (BOOK SELLING) ---

// Lấy danh sách tất cả các sách (Hỗ trợ query filter)
router.get('/', BookController.getBooks);

// Lấy thông tin chi tiết của 1 cuốn sách
router.get('/:id', BookController.getBookById);

// Tìm sách theo mã sinh viên của người bán
router.get('/seller/:studentId', BookController.getBooksBySeller);



// Đăng bán một cuốn sách mới
router.post('/', multerUpload.single('image'), BookController.createBookSelling);

// Cập nhật thông tin một cuốn sách (Dành cho người bán)
router.put('/:id', BookController.updateBook);

// Xóa một cuốn sách (Dành cho người bán)
router.delete('/:id', BookController.deleteBook);


// --- ROUTES CHO ĐƠN HÀNG (ORDERS) ---

// Tạo một đơn đặt hàng mới
router.post('/orders', BookController.createOrder);

// Lấy danh sách tất cả các đơn hàng của 1 user (Mua hoặc Bán)
router.get('/orders/user/:userId', BookController.getOrdersByUser);

// Lấy chi tiết của một đơn hàng
router.get('/orders/:id', BookController.getOrderById);

// Cập nhật trạng thái đơn đặt hàng (Ví dụ: pending -> confirmed -> shipping -> completed)
router.patch('/orders/:id/status', BookController.updateOrderStatus);

// Hủy đơn hàng
router.patch('/orders/:id/cancel', BookController.cancelOrder);

export default router;
