const jwt = require('jsonwebtoken')
const User = require('../models/User')
const ChatService = require('./chatService')

class SocketService {
  constructor(io) {
    this.io = io
    this.chatService = new ChatService(io)
    this.setupSocketHandlers()
  }

  setupSocketHandlers() {
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token
        if (!token) {
          throw new Error('Authentication error')
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.userId)

        if (!user) {
          throw new Error('User not found')
        }

        socket.user = user
        next()
      } catch (error) {
        next(new Error('Authentication error'))
      }
    })

    this.io.on('connection', (socket) => {
      console.log(`Nouvelle connexion socket pour ${socket.user.username}`)

      this.chatService.setupChatHandlers(socket)

      socket.on('disconnect', () => {
        console.log(`Déconnexion socket pour ${socket.user.username}`)
      })
    })
  }
}

module.exports = SocketService
