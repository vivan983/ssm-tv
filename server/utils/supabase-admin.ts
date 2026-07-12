import { createClient } from '@supabase/supabase-js'

export function useSupabaseAdmin() {
  const url = process.env.SUPABASE_URL || ''
  const key = process.env.SUPABASE_SERVICE_KEY || ''
  return createClient(url, key)
}

export function useSupabaseServer() {
  const url = process.env.SUPABASE_URL || ''
  const key = process.env.SUPABASE_KEY || ''
  return createClient(url, key)
}
