import bookService from "../service/book.service.js";
import { uploadFile } from "../service/cloud.service.js";

class BookController {
    // --- NGHIỆP VỤ BÁN SÁCH ---

    static async createBookSelling(req, res) {
        try {
            const bookData = req.body;

            const book = await bookService.createBookSelling(bookData);
            return res.status(201).json({ success: true, data: book, message: "Đăng bán sách thành công" });
        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    static async getBooks(req, res) {
        try {
            const query = req.query || {};
            const books = await bookService.getBooks(query);
            return res.status(200).json({ success: true, data: books });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    static async getBooksBySeller(req, res) {
        try {
            const { studentId } = req.params;
            const books = await bookService.getBooksBySeller(studentId);
            return res.status(200).json({ success: true, data: books });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    static async getBookById(req, res) {
        try {
            const { id } = req.params;
            const book = await bookService.getBookById(id);
            return res.status(200).json({ success: true, data: book });
        } catch (error) {
            return res.status(404).json({ success: false, message: error.message });
        }
    }

    static async updateBook(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const book = await bookService.updateBook(id, updateData);
            return res.status(200).json({ success: true, data: book, message: "Cập nhật sách thành công" });
        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    static async deleteBook(req, res) {
        try {
            const { id } = req.params;
            const book = await bookService.deleteBook(id);
            return res.status(200).json({ success: true, data: book, message: "Xóa sách thành công" });
        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    // --- NGHIỆP VỤ ĐẶT HÀNG ---

    static async createOrder(req, res) {
        try {
            const orderData = req.body;
            const order = await bookService.createOrder(orderData);
            return res.status(201).json({ success: true, data: order, message: "Tạo đơn hàng thành công" });
        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    static async getOrdersByUser(req, res) {
        try {
            const { userId } = req.params;
            const orders = await bookService.getOrdersByUser(userId);
            return res.status(200).json({ success: true, data: orders });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    static async getOrderById(req, res) {
        try {
            const { id } = req.params;
            const order = await bookService.getOrderById(id);
            return res.status(200).json({ success: true, data: order });
        } catch (error) {
            return res.status(404).json({ success: false, message: error.message });
        }
    }

    static async updateOrderStatus(req, res) {
        try {
            const { id } = req.params;
            const statusData = req.body; // Cần có { status, statusLabel }
            const order = await bookService.updateOrderStatus(id, statusData);
            return res.status(200).json({ success: true, data: order, message: "Cập nhật trạng thái đơn hàng thành công" });
        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    static async cancelOrder(req, res) {
        try {
            const { id } = req.params;
            const order = await bookService.cancelOrder(id);
            return res.status(200).json({ success: true, data: order, message: "Đã hủy đơn hàng thành công" });
        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }
}

export default BookController;