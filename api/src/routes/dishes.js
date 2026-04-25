const { Router } = require('express')
const {
  getDishById,
  getSimilarDishes,
  addReview,
  getDishReviews,
  createDish,
  updateDish,
  deleteDish
} = require('../controllers/dishesController')

const router = Router()

// Get dish by ID with restaurant information
router.get('/:id', getDishById)

// Get similar dishes based on flavors, textures, and spice level
router.get('/:id/similar', getSimilarDishes)

// Get reviews for a specific dish
router.get('/:id/reviews', getDishReviews)

// Add a review for a dish (authenticated)
router.post('/:id/reviews', addReview)

// Create new dish (authenticated)
router.post('/', createDish)

// Update dish (authenticated)
router.put('/:id', updateDish)

// Delete dish (authenticated)
router.delete('/:id', deleteDish)

module.exports = { dishesRouter: router }
