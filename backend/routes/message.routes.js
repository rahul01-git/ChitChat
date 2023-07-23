const express = require('express')
const protect = require('../middlewares/authMiddleware')
const { sendMessage } = require('../controllers/message.controller')
const router = express.Router()

router.route('/').post(protect,sendMessage)
// router.router('/:chatId').get(protect,allMessages)


module.exports = router