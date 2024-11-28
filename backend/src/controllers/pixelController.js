const Pixel = require('../models/Pixel')

exports.placePixel = async (req, res) => {
  try {
    const { x, y, color } = req.body

    if (!Number.isInteger(x) || !Number.isInteger(y)) {
      return res
        .status(400)
        .json({ message: 'Les coordonnées doivent être des nombres entiers' })
    }

    if (!/^#[0-9A-Fa-f]{6}$/.test(color)) {
      return res.status(400).json({ message: 'Format de couleur invalide' })
    }

    const pixel = await Pixel.findOneAndUpdate(
      { x, y },
      {
        color,
        placedBy: req.user._id,
        lastModified: Date.now(),
      },
      {
        new: true,
        upsert: true,
      }
    )

    req.io.emit('pixelUpdate', {
      x,
      y,
      color,
      placedBy: req.user.username,
    })

    res.json(pixel)
  } catch (error) {
    res
      .status(500)
      .json({
        message: 'Erreur lors du placement du pixel',
        error: error.message,
      })
  }
}

exports.getCanvas = async (req, res) => {
  try {
    const pixels = await Pixel.find().select('x y color').lean()

    const canvas = pixels.reduce((acc, pixel) => {
      acc[`${pixel.x},${pixel.y}`] = pixel.color
      return acc
    }, {})

    res.json(canvas)
  } catch (error) {
    res
      .status(500)
      .json({
        message: 'Erreur lors de la récupération du canvas',
        error: error.message,
      })
  }
}

exports.getPixelHistory = async (req, res) => {
  try {
    const { x, y } = req.query

    const history = await Pixel.find({ x, y })
      .sort('-lastModified')
      .limit(10)
      .populate('placedBy', 'username')

    res.json(history)
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Erreur lors de la récupération de l'historique",
        error: error.message,
      })
  }
}
