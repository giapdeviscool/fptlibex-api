import { Conversation } from '../models/Conversation.js';
import { Message } from '../models/Message.js';
import { User } from '../models/User.js';
import { getIO } from '../socket/socket.js';

const chatService = {
    // Get all conversations for a user
    async getConversations(userId) {
        const conversations = await Conversation.find({
            participants: userId
        })
            .populate('participants', 'name isOnline avatar')
            .populate('book', 'title price image')
            .populate({
                path: 'lastMessage',
                populate: { path: 'sender', select: 'name' }
            })
            .sort({ updatedAt: -1 });
        let totalUnread = 0;

        const formattedConversations = conversations.map(conv => {
            const otherUser = conv.participants.find(p => p._id.toString() !== userId.toString());
            const lastMsg = conv.lastMessage;

            const unreadCount = conv.unreadCount.get(userId.toString()) || 0;
            totalUnread += unreadCount;

            // Format time (e.g., "2 phút", "1 giờ")
            const now = new Date();
            const lastUpdate = new Date(conv.updatedAt);
            const diffInMinutes = Math.floor((now - lastUpdate) / 60000);

            let timeStr = "";
            if (diffInMinutes < 1) timeStr = "Vừa xong";
            else if (diffInMinutes < 60) timeStr = `${diffInMinutes} phút`;
            else if (diffInMinutes < 1440) timeStr = `${Math.floor(diffInMinutes / 60)} giờ`;
            else timeStr = `${Math.floor(diffInMinutes / 1440)} ngày`;

            return {
                id: conv._id,
                userName: otherUser?.name || 'Người dùng hệ thống',
                avatarInitial: otherUser?.name ? otherUser.name.charAt(0).toUpperCase() : '?',
                lastMessage: lastMsg ? lastMsg.content : 'Bắt đầu cuộc trò chuyện',
                time: timeStr,
                unreadCount: unreadCount,
                bookTitle: conv.book?.title || 'Sách không còn tồn tại',
                bookPrice: conv.book?.price || 0,
                isOnline: otherUser?.isOnline || false
            };
        });

        return {
            totalUnread,
            conversations: formattedConversations
        };
    },

    // Get messages for a specific conversation
    async getMessages(conversationId) {
        const messages = await Message.find({ conversation: conversationId })
            .populate('sender', 'name avatar')
            .populate('recipient', 'name avatar')
            .sort({ createdAt: 1 });
        return messages;
    },

    // Send a message via conversationId (New flow)
    async sendMessageByConversation(senderId, conversationId, content) {
        // 1. Find conversation
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) throw new Error("Không tìm thấy cuộc hội thoại");
        console.log(senderId)
        const recipientId = conversation.participants.find(p => p.toString() !== senderId.toString());

        // 2. Create message
        const message = await Message.create({
            conversation: conversation._id,
            sender: senderId,
            recipient: recipientId,
            content
        });

        // 3. Update conversation lastMessage and unread counts
        conversation.lastMessage = message._id;

        // Increment unread count for recipient
        const currentUnread = conversation.unreadCount.get(recipientId.toString()) || 0;
        conversation.unreadCount.set(recipientId.toString(), currentUnread + 1);

        await conversation.save();

        // 4. Emit real-time event via Socket.IO
        try {
            const io = getIO();
            io.to(recipientId.toString()).emit('new_message', {
                conversationId: conversation._id,
                message: {
                    id: message._id,
                    content: message.content,
                    sender: senderId,
                    createdAt: message.createdAt
                },
                bookTitle: (await conversation.populate('book')).book?.title,
                senderName: (await User.findById(senderId)).name
            });
        } catch (err) {
            console.error('Socket.IO emit error:', err);
        }

        return message;
    },

    // Send a message by recipient and book (Legacy flow)
    async sendMessage(senderId, recipientId, bookId, content) {
        // 1. Find or create conversation
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, recipientId] },
            book: bookId
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, recipientId],
                book: bookId
            });
        }

        // 2. Create message
        const message = await Message.create({
            conversation: conversation._id,
            sender: senderId,
            recipient: recipientId,
            content
        });

        // 3. Update conversation lastMessage and unread counts
        conversation.lastMessage = message._id;

        // Increment unread count for recipient
        const currentUnread = conversation.unreadCount.get(recipientId.toString()) || 0;
        conversation.unreadCount.set(recipientId.toString(), currentUnread + 1);

        await conversation.save();

        // 4. Emit real-time event via Socket.IO
        try {
            const io = getIO();
            io.to(recipientId.toString()).emit('new_message', {
                conversationId: conversation._id,
                message: {
                    id: message._id,
                    content: message.content,
                    sender: senderId,
                    createdAt: message.createdAt
                },
                // Add more info for the conversation list update
                bookTitle: (await conversation.populate('book')).book?.title,
                senderName: (await User.findById(senderId)).name
            });
        } catch (err) {
            console.error('Socket.IO emit error:', err);
        }

        return message;
    },

    // Mark messages as read
    async markAsRead(conversationId, userId) {
        const conversation = await Conversation.findById(conversationId);
        if (conversation) {
            conversation.unreadCount.set(userId.toString(), 0);
            await conversation.save();
        }

        await Message.updateMany(
            { conversation: conversationId, sender: { $ne: userId } },
            { $set: { isRead: true } }
        );
    },

    // Find or Create conversation room (Shopee/Chợ Tốt flow)
    async getOrCreateConversation(recipientStudentCode, senderId, bookId) {

        const recipient = await User.findOne({ studentId: recipientStudentCode });

        let conversation = await Conversation.findOne({
            book: bookId
        }).populate('participants', 'name avatar isOnline')
            .populate('book', 'title price image');

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, recipient._id],
                book: bookId
            });
            // Re-populate for consistent return format
            conversation = await Conversation.findById(conversation._id)
                .populate('participants', 'name avatar isOnline')
                .populate('book', 'title price image');
        }

        return conversation;
    }
};

export default chatService;
