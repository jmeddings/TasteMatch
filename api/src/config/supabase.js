const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

let supabase

function getSupabase() {
  if (supabase) return supabase

  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SECRET_KEY

  console.log('Supabase URL:', supabaseUrl)
  console.log('Supabase Key exists:', !!supabaseServiceKey)

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase is not configured (missing SUPABASE_URL or SUPABASE_SECRET_KEY)')
  }

  supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  return supabase
}

module.exports = { getSupabase }
