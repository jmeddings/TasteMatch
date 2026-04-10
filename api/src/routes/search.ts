import { Router } from 'express'
import { searchDishes, searchByFlavor, searchByImage } from '../controllers/searchController'

const router = Router()

// Search dishes by name or query
router.get('/dishes', searchDishes)

// Search by flavor profile
router.get('/flavors', searchByFlavor)

// Search by image upload
router.post('/image', searchByImage)

export { router as searchRouter }
