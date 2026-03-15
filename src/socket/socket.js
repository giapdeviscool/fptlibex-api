import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import chatService from '../service/chat.service.js';

let io;

const setupSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
        },
        transports: ["websocket"],
    });

    // Middleware: Verifying JWT for Socket.IO
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            if (!token) {
                return next(new Error('Authentication error: Token missing'));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
            // We usually store studentId or userId in token.
            // Let's find the user to be sure.
            const user = await User.findOne({
                $or: [
                    { studentId: decoded.studentId },
                    { _id: decoded._id }
                ]
            });
            if (!user) {
                return next(new Error('Authentication error: User not found'));
            }

            socket.user = user;
            next();
        } catch (err) {
            next(new Error('Authentication error: Invalid token'));
        }
    });

    io.on('connection', async (socket) => {
        const userId = socket.user._id.toString();
        console.log(`User connected: ${socket.user.name} (${userId})`);

        // Join a private room for this user
        socket.join(userId);

        // Update online status
        await User.findByIdAndUpdate(userId, { isOnline: true, lastActive: Date.now() });
        io.emit('user_status_change', { userId, isOnline: true });

        // Lắng nghe sự kiện gửi tin nhắn qua Socket
        socket.on('send_message', async (data) => {
            try {
                console.log('Client gửi tin nhắn:', data);
                const { conversationId, text, image } = data;
                
                if (!conversationId || (!text && !image)) {
                    return socket.emit('message_error', { message: "Thiếu nội dung tin nhắn hoặc hình ảnh" });
                }
                
                // Gọi service gửi tin nhắn theo ID cuộc hội thoại
                const message = await chatService.sendMessageByConversation(userId, conversationId, text, image);

                // Gửi phản hồi lại cho người gửi
                socket.emit('message_sent', { success: true, messageId: message._id });
            } catch (error) {
                console.error('Socket send_message error:', error);
                socket.emit('message_error', { message: error.message });
            }
        });

        socket.on('disconnect', async () => {
            console.log(`User disconnected: ${userId}`);
            await User.findByIdAndUpdate(userId, { isOnline: false, lastActive: Date.now() });
            io.emit('user_status_change', { userId, isOnline: false });
        });
    });

    return io;
};

const getIO = () => {
    if (!io) {
        throw new Error('Socket.IO not initialized');
    }
    return io;
};

export { setupSocket, getIO };
