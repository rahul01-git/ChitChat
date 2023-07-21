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
        Chat.find({ users: { $elemMatch: { $eq: req.user._id } } }).populate('users').populate('groupAdmin').populate('latestMessage').sort({ updatedAt: -1 }).then(async (results) => {
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

const createGroupChat = asyncHandler(async (req, res) => {
    if (!req.body.users || !req.body.name) {
        return res.status(400).json({ message: "Please fill all the fields" })
    }
    let users = JSON.parse(req.body.users)
    if (users.length < 2) res.status(400).send("More than 2 users are required to create a group chat !")

    users.push(req.user)
    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users,
            isGroupChat: true,
            groupAdmin: req.user,
        })

        const fullGroupChat = await Chat.findOne({ _id: groupChat._id }).populate("users").populate("groupAdmin")
        res.status(200).json(fullGroupChat)
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
})

const renameGroup = asyncHandler(async (req, res) => {
    const { chatId, chatName } = req.body
    const updatedChat = await Chat.findByIdAndUpdate(chatId, {
        chatName,
    }
        , {
            new: true
        }).populate('users').populate('groupAdmin')

    if(!updatedChat) {
        res.status(404)
        throw new Error("Chat not Found")
    }else{
        res.json(updatedChat)
    }
})

module.exports = { accessChat, fetchChats, createGroupChat,renameGroup }