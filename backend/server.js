const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const connectDB = require('./config/db')
const colors = require('colors')
const { notFound, errorHandler } = require('./middlewares/errorMiddleware')
const userRoutes = require('./routes/user.routes')
const chatRoutes = require('./routes/chat.routes')
const messageRoutes = require('./routes/message.routes')

dotenv.config()
connectDB()
const app = express()
app.use(express.json())
app.use(cors({ origin: process.env.CLIENT_PORT, credentials: true }))

app.get('/', (req, res) => res.send("API is running")
)

app.use('/api/user', userRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/message', messageRoutes)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 6000
const server = app.listen(PORT, console.log(`Server is running at post ${PORT}`.yellow.bold))

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: process.env.CLIENT_PORT
    }
})

io.on('connection', (socket) => {
    console.log('connected to socket.io');

    socket.on('setup', (userData) => {
        socket.join(userData._id)
        console.log(userData._id);
        socket.emit('connected')
    })

    socket.on('join chat', (room) => {
        socket.join(room)
        console.log('user joined room  ' + room);
    })

    socket.on('typing',(room)=>socket.in(room).emit('typing'))
    socket.on('stop typing',(room)=>socket.in(room).emit('stop typing'))

    socket.on('new message', (newMessageReceived) => {
        var chat = newMessageReceived.chat
        if(!chat.users) return console.log('chat.users not defined');

        chat.users.forEach(user=>{
            if(user._id == newMessageReceived.sender._id) return

            socket.in(user._id).emit('message received', newMessageReceived)
        })
    })

    socket.off("setup",()=>{
        console.log('USER DISCONNECTED');
        socket.leave(userData._id)
    })
})