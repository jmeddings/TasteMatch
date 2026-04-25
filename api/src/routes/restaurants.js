const { Router } = require('express')
const {
  getRestaurants,
  getRestaurantById,
  getNearbyRestaurants,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant
} = require('../controllers/restaurantsController')

const router = Router()

// Get all restaurants with optional filters
router.get('/', getRestaurants)

// Get nearby restaurants based on coordinates
router.get('/nearby', getNearbyRestaurants)

// Get restaurant by ID
router.get('/:id', getRestaurantById)

// Create new restaurant (authenticated)
router.post('/', createRestaurant)

// Update restaurant (authenticated)
router.put('/:id', updateRestaurant)

// Delete restaurant (authenticated)
router.delete('/:id', deleteRestaurant)

module.exports = { restaurantsRouter: router }
