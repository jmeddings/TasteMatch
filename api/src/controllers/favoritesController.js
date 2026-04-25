const { Request, Response } = require('express')
const { supabase } = require('../config/supabase')

async function getFavorites(req, res) {
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

    const { limit = 20, offset = 0 } = req.query

    const { data: favorites, error, count } = await supabase
      .from('favorites')
      .select(`
        id,
        notes,
        rating,
        created_at,
        dishes (
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
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1)

    if (error) {
      console.error('Get favorites error:', error)
      return res.status(500).json({
        success: false,
        error: 'Failed to get favorites'
      })
    }

    // Format results
    const formattedFavorites = favorites?.map(favorite => ({
      id: favorite.id,
      notes: favorite.notes,
      rating: favorite.rating,
      addedAt: favorite.created_at,
      dish: favorite.dishes ? {
        id: favorite.dishes.id,
        name: favorite.dishes.name,
        description: favorite.dishes.description,
        price: favorite.dishes.price,
        image: favorite.dishes.image_url,
        rating: favorite.dishes.rating,
        flavors: favorite.dishes.flavors,
        textures: favorite.dishes.textures,
        dietary_restrictions: favorite.dishes.dietary_restrictions,
        spicy_level: favorite.dishes.spicy_level,
        cooking_method: favorite.dishes.cooking_method,
        restaurant: favorite.dishes.restaurants ? {
          id: favorite.dishes.restaurants.id,
          name: favorite.dishes.restaurants.name,
          address: favorite.dishes.restaurants.address,
          city: favorite.dishes.restaurants.city,
          state: favorite.dishes.restaurants.state,
          zip_code: favorite.dishes.restaurants.zip_code,
          location: `${favorite.dishes.restaurants.city}, ${favorite.dishes.restaurants.state}`,
          phone: favorite.dishes.restaurants.phone,
          website: favorite.dishes.restaurants.website,
          rating: favorite.dishes.restaurants.rating,
          price_range: favorite.dishes.restaurants.price_range,
          cuisine_types: favorite.dishes.restaurants.cuisine_types
        } : null
      } : null
    })) || []

    res.json({
      success: true,
      data: formattedFavorites,
      total: count || 0,
      limit: Number(limit),
      offset: Number(offset)
    })
  } catch (error) {
    console.error('Get favorites error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to get favorites'
    })
  }
}

async function addFavorite(req, res) {
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

    const { dishId, notes, rating } = req.body

    if (!dishId) {
      return res.status(400).json({
        success: false,
        error: 'Dish ID is required'
      })
    }

    // Check if dish exists
    const { data: dish, error: dishError } = await supabase
      .from('dishes')
      .select('id')
      .eq('id', dishId)
      .single()

    if (dishError || !dish) {
      return res.status(404).json({
        success: false,
        error: 'Dish not found'
      })
    }

    // Check if already favorited
    const { data: existingFavorite, error: existingError } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('dish_id', dishId)
      .single()

    if (existingFavorite) {
      return res.status(409).json({
        success: false,
        error: 'Dish already in favorites'
      })
    }

    const { data: newFavorite, error } = await supabase
      .from('favorites')
      .insert({
        user_id: user.id,
        dish_id: dishId,
        notes: notes || null,
        rating: rating || null
      })
      .select()
      .single()

    if (error) {
      console.error('Add favorite error:', error)
      return res.status(500).json({
        success: false,
        error: 'Failed to add favorite'
      })
    }

    res.status(201).json({
      success: true,
      data: newFavorite,
      message: 'Dish added to favorites'
    })
  } catch (error) {
    console.error('Add favorite error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to add favorite'
    })
  }
}

async function removeFavorite(req, res) {
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
        error: 'Favorite ID is required'
      })
    }

    // Verify favorite belongs to user
    const { data: favorite, error: favoriteError } = await supabase
      .from('favorites')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (favoriteError || !favorite) {
      return res.status(404).json({
        success: false,
        error: 'Favorite not found'
      })
    }

    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Remove favorite error:', error)
      return res.status(500).json({
        success: false,
        error: 'Failed to remove favorite'
      })
    }

    res.json({
      success: true,
      message: 'Dish removed from favorites'
    })
  } catch (error) {
    console.error('Remove favorite error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to remove favorite'
    })
  }
}

async function updateFavorite(req, res) {
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
    const { notes, rating } = req.body

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Favorite ID is required'
      })
    }

    // Verify favorite belongs to user
    const { data: favorite, error: favoriteError } = await supabase
      .from('favorites')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (favoriteError || !favorite) {
      return res.status(404).json({
        success: false,
        error: 'Favorite not found'
      })
    }

    const { data: updatedFavorite, error } = await supabase
      .from('favorites')
      .update({
        notes: notes !== undefined ? notes : undefined,
        rating: rating !== undefined ? rating : undefined
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Update favorite error:', error)
      return res.status(500).json({
        success: false,
        error: 'Failed to update favorite'
      })
    }

    res.json({
      success: true,
      data: updatedFavorite,
      message: 'Favorite updated successfully'
    })
  } catch (error) {
    console.error('Update favorite error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to update favorite'
    })
  }
}

module.exports = {
  getFavorites,
  addFavorite,
  removeFavorite,
  updateFavorite
}
