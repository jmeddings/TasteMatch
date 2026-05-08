const { Router } = require('express')
const {
  signUp,
  signIn,
  signOut,
  getProfile,
  updateProfile,
  getTasteProfile,
  updateTasteProfile,
  deleteAccount
} = require('../controllers/authController')

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

// Taste profile (onboarding)
router.get('/taste-profile', getTasteProfile)
router.put('/taste-profile', updateTasteProfile)

// Delete account
router.delete('/account', deleteAccount)

module.exports = { authRouter: router }
