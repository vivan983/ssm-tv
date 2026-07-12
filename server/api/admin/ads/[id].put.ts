import { useSupabaseAdmin } from '../../../utils/supabase-admin'
import { requireAuth } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'Missing ad ID' })
  }

  const body = await readBody(event)
  const supabase = useSupabaseAdmin()

  const updates: Record<string, any> = {}

  if (body.name !== undefined) updates.name = body.name?.trim()
  if (body.advertiser !== undefined) updates.advertiser = body.advertiser?.trim()
  if (body.desktop_image !== undefined) updates.desktop_image = body.desktop_image || null
  if (body.mobile_image !== undefined) updates.mobile_image = body.mobile_image || null
  if (body.destination_url !== undefined) updates.destination_url = body.destination_url || null
  if (body.placement !== undefined) updates.placement = body.placement
  if (body.priority !== undefined) updates.priority = body.priority
  if (body.is_active !== undefined) updates.is_active = body.is_active
  if (body.starts_at !== undefined) updates.starts_at = body.starts_at || null
  if (body.expires_at !== undefined) updates.expires_at = body.expires_at || null
  updates.updated_at = new Date().toISOString()

  try {
    const { data, error } = await supabase
      .from('advertisements')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.message?.includes('does not exist') || error.code === '42P01') {
        throw createError({ statusCode: 503, message: 'Run supabase/migration-ads.sql first.' })
      }
      throw createError({ statusCode: 500, message: error.message })
    }

    return { data }
  } catch (e: any) {
    if (e?.statusCode) throw e
    if (e?.message?.includes('does not exist') || e?.code === '42P01') {
      throw createError({ statusCode: 503, message: 'Run supabase/migration-ads.sql first.' })
    }
    throw e
  }
})
