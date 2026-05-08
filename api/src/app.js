const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const compression = require('compression')
const rateLimit = require('express-rate-limit')

const { searchRouter } = require('./routes/search')
const { favoritesRouter } = require('./routes/favorites')
const { authRouter } = require('./routes/auth')
const { restaurantsRouter } = require('./routes/restaurants')
const { dishesRouter } = require('./routes/dishes')
const { reviewsRouter } = require('./routes/reviews')
const { draftsRouter } = require('./routes/drafts')
const { errorHandler } = require('./middleware/errorHandler')

const app = express()

// Security middleware
app.use(helmet())
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
  })
)

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
app.use('/api/reviews', reviewsRouter)
app.use('/api/drafts', draftsRouter)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// Error handling
app.use(errorHandler)

module.exports = { app }
