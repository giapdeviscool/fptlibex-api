import { Book } from '../models/Book.js';
import { Order } from '../models/Order.js';
import { User } from '../models/User.js';
import { Transaction } from '../models/Transaction.js';
import mongoose from 'mongoose';

const bookService = {
    // --- BOOK SELLING ---

    async createBookSelling(bookData, userId) {
        const book = await Book.create({
            ...bookData,
            seller: userId,
            status: 'pending',
            statusLabel: 'Đang chờ'
        });
        return await book.populate('seller', 'name avatar studentId');
    },

    async getBooks(query = {}) {
        // Chi lay nhung sach da duoc duyet
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

        if ((buyer.balance || 0) < book.price) {
            throw new Error('Số dư F-Coin không đủ để thanh toán');
        }

        buyer.balance -= book.price;
        await buyer.save();

        const order = await Order.create({
            book: book._id,
            buyer: buyer._id,
            seller: seller._id,
            status: 'pending',
            statusLabel: 'Đang chờ'
        });

        await Transaction.create({
            user: buyer._id,
            type: 'payment',
            amount: book.price,
            status: 'completed',
            description: `Thanh toán mua sách: ${book.title}`,
            orderOrigin: order._id
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
        const originalOrder = await Order.findById(orderId);
        if (!originalOrder) {
            throw new Error('Order not found');
        }
        const previousStatus = originalOrder.status;

        const order = await Order.findByIdAndUpdate(
            orderId,
            { $set: statusData },
            { new: true }
        ).populate('book');

        if (statusData.status === 'completed' && previousStatus !== 'completed') {
            const seller = await User.findById(order.seller);
            if (seller && order.book) {
                seller.balance = (seller.balance || 0) + order.book.price;
                await seller.save();

                await Transaction.create({
                    user: seller._id,
                    type: 'receive',
                    amount: order.book.price,
                    status: 'completed',
                    description: `Nhận tiền bán sách: ${order.book.title}`,
                    orderOrigin: order._id
                });
            }
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

        // Hoàn tiền cho người mua
        const book = await Book.findById(order.book);
        const buyer = await User.findById(order.buyer);
        if (buyer && book) {
            buyer.balance = (buyer.balance || 0) + book.price;
            await buyer.save();

            await Transaction.create({
                user: buyer._id,
                type: 'receive',
                amount: book.price,
                status: 'completed',
                description: `Hoàn tiền hủy đơn sách: ${book.title}`,
                orderOrigin: order._id
            });
        }

        order.status = 'cancelled';
        order.statusLabel = 'Đã hủy';
        await order.save();

        return order;
    },

    async getStats() {
        const totalUsers = await User.countDocuments();
        const allBooks = await Book.find({}); // Get all books regardless of status
        const completedOrders = await Order.find({ status: 'completed' });

        const soldBookIds = new Set(completedOrders.map(order => order.book.toString()));
        const totalBooksSold = soldBookIds.size;
        const totalBooksSelling = allBooks.filter(book => !soldBookIds.has(book._id.toString())).length;

        const totalOrders = await Order.countDocuments({ status: 'completed' });

        const completedOrdersPopulated = await Order.find({ status: 'completed' }).populate('book');
        const totalRevenue = completedOrdersPopulated.reduce((acc, order) => acc + (order.book?.price || 0), 0);

        const totalSellers = new Set(allBooks.map(book => book.seller.toString())).size;

        return {
            totalUsers,
            totalBooks: allBooks.length,
            totalBooksSelling,
            totalBooksSold,
            totalOrders,
            totalRevenue,
            totalSellers
        };
    }
};

export default bookService;
