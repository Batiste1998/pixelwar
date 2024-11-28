import io from 'socket.io-client'

let socket = null

export const initializeSocket = (token) => {
  if (socket) {
    socket.disconnect()
  }

  socket = io('http://localhost:5000', {
    auth: {
      token,
    },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  })

  socket.on('connect', () => {
    console.log('Socket connecté')
  })

  socket.on('disconnect', () => {
    console.log('Socket déconnecté')
  })

  socket.on('connect_error', (error) => {
    console.error('Erreur de connexion socket:', error)
  })

  return socket
}

export const getSocket = () => socket

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}
