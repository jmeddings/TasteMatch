const { Router } = require('express')
const {
  createReview,
  getReview,
  listReviews,
  updateReview,
  deleteReview
} = require('../controllers/reviewsController')

const router = Router()

router.get('/', listReviews)
router.post('/', createReview)
router.get('/:id', getReview)
router.put('/:id', updateReview)
router.delete('/:id', deleteReview)

module.exports = { reviewsRouter: router }
