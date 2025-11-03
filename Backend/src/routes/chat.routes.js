const express = require('express')
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware')
const { chatController } = require('../controller/chat.controller')
const chatModel = require('../models/chat.model')
const messageModel = require('../models/message.model')
const { deleteMemoriesByFilter } = require('../services/vector.service')
// Create chat (POST /api/chat)
router.post('/', authMiddleware, chatController)

// Get all chats for the authenticated user (GET /api/chat)
router.get('/', authMiddleware, async (req, res) => {
    try {
        const chats = await chatModel.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json({ chats });
    } catch (err) {
        console.error("Error fetching chats:", err);
        res.status(500).json({ msg: "Failed to fetch chats" });
    }
})
router.get('/messages/:chatId', authMiddleware, async (req, res) => {
    const { chatId } = req.params;
    console.log(chatId)

    try {
        // Check if chat exists
        const chat = await chatModel.findById(chatId);
        if (!chat) return res.status(404).json({ msg: 'Chat not found' });

        // Get all messages of this chat, sorted by time
        const messages = await messageModel.find({ chat: chatId }).sort({ createdAt: 1 });

        res.json({ messages });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
});
router.get('/delete/:chatId', authMiddleware, async (req, res) => {
    const { chatId } = req.params;

    try {
        // Check if chat exists
        const chat = await chatModel.findById(chatId);
        if (!chat) return res.status(404).json({ msg: 'Chat not found' });

        // Delete all messages linked to this chat
        await messageModel.deleteMany({ chat: chatId });

        // Delete the chat itself
        await chatModel.findByIdAndDelete(chatId);
        await deleteMemoriesByFilter(chatId)
        res.json({ msg: 'Chat and all messages deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router
