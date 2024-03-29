const asyncHandler = require('express-async-handler')
const Message = require('../models/Message.model');
const User = require('../models/User.model');
const Chat = require('../models/Chat.model');

const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body
  if (!content || !chatId) {
    console.log('Invalid data passed into request');
    return res.sendStatus(400)
  }

  const newMessage = {
    sender: req.user._id,
    content,
    chat: chatId
  }
  try {
    let message = await Message.create(newMessage)
    message = await message.populate('sender', 'name pic')
    message = await message.populate('chat')
    message = await User.populate(message, {
      path: 'chat.users',
      select: 'name pic email'
    })

    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    })

    res.json(message)
  } catch (error) {
    res.status(400)
    throw new Error(error.message)
  }
})
const allMessages = asyncHandler(async (req, res) => {
  try {
    let messages = await Message.find({ chat: req.params.chatId }).populate('chat')
    messages = await User.populate(messages,{
      path: 'sender',
      select: 'name pic email'
    })

    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { sendMessage, allMessages }