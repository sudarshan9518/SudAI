const chatModel = require("../models/chat.model")
const messageModel = require('../models/message.model');



    async function createChat(req, res) {
        const{title} = req.body;
        const user = req.user;


        const chat = await chatModel.create({
            user : user._id,
            title
        })

        res.status(201).json({
            message :"chat is created successfully ",
            chat :{
                _id : chat._id,
                title :chat.title,
                lastActivity : chat.lastActivity,
                user :chat.user


            }
        })
        
    }

async function getChats(req, res) {
    const user = req.user;

    const chats = await chatModel.find({ user: user._id });

    res.status(200).json({
        message: "Chats retrieved successfully",
        chats: chats.map(chat => ({
            _id: chat._id,
            title: chat.title,
            lastActivity: chat.lastActivity,
            user: chat.user
        }))
    });
}

async function getMessages(req, res) {

    const chatId = req.params.id;

    const messages = await messageModel.find({ chat: chatId }).sort({ createdAt: 1 });

    res.status(200).json({
        message: "Messages retrieved successfully",
        messages: messages
    })

}

async function deleteChat(req, res) {
    const chatId = req.params.id;
    const user = req.user;

    const chat = await chatModel.findById(chatId);

    if (!chat) {
        return res.status(404).json({
            message: "Chat not found"
        });
    }

    if (chat.user.toString() !== user._id.toString()) {
        return res.status(403).json({
            message: "Unauthorized to delete this chat"
        });
    }

    // Delete all messages associated with this chat
    await messageModel.deleteMany({ chat: chatId });

    // Delete the chat
    await chatModel.findByIdAndDelete(chatId);

    res.status(200).json({
        message: "Chat deleted successfully",
        chatId: chatId
    });
}

    module.exports = {
        createChat,
          getChats,
    getMessages,
    deleteChat
    }