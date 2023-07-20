const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const connectDB = require('./config/db')
const colors = require('colors')
const userRoutes = require('./routes/user.routes')

dotenv.config()
connectDB()
const app = express()
app.use(express.json())
app.use(cors({ origin: process.env.CLIENT_PORT, credentials: true }))

app.get('/', (req, res) => {
    res.send("API is running")
})

app.use('/api/user',userRoutes)

const PORT = process.env.PORT || 6000
app.listen(PORT, console.log(`Server is running at post ${PORT}`.yellow.bold))