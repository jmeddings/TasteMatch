const { Request, Response } = require('express')
const { getSupabase } = require('../config/supabase')

async function requireUser(req) {
  const supabase = getSupabase()
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) throw new Error('Unauthorized')
  const { data: { user }, error } = await supabase.auth.getUser(token)
  if (error || !user) {
    throw new Error('Invalid token')
  }
  return user
}

async function createReview(req, res) {
  try {
    const supabase = getSupabase()
    const user = await requireUser(req)

    const { dish_id, rating, content, photo_urls, status, draft_id } = req.body

    if (!dish_id) {
      return res.status(400).json({ success: false, error: 'dish_id is required' })
    }

    const normalizedStatus = normalizeStatus(status || 'draft')
    if (!normalizedStatus) {
      return res.status(400).json({ success: false, error: 'Invalid status' })
    }

    if (rating !== undefined && (rating < 1 || rating > 5)) {
      return res.status(400).json({ success: false, error: 'Rating must be between 1 and 5' })
    }

    const { data: review, error: dbError } = await supabase
      .from('reviews')
      .insert({
        user_id: user.id,
        dish_id,
        rating: rating || null,
        content: content || null,
        photo_urls: photo_urls || [],
        status: normalizedStatus
      })
      .select('review_id, user_id, dish_id, rating, content, photo_urls, status, created_at')
      .single()

    if (dbError || !review) {
      console.error('Create review error:', dbError)
      return res.status(500).json({ success: false, error: 'Failed to create review' })
    }

    if (normalizedStatus === 'published' && draft_id) {
      await supabase
        .from('drafts')
        .delete()
        .eq('draft_id', draft_id)
        .eq('user_id', user.id)
    }

    return res.status(201).json({ success: true, data: review })
  } catch (e) {
    console.error('Create review error:', e)
    return res.status(500).json({ success: false, error: 'Failed to create review' })
  }
}

async function getReview(req, res) {
  try {
    const supabase = getSupabase()
    const user = await requireUser(req)

    const { id } = req.params

    const { data: review, error: dbError } = await supabase
      .from('reviews')
      .select('review_id, user_id, dish_id, rating, content, photo_urls, status, created_at')
      .eq('review_id', id)
      .eq('user_id', user.id)
      .single()

    if (dbError || !review) {
      return res.status(404).json({ success: false, error: 'Review not found' })
    }

    return res.json({ success: true, data: review })
  } catch (e) {
    console.error('Get review error:', e)
    return res.status(500).json({ success: false, error: 'Failed to get review' })
  }
}

async function listReviews(req, res) {
  try {
    const supabase = getSupabase()
    const user = await requireUser(req)

    const { dish_id, status } = req.query

    let query = supabase
      .from('reviews')
      .select('review_id, user_id, dish_id, rating, content, photo_urls, status, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (dish_id) query = query.eq('dish_id', dish_id)
    if (status) query = query.eq('status', status)

    const { data, error: dbError } = await query

    if (dbError) {
      console.error('List reviews error:', dbError)
      return res.status(500).json({ success: false, error: 'Failed to list reviews' })
    }

    return res.json({ success: true, data: data || [] })
  } catch (e) {
    console.error('List reviews error:', e)
    return res.status(500).json({ success: false, error: 'Failed to list reviews' })
  }
}

async function updateReview(req, res) {
  try {
    const supabase = getSupabase()
    const user = await requireUser(req)

    const { id } = req.params
    const { rating, content, photo_urls, status, draft_id } = req.body

    const update = {
      updated_at: new Date().toISOString()
    }

    if (rating !== undefined) {
      if (rating < 1 || rating > 5) {
        return res.status(400).json({ success: false, error: 'Rating must be between 1 and 5' })
      }
      update.rating = rating
    }

    if (content !== undefined) update.content = content
    if (photo_urls !== undefined) update.photo_urls = photo_urls

    if (status !== undefined) {
      const normalized = normalizeStatus(status)
      if (!normalized) return res.status(400).json({ success: false, error: 'Invalid status' })
      update.status = normalized
    }

    const { data: review, error: dbError } = await supabase
      .from('reviews')
      .update(update)
      .eq('review_id', id)
      .eq('user_id', user.id)
      .select('review_id, user_id, dish_id, rating, content, photo_urls, status, created_at')
      .single()

    if (dbError || !review) {
      console.error('Update review error:', dbError)
      return res.status(404).json({ success: false, error: 'Review not found or update failed' })
    }

    if (update.status === 'published' && draft_id) {
      await supabase
        .from('drafts')
        .delete()
        .eq('draft_id', draft_id)
        .eq('user_id', user.id)
    }

    return res.json({ success: true, data: review })
  } catch (e) {
    console.error('Update review error:', e)
    return res.status(500).json({ success: false, error: 'Failed to update review' })
  }
}

async function deleteReview(req, res) {
  try {
    const supabase = getSupabase()
    const user = await requireUser(req)

    const { id } = req.params

    const { error: dbError } = await supabase
      .from('reviews')
      .delete()
      .eq('review_id', id)
      .eq('user_id', user.id)

    if (dbError) {
      console.error('Delete review error:', dbError)
      return res.status(500).json({ success: false, error: 'Failed to delete review' })
    }

    return res.json({ success: true })
  } catch (e) {
    console.error('Delete review error:', e)
    return res.status(500).json({ success: false, error: 'Failed to delete review' })
  }
}

module.exports = {
  createReview,
  getReview,
  listReviews,
  updateReview,
  deleteReview
}
