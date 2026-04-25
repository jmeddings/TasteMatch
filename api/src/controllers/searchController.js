const { Request, Response } = require('express')
const { supabase } = require('../config/supabase')

async function searchDishes(req, res) {
  try {
    const { q, location, limit = 20, offset = 0 } = req.query

    if (!q) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      })
    }

    let query = supabase
      .from('dishes')
      .select(`
        id,
        name,
        description,
        price,
        image_url,
        rating,
        flavors,
        textures,
        dietary_restrictions,
        spicy_level,
        cooking_method,
        restaurants (
          id,
          name,
          address,
          city,
          state,
          zip_code,
          latitude,
          longitude,
          phone,
          website,
          rating,
          price_range,
          cuisine_types
        )
      `)
      .ilike('name', `%${q}%`)
      .range(Number(offset), Number(offset) + Number(limit) - 1)

    // Add location filter if provided
    if (location) {
      query = query.ilike('restaurants.city', `%${location}%`)
    }

    const { data: dishes, error, count } = await query

    if (error) {
      console.error('Search error:', error)
      return res.status(500).json({
        success: false,
        error: 'Failed to search dishes'
      })
    }

    // Format results
    const formattedResults = dishes?.map(dish => ({
      id: dish.id,
      name: dish.name,
      description: dish.description,
      price: dish.price,
      image: dish.image_url,
      rating: dish.rating,
      flavors: dish.flavors,
      textures: dish.textures,
      dietary_restrictions: dish.dietary_restrictions,
      spicy_level: dish.spicy_level,
      cooking_method: dish.cooking_method,
      restaurant: dish.restaurants ? {
        id: dish.restaurants.id,
        name: dish.restaurants.name,
        address: dish.restaurants.address,
        city: dish.restaurants.city,
        state: dish.restaurants.state,
        zip_code: dish.restaurants.zip_code,
        location: `${dish.restaurants.city}, ${dish.restaurants.state}`,
        phone: dish.restaurants.phone,
        website: dish.restaurants.website,
        rating: dish.restaurants.rating,
        price_range: dish.restaurants.price_range,
        cuisine_types: dish.restaurants.cuisine_types
      } : null
    })) || []

    res.json({
      success: true,
      data: formattedResults,
      total: count || 0,
      limit: Number(limit),
      offset: Number(offset)
    })
  } catch (error) {
    console.error('Search dishes error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to search dishes'
    })
  }
}

async function searchByFlavor(req, res) {
  try {
    const { flavors, location, limit = 20, offset = 0 } = req.query

    if (!flavors) {
      return res.status(400).json({
        success: false,
        error: 'Flavors parameter is required'
      })
    }

    const flavorArray = Array.isArray(flavors) ? flavors : [flavors]

    let query = supabase
      .from('dishes')
      .select(`
        id,
        name,
        description,
        price,
        image_url,
        rating,
        flavors,
        textures,
        dietary_restrictions,
        spicy_level,
        cooking_method,
        restaurants (
          id,
          name,
          address,
          city,
          state,
          zip_code,
          latitude,
          longitude,
          phone,
          website,
          rating,
          price_range,
          cuisine_types
        )
      `)
      .contains('flavors', flavorArray)
      .range(Number(offset), Number(offset) + Number(limit) - 1)

    // Add location filter if provided
    if (location) {
      query = query.ilike('restaurants.city', `%${location}%`)
    }

    const { data: dishes, error, count } = await query

    if (error) {
      console.error('Flavor search error:', error)
      return res.status(500).json({
        success: false,
        error: 'Failed to search by flavor'
      })
    }

    // Format results
    const formattedResults = dishes?.map(dish => ({
      id: dish.id,
      name: dish.name,
      description: dish.description,
      price: dish.price,
      image: dish.image_url,
      rating: dish.rating,
      flavors: dish.flavors,
      textures: dish.textures,
      dietary_restrictions: dish.dietary_restrictions,
      spicy_level: dish.spicy_level,
      cooking_method: dish.cooking_method,
      restaurant: dish.restaurants ? {
        id: dish.restaurants.id,
        name: dish.restaurants.name,
        address: dish.restaurants.address,
        city: dish.restaurants.city,
        state: dish.restaurants.state,
        zip_code: dish.restaurants.zip_code,
        location: `${dish.restaurants.city}, ${dish.restaurants.state}`,
        phone: dish.restaurants.phone,
        website: dish.restaurants.website,
        rating: dish.restaurants.rating,
        price_range: dish.restaurants.price_range,
        cuisine_types: dish.restaurants.cuisine_types
      } : null
    })) || []

    res.json({
      success: true,
      data: formattedResults,
      total: count || 0,
      limit: Number(limit),
      offset: Number(offset)
    })
  } catch (error) {
    console.error('Search by flavor error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to search by flavor'
    })
  }
}

async function searchByImage(req, res) {
  try {
    // TODO: Implement image upload and analysis with OpenAI
    // For now, return a placeholder response
    const mockResults = [
      {
        id: 'mock-dish-id',
        name: 'Similar Dish Found',
        description: 'AI-detected similar dish based on image analysis',
        price: 12.99,
        image: '/api/placeholder/300/200',
        rating: 4.5,
        flavors: ['Savory', 'Spicy'],
        textures: ['Crispy', 'Tender'],
        dietary_restrictions: null,
        spicy_level: 2,
        cooking_method: 'Grilled',
        confidence: 0.85,
        restaurant: {
          id: 'mock-restaurant-id',
          name: 'Restaurant Name',
          address: '123 Main St',
          city: 'Los Angeles',
          state: 'CA',
          zip_code: '90210',
          location: 'Los Angeles, CA',
          phone: '555-0123',
          website: 'https://example.com',
          rating: 4.5,
          price_range: 2,
          cuisine_types: ['American', 'Casual']
        }
      }
    ]

    res.json({
      success: true,
      data: mockResults,
      total: mockResults.length,
      message: 'Image analysis not yet implemented - returning mock results'
    })
  } catch (error) {
    console.error('Search by image error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to search by image'
    })
  }
}

async function searchSuggestions(req, res) {
  try {
    const { q } = req.query

    if (!q || typeof q !== 'string' || q.length < 2) {
      return res.json({
        success: true,
        data: []
      })
    }

    // Get dish name suggestions
    const { data: dishSuggestions, error: dishError } = await supabase
      .from('dishes')
      .select('name')
      .ilike('name', `%${q}%`)
      .limit(5)

    // Get restaurant name suggestions
    const { data: restaurantSuggestions, error: restaurantError } = await supabase
      .from('restaurants')
      .select('name')
      .ilike('name', `%${q}%`)
      .limit(5)

    if (dishError || restaurantError) {
      console.error('Suggestions error:', dishError || restaurantError)
      return res.status(500).json({
        success: false,
        error: 'Failed to get suggestions'
      })
    }

    const suggestions = [
      ...(dishSuggestions?.map(d => ({ type: 'dish', value: d.name })) || []),
      ...(restaurantSuggestions?.map(r => ({ type: 'restaurant', value: r.name })) || [])
    ]

    res.json({
      success: true,
      data: suggestions.slice(0, 10) // Limit total suggestions
    })
  } catch (error) {
    console.error('Search suggestions error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to get suggestions'
    })
  }
}

async function searchByTexture(req, res) {
  try {
    const { textures, location, limit = 20, offset = 0 } = req.query

    if (!textures) {
      return res.status(400).json({
        success: false,
        error: 'Textures parameter is required'
      })
    }

    const textureArray = Array.isArray(textures) ? textures : [textures]

    let query = supabase
      .from('dishes')
      .select(`
        id,
        name,
        description,
        price,
        image_url,
        rating,
        flavors,
        textures,
        dietary_restrictions,
        spicy_level,
        cooking_method,
        restaurants (
          id,
          name,
          address,
          city,
          state,
          zip_code,
          latitude,
          longitude,
          phone,
          website,
          rating,
          price_range,
          cuisine_types
        )
      `)
      .contains('textures', textureArray)
      .range(Number(offset), Number(offset) + Number(limit) - 1)

    // Add location filter if provided
    if (location) {
      query = query.ilike('restaurants.city', `%${location}%`)
    }

    const { data: dishes, error, count } = await query

    if (error) {
      console.error('Texture search error:', error)
      return res.status(500).json({
        success: false,
        error: 'Failed to search by texture'
      })
    }

    // Format results
    const formattedResults = dishes?.map(dish => ({
      id: dish.id,
      name: dish.name,
      description: dish.description,
      price: dish.price,
      image: dish.image_url,
      rating: dish.rating,
      flavors: dish.flavors,
      textures: dish.textures,
      dietary_restrictions: dish.dietary_restrictions,
      spicy_level: dish.spicy_level,
      cooking_method: dish.cooking_method,
      restaurant: dish.restaurants ? {
        id: dish.restaurants.id,
        name: dish.restaurants.name,
        address: dish.restaurants.address,
        city: dish.restaurants.city,
        state: dish.restaurants.state,
        zip_code: dish.restaurants.zip_code,
        location: `${dish.restaurants.city}, ${dish.restaurants.state}`,
        phone: dish.restaurants.phone,
        website: dish.restaurants.website,
        rating: dish.restaurants.rating,
        price_range: dish.restaurants.price_range,
        cuisine_types: dish.restaurants.cuisine_types
      } : null
    })) || []

    res.json({
      success: true,
      data: formattedResults,
      total: count || 0,
      limit: Number(limit),
      offset: Number(offset)
    })
  } catch (error) {
    console.error('Search by texture error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to search by texture'
    })
  }
}

module.exports = {
  searchDishes,
  searchByFlavor,
  searchByImage,
  searchSuggestions,
  searchByTexture
}
