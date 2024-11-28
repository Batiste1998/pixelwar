const express = require('express')
const { body } = require('express-validator')
const authController = require('../controllers/authController')
const auth = require('../middleware/auth')

const router = express.Router()

const registerValidation = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage("Le nom d'utilisateur doit contenir entre 3 et 20 caractères"),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Le mot de passe doit contenir au moins 6 caractères'),
]

router.post('/register', registerValidation, authController.register)
router.post('/login', authController.login)
router.get('/profile', auth, authController.getProfile)

module.exports = router
