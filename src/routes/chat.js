import express from 'express';
import ChatController from '../controller/chat.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

// Tất cả các route chat đều cần đăng nhập
router.use(authMiddleware);

// Lấy danh sách cuộc hội thoại
router.get('/my-rooms', ChatController.getConversations);

// Lấy tin nhắn của một cuộc hội thoại
router.get('/:conversationId/messages', ChatController.getMessages);

// Gửi tin nhắn mới
router.post('/send', ChatController.sendMessage);

// Tìm hoặc tạo phòng chat (Luồng "Nhắn tin cho người bán")
router.post('/room', ChatController.getOrCreateConversation);

export default router;
