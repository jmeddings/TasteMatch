const { Router } = require('express')
const {
  getDishById,
  getSimilarDishes,
  createDish,
  updateDish,
  deleteDish
} = require('../controllers/dishesController')

const router = Router()

// Get dish by ID with restaurant information
router.get('/:id', getDishById)

// Get similar dishes based on flavors, textures, and spice level
router.get('/:id/similar', getSimilarDishes)

// Create new dish (authenticated)
router.post('/', createDish)

// Update dish (authenticated)
router.put('/:id', updateDish)

// Delete dish (authenticated)
router.delete('/:id', deleteDish)

module.exports = { dishesRouter: router }
