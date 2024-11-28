const express = require('express')
const pixelController = require('../controllers/pixelController')
const auth = require('../middleware/auth')
const router = express.Router()

const addIo = (io) => (req, res, next) => {
  req.io = io
  next()
}

module.exports = (io) => {
  router.post('/place', auth, addIo(io), pixelController.placePixel)
  router.get('/canvas', pixelController.getCanvas)
  router.get('/history', auth, pixelController.getPixelHistory)

  return router
}
