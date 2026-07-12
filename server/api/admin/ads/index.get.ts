import { useSupabaseAdmin } from '../../../utils/supabase-admin'
import { requireAuth } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const query = getQuery(event)
  const placement = query.placement as string
  const active = query.active as string

  const supabase = useSupabaseAdmin()

  try {
    let dbQuery = supabase
      .from('advertisements')
      .select('*', { count: 'exact' })
      .order('priority', { ascending: false })
      .order('created_at', { ascending: false })

    if (placement) {
      dbQuery = dbQuery.eq('placement', placement)
    }

    if (active === 'true') {
      dbQuery = dbQuery
        .eq('is_active', true)
        .or('starts_at.is.null,starts_at.lte.NOW()')
        .or('expires_at.is.null,expires_at.gte.NOW()')
    }

    const { data, error, count } = await dbQuery

    if (error) {
      // Table might not exist yet — return empty gracefully
      if (error.message?.includes('does not exist') || error.code === '42P01') {
        return { data: [], total: 0, migrationRequired: true }
      }
      throw createError({ statusCode: 500, message: error.message })
    }

    return { data, total: count || 0 }
  } catch (e: any) {
    if (e?.message?.includes('does not exist') || e?.code === '42P01') {
      return { data: [], total: 0, migrationRequired: true }
    }
    throw e
  }
})
