const { Router } = require('express')
const { signUp, signIn, signOut, getProfile, updateProfile } = require('../controllers/authController')

const router = Router()

// Sign up new user
router.post('/signup', signUp)

// Sign in user
router.post('/signin', signIn)

// Sign out user
router.post('/signout', signOut)

// Get user profile
router.get('/profile', getProfile)

// Update user profile
router.put('/profile', updateProfile)

module.exports = { authRouter: router }
