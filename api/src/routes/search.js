const { Router } = require('express')
const { searchDishes, searchByFlavor, searchByImage, searchSuggestions, searchByTexture } = require('../controllers/searchController')

const router = Router()

// Search dishes by name or query
router.get('/dishes', searchDishes)

// Search by flavor profile
router.get('/flavors', searchByFlavor)

// Search by texture profile
router.get('/textures', searchByTexture)

// Get search suggestions
router.get('/suggest', searchSuggestions)

// Search by image upload
router.post('/image', searchByImage)

module.exports = { searchRouter: router }
