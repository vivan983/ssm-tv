import { createClient } from '@supabase/supabase-js'

function getSupabaseUrl(): string {
  // Try runtime config first (proper Nuxt way), fall back to process.env, then hardcoded
  try {
    const config = useRuntimeConfig()
    if (config.public?.supabaseUrl) return config.public.supabaseUrl as string
  } catch {}
  return process.env.SUPABASE_URL || process.env.NUXT_PUBLIC_SUPABASE_URL || 'https://lmmecjuybkfwxzzmfpnw.supabase.co'
}

function getSupabaseKey(): string {
  try {
    const config = useRuntimeConfig()
    if (config.public?.supabaseKey) return config.public.supabaseKey as string
  } catch {}
  return process.env.SUPABASE_KEY || process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_dbwffn1F8PycyoHDNF9Y2Q_g6Y5mfte'
}

function getServiceKey(): string {
  return process.env.SUPABASE_SERVICE_KEY || ''
}

export function useSupabaseAdmin() {
  const url = getSupabaseUrl()
  const key = getServiceKey() || getSupabaseKey()
  return createClient(url, key)
}

export function useSupabaseServer() {
  const url = getSupabaseUrl()
  const key = getSupabaseKey()
  return createClient(url, key)
}
