const mongoose = require('mongoose')

const pixelSchema = new mongoose.Schema(
  {
    x: {
      type: Number,
      required: true,
    },
    y: {
      type: Number,
      required: true,
    },
    color: {
      type: String,
      required: true,
      match: /^#[0-9A-Fa-f]{6}$/,
    },
    placedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    lastModified: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    indexes: [{ x: 1, y: 1, unique: true }],
  }
)

module.exports = mongoose.model('Pixel', pixelSchema)
