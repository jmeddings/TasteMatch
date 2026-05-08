const { supabase } = require('../config/supabase')

async function getAuthedUser(req) {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return { error: { status: 401, message: 'No authorization header provided' } }
  }

  const token = authHeader.replace('Bearer ', '')
  const { data: { user }, error } = await supabase.auth.getUser(token)

  if (error || !user) {
    return { error: { status: 401, message: 'Invalid token' } }
  }

  return { user }
}

async function listDrafts(req, res) {
  try {
    const { user, error } = await getAuthedUser(req)
    if (error) return res.status(error.status).json({ success: false, error: error.message })

    const { draft_type } = req.query

    let query = supabase
      .from('drafts')
      .select('draft_id, user_id, draft_type, payload, last_saved_at')
      .eq('user_id', user.id)
      .order('last_saved_at', { ascending: false })

    if (draft_type) query = query.eq('draft_type', draft_type)

    const { data, error: dbError } = await query

    if (dbError) {
      console.error('List drafts error:', dbError)
      return res.status(500).json({ success: false, error: 'Failed to list drafts' })
    }

    return res.json({ success: true, data })
  } catch (e) {
    console.error('List drafts error:', e)
    return res.status(500).json({ success: false, error: 'Failed to list drafts' })
  }
}

async function getDraft(req, res) {
  try {
    const { user, error } = await getAuthedUser(req)
    if (error) return res.status(error.status).json({ success: false, error: error.message })

    const { id } = req.params

    const { data, error: dbError } = await supabase
      .from('drafts')
      .select('draft_id, user_id, draft_type, payload, last_saved_at')
      .eq('draft_id', id)
      .eq('user_id', user.id)
      .single()

    if (dbError || !data) {
      return res.status(404).json({ success: false, error: 'Draft not found' })
    }

    return res.json({ success: true, data })
  } catch (e) {
    console.error('Get draft error:', e)
    return res.status(500).json({ success: false, error: 'Failed to get draft' })
  }
}

async function upsertDraft(req, res) {
  try {
    const { user, error } = await getAuthedUser(req)
    if (error) return res.status(error.status).json({ success: false, error: error.message })

    const { draft_id, draft_type, payload } = req.body

    if (!draft_type) {
      return res.status(400).json({ success: false, error: 'draft_type is required' })
    }

    const draft = {
      draft_id: draft_id || undefined,
      user_id: user.id,
      draft_type,
      payload: payload || {},
      last_saved_at: new Date().toISOString()
    }

    const { data, error: dbError } = await supabase
      .from('drafts')
      .upsert(draft, { onConflict: 'draft_id' })
      .select('draft_id, user_id, draft_type, payload, last_saved_at')
      .single()

    if (dbError || !data) {
      console.error('Upsert draft error:', dbError)
      return res.status(500).json({ success: false, error: 'Failed to save draft' })
    }

    return res.json({ success: true, data })
  } catch (e) {
    console.error('Upsert draft error:', e)
    return res.status(500).json({ success: false, error: 'Failed to save draft' })
  }
}

async function autosaveDraft(req, res) {
  try {
    const { user, error } = await getAuthedUser(req)
    if (error) return res.status(error.status).json({ success: false, error: error.message })

    const { draft_type, payload } = req.body

    if (!draft_type) {
      return res.status(400).json({ success: false, error: 'draft_type is required' })
    }

    const now = new Date().toISOString()

    const { data: existing, error: existingError } = await supabase
      .from('drafts')
      .select('draft_id')
      .eq('user_id', user.id)
      .eq('draft_type', draft_type)
      .order('last_saved_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (existingError) {
      console.error('Autosave draft lookup error:', existingError)
      return res.status(500).json({ success: false, error: 'Failed to autosave draft' })
    }

    const draft = {
      draft_id: existing?.draft_id || undefined,
      user_id: user.id,
      draft_type,
      payload: payload || {},
      last_saved_at: now
    }

    const { data, error: dbError } = await supabase
      .from('drafts')
      .upsert(draft, existing?.draft_id ? { onConflict: 'draft_id' } : undefined)
      .select('draft_id, user_id, draft_type, payload, last_saved_at')
      .single()

    if (dbError || !data) {
      console.error('Autosave draft error:', dbError)
      return res.status(500).json({ success: false, error: 'Failed to autosave draft' })
    }

    return res.json({ success: true, data })
  } catch (e) {
    console.error('Autosave draft error:', e)
    return res.status(500).json({ success: false, error: 'Failed to autosave draft' })
  }
}

async function resumeDraft(req, res) {
  try {
    const { user, error } = await getAuthedUser(req)
    if (error) return res.status(error.status).json({ success: false, error: error.message })

    const { draft_type } = req.query

    if (!draft_type) {
      return res.status(400).json({ success: false, error: 'draft_type is required' })
    }

    const { data, error: dbError } = await supabase
      .from('drafts')
      .select('draft_id, user_id, draft_type, payload, last_saved_at')
      .eq('user_id', user.id)
      .eq('draft_type', draft_type)
      .order('last_saved_at', { ascending: false })
      .limit(1)

    if (dbError) {
      console.error('Resume draft error:', dbError)
      return res.status(500).json({ success: false, error: 'Failed to resume draft' })
    }

    const draft = data && data.length > 0 ? data[0] : null
    if (!draft) return res.status(404).json({ success: false, error: 'Draft not found' })

    return res.json({ success: true, data: draft })
  } catch (e) {
    console.error('Resume draft error:', e)
    return res.status(500).json({ success: false, error: 'Failed to resume draft' })
  }
}

async function deleteDraft(req, res) {
  try {
    const { user, error } = await getAuthedUser(req)
    if (error) return res.status(error.status).json({ success: false, error: error.message })

    const { id } = req.params

    const { error: dbError } = await supabase
      .from('drafts')
      .delete()
      .eq('draft_id', id)
      .eq('user_id', user.id)

    if (dbError) {
      console.error('Delete draft error:', dbError)
      return res.status(500).json({ success: false, error: 'Failed to delete draft' })
    }

    return res.json({ success: true })
  } catch (e) {
    console.error('Delete draft error:', e)
    return res.status(500).json({ success: false, error: 'Failed to delete draft' })
  }
}

module.exports = {
  listDrafts,
  getDraft,
  upsertDraft,
  autosaveDraft,
  resumeDraft,
  deleteDraft
}
