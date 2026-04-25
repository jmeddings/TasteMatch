const { Router } = require('express')
const { getFavorites, addFavorite, removeFavorite, updateFavorite } = require('../controllers/favoritesController')

const router = Router()

// Get user's favorite dishes
router.get('/', getFavorites)

// Add a dish to favorites
router.post('/', addFavorite)

// Update a favorite (notes, rating)
router.put('/:id', updateFavorite)

// Remove a dish from favorites
router.delete('/:id', removeFavorite)

module.exports = { favoritesRouter: router }
