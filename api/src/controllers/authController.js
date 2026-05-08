const { Request, Response } = require('express')
const { getSupabase } = require('../config/supabase')

async function signUp(req, res) {
  try {
    const supabase = getSupabase()
    const { email, password, username } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      })
    }

    if (!username) {
      return res.status(400).json({
        success: false,
        error: 'Username is required'
      })
    }

    // Create user with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username
        }
      }
    })

    if (error) {
      return res.status(400).json({
        success: false,
        error: error.message
      })
    }

    // Create profile record
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          email: data.user.email,
          name: username
        })

      if (profileError) {
        console.error('Profile creation error:', profileError)
      }

      const { error: tasteProfileError } = await supabase
        .from('taste_profiles')
        .insert({
          user_id: data.user.id,
          preferences: {},
          onboarding_complete: false
        })

      if (tasteProfileError) {
        console.error('Taste profile creation error:', tasteProfileError)
      }
    }

    res.status(201).json({
      success: true,
      data: {
        id: data.user?.id,
        email: data.user?.email,
        username: data.user?.user_metadata?.username || null
      },
      message: 'User registered successfully'
    })
  } catch (error) {
    console.error('Sign up error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to sign up'
    })
  }
}

async function getTasteProfile(req, res) {
  try {
    const supabase = getSupabase()
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No authorization header provided'
      })
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token'
      })
    }

    const { data: tasteProfile, error } = await supabase
      .from('taste_profiles')
      .select('user_id, preferences, onboarding_complete, updated_at')
      .eq('user_id', user.id)
      .single()

    if (error || !tasteProfile) {
      return res.status(404).json({
        success: false,
        error: 'TasteProfile not found'
      })
    }

    return res.json({ success: true, data: tasteProfile })
  } catch (error) {
    console.error('Get taste profile error:', error)
    return res.status(500).json({ success: false, error: 'Failed to get TasteProfile' })
  }
}

async function updateTasteProfile(req, res) {
  try {
    const supabase = getSupabase()
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No authorization header provided'
      })
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token'
      })
    }

    const { preferences, onboarding_complete } = req.body

    const updateData = {
      updated_at: new Date().toISOString()
    }

    if (preferences !== undefined) updateData.preferences = preferences
    if (onboarding_complete !== undefined) updateData.onboarding_complete = onboarding_complete

    const { data: tasteProfile, error } = await supabase
      .from('taste_profiles')
      .update(updateData)
      .eq('user_id', user.id)
      .select('user_id, preferences, onboarding_complete, updated_at')
      .single()

    if (error || !tasteProfile) {
      return res.status(400).json({
        success: false,
        error: error?.message || 'Failed to update TasteProfile'
      })
    }

    return res.json({ success: true, data: tasteProfile })
  } catch (error) {
    console.error('Update taste profile error:', error)
    return res.status(500).json({ success: false, error: 'Failed to update TasteProfile' })
  }
}

async function deleteAccount(req, res) {
  try {
    const supabase = getSupabase()
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No authorization header provided'
      })
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token'
      })
    }

    const { error } = await supabase.auth.admin.deleteUser(user.id)
    if (error) {
      return res.status(400).json({ success: false, error: error.message })
    }

    return res.json({ success: true })
  } catch (error) {
    console.error('Delete account error:', error)
    return res.status(500).json({ success: false, error: 'Failed to delete account' })
  }
}

async function signIn(req, res) {
  try {
    const supabase = getSupabase()
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      })
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      return res.status(401).json({
        success: false,
        error: error.message
      })
    }

    // Get user profile
    let profile = null
    if (data.user) {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single()

      profile = profileData
    }

    res.json({
      success: true,
      data: {
        user: {
          id: data.user?.id,
          email: data.user?.email,
          name: profile?.name || data.user?.user_metadata?.name || null,
          avatar: profile?.avatar_url || null
        },
        session: {
          access_token: data.session?.access_token,
          refresh_token: data.session?.refresh_token,
          expires_at: data.session?.expires_at ? new Date(data.session.expires_at).getTime() : null
        }
      },
      message: 'Signed in successfully'
    })
  } catch (error) {
    console.error('Sign in error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to sign in'
    })
  }
}

async function signOut(req, res) {
  try {
    const supabase = getSupabase()
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No authorization header provided'
      })
    }

    const { error } = await supabase.auth.admin.signOut(token)

    if (error) {
      return res.status(400).json({
        success: false,
        error: error.message
      })
    }

    res.json({
      success: true,
      message: 'Signed out successfully'
    })
  } catch (error) {
    console.error('Sign out error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to sign out'
    })
  }
}

async function getProfile(req, res) {
  try {
    const supabase = getSupabase()
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No authorization header provided'
      })
    }
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token'
      })
    }

    // Get user profile with stats
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError) {
      return res.status(404).json({
        success: false,
        error: 'Profile not found'
      })
    }

    // Get user stats
    const { data: stats } = await supabase
      .rpc('get_user_stats', { user_id: user.id })

    res.json({
      success: true,
      data: {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        avatar: profile.avatar_url,
        bio: profile.bio,
        dietary_restrictions: profile.dietary_restrictions,
        stats: stats || {
          favorites: 0,
          reviews: 0,
          photos: 0
        },
        createdAt: profile.created_at
      }
    })
  } catch (error) {
    console.error('Get profile error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to get profile'
    })
  }
}

async function updateProfile(req, res) {
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

    const { name, bio, avatar_url, dietary_restrictions } = req.body

    const { data: profile, error: updateError } = await supabase
      .from('profiles')
      .update({
        name,
        bio,
        avatar_url,
        dietary_restrictions,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)
      .select()
      .single()

    if (updateError) {
      return res.status(400).json({
        success: false,
        error: updateError.message
      })
    }

    res.json({
      success: true,
      data: profile,
      message: 'Profile updated successfully'
    })
  } catch (error) {
    console.error('Update profile error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to update profile'
    })
  }
}

module.exports = {
  signUp,
  signIn,
  signOut,
  getProfile,
  updateProfile,
  getTasteProfile,
  updateTasteProfile,
  deleteAccount
}
