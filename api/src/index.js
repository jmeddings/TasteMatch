const dotenv = require('dotenv')
const { app } = require('./app')

dotenv.config()
const PORT = process.env.PORT || 3001

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 TasteMatch API server running on http://0.0.0.0:${PORT}`)
  console.log(`📍 Local access: http://localhost:${PORT}`)
  console.log(`🌐 Network access: http://0.0.0.0:${PORT}`)
})
