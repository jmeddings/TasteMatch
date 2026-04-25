const { Request, Response } = require('express')
const { supabase } = require('../config/supabase')

async function getDishById(req, res) {
  try {
    const { id } = req.params

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Dish ID is required'
      })
    }

    const { data: dish, error } = await supabase
      .from('dishes')
      .select(`
        *,
        restaurants (
          id,
          name,
          address,
          city,
          state,
          zip_code,
          phone,
          website,
          rating,
          price_range,
          cuisine_types
        )
      `)
      .eq('id', id)
      .single()

    if (error || !dish) {
      return res.status(404).json({
        success: false,
        error: 'Dish not found'
      })
    }

    // Format response
    const formattedDish = {
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
      } : null,
      created_at: dish.created_at,
      updated_at: dish.updated_at
    }

    res.json({
      success: true,
      data: formattedDish
    })
  } catch (error) {
    console.error('Get dish by ID error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to get dish'
    })
  }
}

async function getSimilarDishes(req, res) {
  try {
    const { id } = req.params
    const { limit = 10 } = req.query

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Dish ID is required'
      })
    }

    // First get the original dish to find similar ones
    const { data: originalDish, error: originalError } = await supabase
      .from('dishes')
      .select('flavors, textures, spicy_level, restaurant_id')
      .eq('id', id)
      .single()

    if (originalError || !originalDish) {
      return res.status(404).json({
        success: false,
        error: 'Original dish not found'
      })
    }

    // Find dishes with similar flavors and textures
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
          phone,
          website,
          rating,
          price_range,
          cuisine_types
        )
      `)
      .neq('id', id) // Exclude the original dish
      .limit(Number(limit))

    // Filter by similar flavors
    if (originalDish.flavors && originalDish.flavors.length > 0) {
      query = query.contains('flavors', originalDish.flavors)
    }

    // Filter by similar textures
    if (originalDish.textures && originalDish.textures.length > 0) {
      query = query.contains('textures', originalDish.textures)
    }

    // Filter by similar spice level (within 1 level)
    if (originalDish.spicy_level !== null) {
      const minSpice = Math.max(0, originalDish.spicy_level - 1)
      const maxSpice = Math.min(5, originalDish.spicy_level + 1)
      query = query.gte('spicy_level', minSpice).lte('spicy_level', maxSpice)
    }

    const { data: similarDishes, error } = await query

    if (error) {
      console.error('Get similar dishes error:', error)
      return res.status(500).json({
        success: false,
        error: 'Failed to get similar dishes'
      })
    }

    // Format results
    const formattedDishes = similarDishes?.map(dish => ({
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
      data: formattedDishes,
      total: formattedDishes.length
    })
  } catch (error) {
    console.error('Get similar dishes error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to get similar dishes'
    })
  }
}

async function addReview(req, res) {
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
    const { rating, review_text, images } = req.body

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Dish ID is required'
      })
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        error: 'Rating must be between 1 and 5'
      })
    }

    // Check if dish exists
    const { data: dish, error: dishError } = await supabase
      .from('dishes')
      .select('id')
      .eq('id', id)
      .single()

    if (dishError || !dish) {
      return res.status(404).json({
        success: false,
        error: 'Dish not found'
      })
    }

    // Check if user already reviewed this dish
    const { data: existingReview, error: existingError } = await supabase
      .from('reviews')
      .select('id')
      .eq('user_id', user.id)
      .eq('dish_id', id)
      .single()

    if (existingReview) {
      return res.status(409).json({
        success: false,
        error: 'You have already reviewed this dish'
      })
    }

    const { data: review, error } = await supabase
      .from('reviews')
      .insert({
        user_id: user.id,
        dish_id: id,
        rating,
        review_text: review_text || null,
        images: images || [],
        helpful_count: 0
      })
      .select()
      .single()

    if (error) {
      console.error('Add review error:', error)
      return res.status(500).json({
        success: false,
        error: 'Failed to add review'
      })
    }

    res.status(201).json({
      success: true,
      data: review,
      message: 'Review added successfully'
    })
  } catch (error) {
    console.error('Add review error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to add review'
    })
  }
}

async function getDishReviews(req, res) {
  try {
    const { id } = req.params
    const { limit = 20, offset = 0 } = req.query

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Dish ID is required'
      })
    }

    const { data: reviews, error, count } = await supabase
      .from('reviews')
      .select(`
        id,
        rating,
        review_text,
        images,
        helpful_count,
        created_at,
        profiles (
          id,
          name,
          avatar_url
        )
      `)
      .eq('dish_id', id)
      .order('created_at', { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1)

    if (error) {
      console.error('Get dish reviews error:', error)
      return res.status(500).json({
        success: false,
        error: 'Failed to get reviews'
      })
    }

    // Format results
    const formattedReviews = reviews?.map(review => ({
      id: review.id,
      rating: review.rating,
      review_text: review.review_text,
      images: review.images,
      helpful_count: review.helpful_count,
      created_at: review.created_at,
      user: review.profiles ? {
        id: review.profiles.id,
        name: review.profiles.name,
        avatar: review.profiles.avatar_url
      } : null
    })) || []

    res.json({
      success: true,
      data: formattedReviews,
      total: count || 0,
      limit: Number(limit),
      offset: Number(offset)
    })
  } catch (error) {
    console.error('Get dish reviews error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to get reviews'
    })
  }
}

async function createDish(req, res) {
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
      restaurant_id,
      name,
      description,
      price,
      image_url,
      flavors,
      textures,
      dietary_restrictions,
      spicy_level,
      cooking_method
    } = req.body

    if (!restaurant_id || !name) {
      return res.status(400).json({
        success: false,
        error: 'Restaurant ID and dish name are required'
      })
    }

    // Check if restaurant exists
    const { data: restaurant, error: restaurantError } = await supabase
      .from('restaurants')
      .select('id')
      .eq('id', restaurant_id)
      .single()

    if (restaurantError || !restaurant) {
      return res.status(404).json({
        success: false,
        error: 'Restaurant not found'
      })
    }

    const { data: dish, error } = await supabase
      .from('dishes')
      .insert({
        restaurant_id,
        name,
        description,
        price,
        image_url,
        flavors: flavors || [],
        textures: textures || [],
        dietary_restrictions: dietary_restrictions || [],
        spicy_level: spicy_level || 0,
        cooking_method
      })
      .select()
      .single()

    if (error) {
      console.error('Create dish error:', error)
      return res.status(500).json({
        success: false,
        error: 'Failed to create dish'
      })
    }

    res.status(201).json({
      success: true,
      data: dish,
      message: 'Dish created successfully'
    })
  } catch (error) {
    console.error('Create dish error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to create dish'
    })
  }
}

async function updateDish(req, res) {
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
        error: 'Dish ID is required'
      })
    }

    // TODO: Add proper authorization check to ensure user can update this dish
    // For now, we'll allow any authenticated user to update

    const { data: dish, error } = await supabase
      .from('dishes')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error || !dish) {
      return res.status(404).json({
        success: false,
        error: 'Dish not found or update failed'
      })
    }

    res.json({
      success: true,
      data: dish,
      message: 'Dish updated successfully'
    })
  } catch (error) {
    console.error('Update dish error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to update dish'
    })
  }
}

async function deleteDish(req, res) {
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
        error: 'Dish ID is required'
      })
    }

    // TODO: Add proper authorization check
    // For now, we'll allow any authenticated user to delete

    const { error } = await supabase
      .from('dishes')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Delete dish error:', error)
      return res.status(500).json({
        success: false,
        error: 'Failed to delete dish'
      })
    }

    res.json({
      success: true,
      message: 'Dish deleted successfully'
    })
  } catch (error) {
    console.error('Delete dish error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to delete dish'
    })
  }
}

module.exports = {
  getDishById,
  getSimilarDishes,
  addReview,
  getDishReviews,
  createDish,
  updateDish,
  deleteDish
}
