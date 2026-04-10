import { Router } from 'express'
import { signUp, signIn, signOut, getProfile } from '../controllers/authController'

const router = Router()

// Sign up new user
router.post('/signup', signUp)

// Sign in user
router.post('/signin', signIn)

// Sign out user
router.post('/signout', signOut)

// Get user profile
router.get('/profile', getProfile)

export { router as authRouter }
