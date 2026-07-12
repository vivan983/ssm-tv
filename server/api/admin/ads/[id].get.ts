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
    const { data, error } = await supabase
      .from('advertisements')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.message?.includes('does not exist') || error.code === '42P01') {
        return { data: null, migrationRequired: true }
      }
      throw createError({ statusCode: 404, message: 'Advertisement not found' })
    }

    return { data }
  } catch (e: any) {
    if (e?.statusCode) throw e
    if (e?.message?.includes('does not exist') || e?.code === '42P01') {
      return { data: null, migrationRequired: true }
    }
    throw e
  }
})
