const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const { chats } = require('./data/data')


dotenv.config()
const app = express()
app.use(cors({ origin: process.env.CLIENT_PORT, credentials: true }))

app.get('/', (req, res) => {
    res.send("API is running")
})

app.get('/api/chat', (req, res) => {
    res.send(chats)
})

app.get('/api/chat/:id', (req, res) => {
    const id = req.params.id
    const chat = chats.find(chat => chat._id === id)
    res.send(chat)
})

const PORT = process.env.PORT || 6000
app.listen(PORT, console.log(`Server is running at post ${PORT}`))