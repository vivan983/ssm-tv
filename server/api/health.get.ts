// Simple Supabase health check — confirms env vars + connection work
import { useSupabaseServer } from '../utils/supabase-admin'

export default defineEventHandler(async () => {
  const supabase = useSupabaseServer()

  const checks: Record<string, any> = {
    supabaseUrl: !!process.env.SUPABASE_URL,
    supabaseKey: !!process.env.SUPABASE_KEY,
    supabaseServiceKey: !!process.env.SUPABASE_SERVICE_KEY,
  }

  try {
    const { count, error } = await supabase
      .from('articles')
      .select('*', { count: 'exact', head: true })
      .eq('is_published', true)

    checks.connection = error ? `FAIL: ${error.message}` : 'OK'
    checks.articleCount = count ?? 0
  } catch (e: any) {
    checks.connection = `FAIL: ${e.message}`
  }

  return checks
})
