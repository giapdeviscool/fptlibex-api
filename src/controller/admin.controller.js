import { User } from '../models/User.js';
import { Book } from '../models/Book.js';
import { Order } from '../models/Order.js';

class AdminController {
    // Lay thong ke tong quan
    static async getStats(req, res) {
        try {
            const data = await bookService.getStats();
            return res.status(200).json({
                success: true,
                data
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    // Quan ly nguoi dung
    static async getAllUsers(req, res) {
        try {
            const users = await User.find().select('-password');
            return res.status(200).json({ success: true, data: users });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    static async updateUserRole(req, res) {
        try {
            const { id } = req.params;
            const { role } = req.body;

            if (!['user', 'admin'].includes(role)) {
                return res.status(400).json({ success: false, message: 'Role không hợp lệ' });
            }

            const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select('-password');
            return res.status(200).json({ success: true, data: user, message: 'Cập nhật quyền thành công' });
        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    static async updateUserStatus(req, res) {
        try {
            const { id } = req.params;
            const { isBanned } = req.body;

            if (id === req.user._id) {
                return res.status(400).json({ success: false, message: 'Bạn không thể tự khóa chính mình!' });
            }

            const user = await User.findByIdAndUpdate(id, { isBanned }, { new: true }).select('-password');
            const message = isBanned ? 'Đã khóa tài khoản thành công' : 'Đã mở khóa tài khoản thành công';
            return res.status(200).json({ success: true, data: user, message });
        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    static async deleteUser(req, res) {
        try {
            const { id } = req.params;
            
            // Khong cho phep admin tu xoa chinh minh (neu can)
            if (id === req.user._id) {
                return res.status(400).json({ success: false, message: 'Bạn không thể tự xóa chính mình!' });
            }

            const user = await User.findByIdAndDelete(id);
            if (!user) {
                return res.status(404).json({ success: false, message: 'Người dùng không tồn tại' });
            }

            // Xoa cac du lieu lien quan neu can (xoa sach cua user nay chang han)
            await Book.deleteMany({ seller: id });

            return res.status(200).json({ success: true, message: 'Xóa người dùng và dữ liệu liên quan thành công' });
        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    // Phe duyet sach
    static async getPendingBooks(req, res) {
        try {
            const books = await Book.find({ status: 'pending' }).populate('seller', 'name studentId avatar');
            return res.status(200).json({ success: true, data: books });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    static async approveBook(req, res) {
        try {
            const { id } = req.params;
            const book = await Book.findByIdAndUpdate(
                id, 
                { status: 'approved', statusLabel: 'Đã duyệt' }, 
                { new: true }
            );
            return res.status(200).json({ success: true, data: book, message: 'Đã duyệt sách thành công' });
        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    static async rejectBook(req, res) {
        try {
            const { id } = req.params;
            const book = await Book.findByIdAndUpdate(
                id, 
                { status: 'rejected', statusLabel: 'Bị từ chối' }, 
                { new: true }
            );
            return res.status(200).json({ success: true, data: book, message: 'Đã từ chối duyệt sách' });
        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    // Xem tat ca don hang
    static async getAllOrders(req, res) {
        try {
            const orders = await Order.find().populate('book buyer seller');
            return res.status(200).json({ success: true, data: orders });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
}

export default AdminController;
