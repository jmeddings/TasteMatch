const { Request, Response } = require('express')
const { supabase } = require('../config/supabase')

async function getRestaurants(req, res) {
  try {
    const { city, cuisine, rating, limit = 20, offset = 0 } = req.query

    let query = supabase
      .from('restaurants')
      .select('*')
      .range(Number(offset), Number(offset) + Number(limit) - 1)

    // Add filters
    if (city && typeof city === 'string') {
      query = query.ilike('city', `%${city}%`)
    }

    if (cuisine && typeof cuisine === 'string') {
      query = query.contains('cuisine_types', [cuisine])
    }

    if (rating && typeof rating === 'string') {
      query = query.gte('rating', Number(rating))
    }

    const { data: restaurants, error, count } = await query

    if (error) {
      console.error('Get restaurants error:', error)
      return res.status(500).json({
        success: false,
        error: 'Failed to get restaurants'
      })
    }

    res.json({
      success: true,
      data: restaurants || [],
      total: count || 0,
      limit: Number(limit),
      offset: Number(offset)
    })
  } catch (error) {
    console.error('Get restaurants error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to get restaurants'
    })
  }
}

async function getRestaurantById(req, res) {
  try {
    const { id } = req.params

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Restaurant ID is required'
      })
    }

    const { data: restaurant, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !restaurant) {
      return res.status(404).json({
        success: false,
        error: 'Restaurant not found'
      })
    }

    // Get dishes for this restaurant
    const { data: dishes, error: dishesError } = await supabase
      .from('dishes')
      .select('*')
      .eq('restaurant_id', id)
      .order('name')

    if (dishesError) {
      console.error('Get restaurant dishes error:', dishesError)
    }

    res.json({
      success: true,
      data: {
        ...restaurant,
        dishes: dishes || []
      }
    })
  } catch (error) {
    console.error('Get restaurant by ID error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to get restaurant'
    })
  }
}

async function getNearbyRestaurants(req, res) {
  try {
    const { latitude, longitude, radius = 10, limit = 20 } = req.query

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        error: 'Latitude and longitude are required'
      })
    }

    // Note: This is a simple implementation. For production, you'd want to use
    // PostGIS or a more sophisticated geospatial query
    const { data: restaurants, error } = await supabase
      .from('restaurants')
      .select('*')
      .not('latitude', 'is', null)
      .not('longitude', 'is', null)
      .limit(Number(limit))

    if (error) {
      console.error('Get nearby restaurants error:', error)
      return res.status(500).json({
        success: false,
        error: 'Failed to get nearby restaurants'
      })
    }

    // Calculate distances (simplified - in production use proper geospatial functions)
    const userLat = Number(latitude)
    const userLng = Number(longitude)
    const maxRadius = Number(radius)

    const nearbyRestaurants = restaurants?.filter(restaurant => {
      if (!restaurant.latitude || !restaurant.longitude) return false
      
      // Simple distance calculation (not accurate for production)
      const distance = Math.sqrt(
        Math.pow(Number(restaurant.latitude) - userLat, 2) +
        Math.pow(Number(restaurant.longitude) - userLng, 2)
      )
      
      return distance <= maxRadius
    }).map(restaurant => ({
      ...restaurant,
      distance: Math.sqrt(
        Math.pow(Number(restaurant.latitude) - userLat, 2) +
        Math.pow(Number(restaurant.longitude) - userLng, 2)
      )
    })).sort((a, b) => a.distance - b.distance) || []

    res.json({
      success: true,
      data: nearbyRestaurants,
      total: nearbyRestaurants.length
    })
  } catch (error) {
    console.error('Get nearby restaurants error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to get nearby restaurants'
    })
  }
}

async function createRestaurant(req, res) {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        error: 'No authorization header provided'
      })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token'
      })
    }

    const {
      name,
      description,
      address,
      city,
      state,
      zip_code,
      latitude,
      longitude,
      phone,
      website,
      price_range,
      cuisine_types
    } = req.body

    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Restaurant name is required'
      })
    }

    const { data: restaurant, error } = await supabase
      .from('restaurants')
      .insert({
        name,
        description,
        address,
        city,
        state,
        zip_code,
        latitude,
        longitude,
        phone,
        website,
        price_range,
        cuisine_types: cuisine_types || []
      })
      .select()
      .single()

    if (error) {
      console.error('Create restaurant error:', error)
      return res.status(500).json({
        success: false,
        error: 'Failed to create restaurant'
      })
    }

    res.status(201).json({
      success: true,
      data: restaurant,
      message: 'Restaurant created successfully'
    })
  } catch (error) {
    console.error('Create restaurant error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to create restaurant'
    })
  }
}

async function updateRestaurant(req, res) {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        error: 'No authorization header provided'
      })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token'
      })
    }

    const { id } = req.params
    const updateData = req.body

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Restaurant ID is required'
      })
    }

    // TODO: Add proper authorization check to ensure user can update this restaurant
    // For now, we'll allow any authenticated user to update

    const { data: restaurant, error } = await supabase
      .from('restaurants')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error || !restaurant) {
      return res.status(404).json({
        success: false,
        error: 'Restaurant not found or update failed'
      })
    }

    res.json({
      success: true,
      data: restaurant,
      message: 'Restaurant updated successfully'
    })
  } catch (error) {
    console.error('Update restaurant error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to update restaurant'
    })
  }
}

async function deleteRestaurant(req, res) {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        error: 'No authorization header provided'
      })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token'
      })
    }

    const { id } = req.params

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Restaurant ID is required'
      })
    }

    // TODO: Add proper authorization check
    // For now, we'll allow any authenticated user to delete

    const { error } = await supabase
      .from('restaurants')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Delete restaurant error:', error)
      return res.status(500).json({
        success: false,
        error: 'Failed to delete restaurant'
      })
    }

    res.json({
      success: true,
      message: 'Restaurant deleted successfully'
    })
  } catch (error) {
    console.error('Delete restaurant error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to delete restaurant'
    })
  }
}

module.exports = {
  getRestaurants,
  getRestaurantById,
  getNearbyRestaurants,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant
}
