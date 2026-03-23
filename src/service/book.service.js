import { Book } from '../models/Book.js';
import { Order } from '../models/Order.js';
import { User } from '../models/User.js';
import mongoose from 'mongoose';

const bookService = {
    // --- BOOK SELLING ---

    async createBookSelling(bookData) {
        const book = await Book.create(bookData);
        return await book.populate('seller', 'name avatar studentId');
    },

    async getBooks(query = {}) {
        return await Book.find(query).populate('seller', 'name avatar studentId');
    },

    async getBooksBySeller(studentId) {
        return await Book.find({ seller: studentId });
    },

    async getBookById(bookId) {
        const book = await Book.findById(bookId).populate('seller', 'name avatar studentId');
        if (!book) {
            throw new Error('Book not found');
        }
        return book;
    },

    async updateBook(bookId, updateData) {
        const book = await Book.findByIdAndUpdate(
            bookId,
            { $set: updateData },
            { new: true }
        );
        if (!book) {
            throw new Error('Book not found');
        }
        return book;
    },

    async deleteBook(bookId) {
        const book = await Book.findByIdAndDelete(bookId);
        if (!book) {
            throw new Error('Book not found');
        }
        return book;
    },

    // --- ORDERS ---

    async createOrder(orderData) {
        // Find book - should pass book ID from frontend
        const book = await Book.findById(orderData.bookId);
        if (!book) {
            throw new Error('Book not found');
        }

        // Find buyer by StudentId
        const buyer = await User.findOne({
            studentId: orderData.buyer
        });

        if (!buyer) {
            throw new Error('Buyer not found');
        }

        // Find seller by StudentId
        const seller = await User.findOne({
            studentId: orderData.seller
        });
        if (!seller) {
            throw new Error('Seller not found');
        }

        const order = await Order.create({
            book: book._id,
            buyer: buyer._id,
            seller: seller._id,
            status: 'pending',
            statusLabel: 'Đang chờ'
        });

        return order;
    },

    async getOrdersByUser(userId) {
        // Find user by studentId first
        const user = await User.findOne({
            studentId: userId
        });
        if (!user) {
            return [];
        }
        // Retrieve all orders where the user is either the buyer or the seller
        const orders = await Order.find({
            $or: [{ buyer: user._id }, { seller: user._id }]
        }).populate('book buyer seller');

        // Transform to requested format for UI
        return orders;
    },

    async getOrderById(orderId) {
        if (!mongoose.isValidObjectId(orderId)) {
            throw new Error('Mã đơn hàng không hợp lệ (Phải là ObjectId)');
        }
        const order = await Order.findById(orderId).populate('book buyer seller');
        if (!order) throw new Error('Order not found');
        return order;
    },

    async updateOrderStatus(orderId, statusData) {
        if (!mongoose.isValidObjectId(orderId)) {
            throw new Error('Mã đơn hàng không hợp lệ (Phải là ObjectId)');
        }
        // statusData should contain status and statusLabel based on Order schema
        const order = await Order.findByIdAndUpdate(
            orderId,
            { $set: statusData },
            { new: true }
        );

        if (!order) {
            throw new Error('Order not found');
        }
        return order;
    },

    async cancelOrder(orderId) {
        if (!mongoose.isValidObjectId(orderId)) {
            throw new Error('Mã đơn hàng không hợp lệ');
        }

        const order = await Order.findById(orderId);
        if (!order) {
            throw new Error('Không tìm thấy đơn hàng');
        }

        // Chỉ cho phép hủy nếu đang ở trạng thái pending hoặc confirmed
        if (order.status === 'shipping' || order.status === 'completed') {
            throw new Error('Không thể hủy đơn hàng đã đang giao hoặc đã hoàn thành');
        }

        order.status = 'cancelled';
        order.statusLabel = 'Đã hủy';
        await order.save();

        return order;
    }
};

export default bookService;
