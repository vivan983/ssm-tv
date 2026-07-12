import { useSupabaseServer } from '../../utils/supabase-admin'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const placement = query.placement as string
  const limit = Math.min(parseInt(query.limit as string) || 3, 10)

  const supabase = useSupabaseServer()

  let dbQuery = supabase
    .from('advertisements')
    .select('*')
    .eq('is_active', true)
    .or('starts_at.is.null,starts_at.lte.NOW()')
    .or('expires_at.is.null,expires_at.gte.NOW()')
    .order('priority', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit)

  if (placement) {
    dbQuery = dbQuery.eq('placement', placement)
  }

  const { data, error } = await dbQuery

  if (error) {
    // Non-critical — don't block page render on ad failures
    return { data: [] }
  }

  return { data }
})
