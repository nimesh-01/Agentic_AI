const chatModel = require('../models/chat.model')

async function chatController(req, res) {
    const { title } = req.body;
    const user = req.user;

    const chat = await chatModel.create({
        user: user._id,
        title
    })

    res.status(201).json({
        msg:"Chat Created successfully",
        chat: chat
    })
}
module.exports={chatController}