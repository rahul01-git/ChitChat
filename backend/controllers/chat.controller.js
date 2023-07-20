const asyncHandler = require('express-async-handler')
const Chat = require("../models/Chat.model")
const User = require('../models/User.model')

const accessChat = asyncHandler(async (req, res) => {
    const { userId } = req.body
    if (!userId) {
        res.status(400)
        throw new Error('User Id not Send in body')
    }

    let isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } }
        ]
    }).populate('users').populate('latestMessage')

    isChat = await User.populate(isChat, {
        path: 'latestMessage.sender',
        select: 'name pic email'
    })

    if (isChat.length > 0) {
        res.send(isChat[0])
    } else {    
        let chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId]
        }

        try {
            const createdChat = await Chat.create(chatData)
            const FullChat = await Chat.findOne({ _id: createdChat._id }).populate('users')
            res.status(200).send(FullChat)
        } catch (error) {
            res.status(400)
            throw new Error(error.message)
        }
    }
})
const fetchChats = asyncHandler(async (req, res) => {
   try {
    Chat.find({users: {$elemMatch: {$eq: req.user._id}}}).populate('users').populate('groupAdmin').populate('latestMessage').sort({updatedAt: -1}).then(async (results)=>{
        results = await User.populate(results, {
            path: 'latestMessage.sender',
            select: 'name pic email'
        })

        res.status(200).send(results)
    })
   } catch (error) {
    res.status(400)
    throw new Error(error.message)
   }
})


module.exports = { accessChat,fetchChats }