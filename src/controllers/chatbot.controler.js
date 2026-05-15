const { handleChatQuery } = require('../services/chatbot.service');

exports.getBotResponse = async (req, res) => {
    const response = await handleChatQuery(req.user.id, req.body.message);
    res.status(200).json({ response });
};