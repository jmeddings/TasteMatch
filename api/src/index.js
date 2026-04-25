const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const compression = require('compression')
const rateLimit = require('express-rate-limit')
const dotenv = require('dotenv')
const { searchRouter } = require('./routes/search')
const { favoritesRouter } = require('./routes/favorites')
const { authRouter } = require('./routes/auth')
const { restaurantsRouter } = require('./routes/restaurants')
const { dishesRouter } = require('./routes/dishes')
const { errorHandler } = require('./middleware/errorHandler')

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Security middleware
app.use(helmet())
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
})
app.use(limiter)

// General middleware
app.use(compression())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// API Routes
app.use('/api/auth', authRouter)
app.use('/api/search', searchRouter)
app.use('/api/favorites', favoritesRouter)
app.use('/api/restaurants', restaurantsRouter)
app.use('/api/dishes', dishesRouter)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// Error handling
app.use(errorHandler)

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 TasteMatch API server running on http://0.0.0.0:${PORT}`)
  console.log(`📍 Local access: http://localhost:${PORT}`)
  console.log(`🌐 Network access: http://0.0.0.0:${PORT}`)
})
