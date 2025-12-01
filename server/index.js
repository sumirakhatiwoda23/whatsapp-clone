require('dotenv').config()
const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors')
const compression = require('compression')
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/users')
const messageRoutes = require('./routes/messages')
const { authenticateSocket } = require('./middleware/auth')

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
  }
})

// Middleware
app.use(cors())
app.use(compression())
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/messages', messageRoutes)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Socket.IO
const onlineUsers = new Map()

io.use(authenticateSocket)

io.on('connection', (socket) => {
  const userId = socket.user.id
  console.log(`User connected: ${userId}`)
  
  onlineUsers.set(userId, socket.id)
  io.emit('online_users', Array.from(onlineUsers.keys()))
  io.emit('user_online', userId)

  socket.on('send_message', async (data) => {
    try {
      const message = {
        from: userId,
        to: data.to,
        content: data.content,
        timestamp: new Date().toISOString(),
        status: 'delivered'
      }

      // Send to recipient if online
      const recipientSocketId = onlineUsers.get(data.to)
      if (recipientSocketId) {
        io.to(recipientSocketId).emit('receive_message', message)
      }

      // Send confirmation to sender
      socket.emit('message_sent', { ...message, status: 'sent' })
    } catch (error) {
      console.error('Error sending message:', error)
      socket.emit('message_error', { error: 'Failed to send message' })
    }
  })

  socket.on('typing', (data) => {
    const recipientSocketId = onlineUsers.get(data.to)
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('user_typing', { from: userId })
    }
  })

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${userId}`)
    onlineUsers.delete(userId)
    io.emit('online_users', Array.from(onlineUsers.keys()))
    io.emit('user_offline', userId)
  })
})

const PORT = process.env.PORT || 5000

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})