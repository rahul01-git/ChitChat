const express = require('express')
const { registerUser, authUser, allUsers } = require('../controllers/user.controller')
const router = express.Router()

router.route('/').post(registerUser).get(allUsers)
router.post('/login',authUser)

router.route('/')

module.exports = router