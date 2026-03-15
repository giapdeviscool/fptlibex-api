import chatService from "../service/chat.service.js";

class ChatController {
    static async getConversations(req, res) {
        try {
            const userId = req.user._id;
            const conversations = await chatService.getConversations(userId);
            res.status(200).json({ success: true, data: conversations });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async getMessages(req, res) {
        try {
            const { conversationId } = req.params;

            const messages = await chatService.getMessages(conversationId);
            // Mark as read when opening conversation
            await chatService.markAsRead(conversationId, req.user._id);

            res.status(200).json({ success: true, data: messages });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async sendMessage(req, res) {
        try {
            const senderId = req.user.id;
            const { recipientId, bookId, content } = req.body;

            if (!recipientId || !bookId || !content) {
                return res.status(400).json({ success: false, message: "Thiếu thông tin tin nhắn" });
            }

            const message = await chatService.sendMessage(senderId, recipientId, bookId, content);
            res.status(201).json({ success: true, data: message });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async getOrCreateConversation(req, res) {
        try {
            const { recipientStudentCode, bookId, senderId } = req.body;

            if (!recipientStudentCode || !bookId || !senderId) {
                return res.status(400).json({ success: false, message: "Thiếu thông tin người nhận hoặc sách" });
            }

            const conversation = await chatService.getOrCreateConversation(recipientStudentCode, senderId, bookId);
            res.status(200).json({ success: true, data: conversation });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

export default ChatController;
