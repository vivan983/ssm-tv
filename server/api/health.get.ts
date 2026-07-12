// Comprehensive health check endpoint
// Visit /api/health to diagnose Supabase connection and env var issues
import { useSupabaseServer } from '../utils/supabase-admin'

export default defineEventHandler(async () => {
  const checks: Record<string, any> = {
    timestamp: new Date().toISOString(),
    environment: {
      supabaseUrl: !!process.env.SUPABASE_URL,
      supabaseKey: !!process.env.SUPABASE_KEY,
      supabaseServiceKey: !!process.env.SUPABASE_SERVICE_KEY,
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'not set',
    },
  }

  // Test Supabase connection
  try {
    const supabase = useSupabaseServer()
    const { count, error } = await supabase
      .from('articles')
      .select('*', { count: 'exact', head: true })
      .eq('is_published', true)

    checks.database = {
      connected: !error,
      error: error ? error.message : null,
      publishedArticles: count ?? 0,
    }
  } catch (e: any) {
    checks.database = {
      connected: false,
      error: e?.message || 'Unknown connection error',
      publishedArticles: 0,
    }
  }

  return checks
})
