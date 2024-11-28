const express = require('express')
const cors = require('cors')
const connectDB = require('./config/database')
require('dotenv').config()

const app = express()

app.use(cors())
app.use(express.json())

connectDB()

app.get('/', (req, res) => {
  res.send("API Pixel War en cours d'exécution")
})

const authRoutes = require('./routes/authRoutes')
app.use('/api/auth', authRoutes)

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send("Quelque chose s'est mal passé!")
})

const PORT = process.env.PORT || 5000

const server = app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`)
})


const io = require('socket.io')(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
})

const SocketService = require('./services/socketService')
const pixelRoutes = require('./routes/pixelRoutes')

const socketService = new SocketService(io)

app.use('/api/pixels', pixelRoutes(io))

io.on('connection', (socket) => {
  console.log("Un utilisateur s'est connecté")

  socket.on('disconnect', () => {
    console.log("Un utilisateur s'est déconnecté")
  })
})

module.exports = { app, io }
