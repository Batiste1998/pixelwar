const User = require('../models/User')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '24h' })
}

exports.register = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { username, password } = req.body

    const existingUser = await User.findOne({ username })
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Ce nom d'utilisateur est déjà pris" })
    }

    const user = new User({
      username,
      password,
    })

    await user.save()

    const token = generateToken(user._id)

    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      token,
      user: {
        id: user._id,
        username: user.username,
      },
    })
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de l'inscription", error: error.message })
  }
}

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body

    const user = await User.findOne({ username })
    if (!user) {
      return res.status(401).json({ message: 'Identifiants invalides' })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Identifiants invalides' })
    }

    user.lastLogin = Date.now()
    await user.save()

    const token = generateToken(user._id)

    res.json({
      message: 'Connexion réussie',
      token,
      user: {
        id: user._id,
        username: user.username,
      },
    })
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Erreur lors de la connexion', error: error.message })
  }
}

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password')
    res.json(user)
  } catch (error) {
    res
      .status(500)
      .json({
        message: 'Erreur lors de la récupération du profil',
        error: error.message,
      })
  }
}
