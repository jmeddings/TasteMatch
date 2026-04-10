import { Router } from 'express'
import { getFavorites, addFavorite, removeFavorite } from '../controllers/favoritesController'

const router = Router()

// Get user's favorite dishes
router.get('/', getFavorites)

// Add a dish to favorites
router.post('/', addFavorite)

// Remove a dish from favorites
router.delete('/:id', removeFavorite)

export { router as favoritesRouter }
