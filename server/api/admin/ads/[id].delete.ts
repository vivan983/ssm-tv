import { useSupabaseAdmin } from '../../../utils/supabase-admin'
import { requireAuth } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'Missing ad ID' })
  }

  const supabase = useSupabaseAdmin()
  try {
    const { error } = await supabase
      .from('advertisements')
      .delete()
      .eq('id', id)

    if (error) {
      if (error.message?.includes('does not exist') || error.code === '42P01') {
        throw createError({ statusCode: 503, message: 'Run supabase/migration-ads.sql first.' })
      }
      throw createError({ statusCode: 500, message: error.message })
    }

    return { success: true }
  } catch (e: any) {
    if (e?.statusCode) throw e
    if (e?.message?.includes('does not exist') || e?.code === '42P01') {
      throw createError({ statusCode: 503, message: 'Run supabase/migration-ads.sql first.' })
    }
    throw e
  }
})
