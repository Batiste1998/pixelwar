const Message = require('../models/Message')

class ChatService {
  constructor(io) {
    this.io = io
    this.MESSAGES_LIMIT = 50
    this.connectedUsers = new Map()
  }

  async setupChatHandlers(socket) {
    const userId = socket.user._id.toString();
    
    if (!this.connectedUsers.has(userId)) {
        this.connectedUsers.set(userId, {
            id: socket.user._id,
            username: socket.user.username,
            socketId: socket.id,
        });
        
        this.broadcastUserList();
        await this.broadcastSystemMessage(`${socket.user.username} a rejoint le chat`);
    }

    await this.sendMessageHistory(socket);

    socket.on('getMessageHistory', async () => {
        await this.sendMessageHistory(socket);
    });

    socket.on('chatMessage', async (data) => {
        await this.handleNewMessage(socket, data);
    });

    socket.on('disconnect', async () => {
        if (this.connectedUsers.has(userId)) {
            this.connectedUsers.delete(userId);
            this.broadcastUserList();
            await this.broadcastSystemMessage(`${socket.user.username} a quitté le chat`);
        }
    });
}

  async sendMessageHistory(socket) {
    try {
      console.log('Envoi de l\'historique à', socket.user.username)
      const messages = await Message.find()
        .sort('-createdAt')
        .limit(this.MESSAGES_LIMIT)
        .populate('sender', 'username')
        .lean()

      const sortedMessages = messages.reverse()
      console.log(`${sortedMessages.length} messages envoyés`)
      socket.emit('messageHistory', sortedMessages)
    } catch (error) {
      console.error("Erreur lors de la récupération de l'historique:", error)
    }
  }

  async handleNewMessage(socket, data) {
    try {
      const message = new Message({
        content: data.content.trim().substring(0, 500),
        sender: socket.user._id,
        type: 'message',
      })

      await message.save()
      await message.populate('sender', 'username')
      
      console.log('Nouveau message de', socket.user.username, ':', data.content)
      this.io.emit('newMessage', message)
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error)
      socket.emit('messageError', {
        message: "Erreur lors de l'envoi du message",
      })
    }
  }

  broadcastUserList() {
    const userList = Array.from(this.connectedUsers.values()).map((user) => ({
      id: user.id,
      username: user.username,
    }))
    console.log('Liste des utilisateurs mise à jour:', userList)
    this.io.emit('userList', userList)
  }

  async broadcastSystemMessage(content) {
    try {
      const message = new Message({
        content,
        type: 'system',
      })

      await message.save()
      console.log('Message système:', content)
      this.io.emit('newMessage', message)
    } catch (error) {
      console.error("Erreur lors de l'envoi du message système:", error)
    }
  }
}

module.exports = ChatService