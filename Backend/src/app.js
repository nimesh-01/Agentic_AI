const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const authroutes = require('./routes/auth.routes')
const chatroutes = require('./routes/chat.routes')

const app = express()

app.use(cors({
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}))

app.use(express.json())
app.use(cookieParser())

// keep auth routes under /api
app.use('/api', authroutes)

// mount chat routes under /api/chat for consistency
app.use('/api/chat', chatroutes)

module.exports = app
