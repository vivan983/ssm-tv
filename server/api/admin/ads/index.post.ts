import { useSupabaseAdmin } from '../../../utils/supabase-admin'
import { requireAuth } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const body = await readBody(event)
  const supabase = useSupabaseAdmin()

  if (!body.name || body.name.trim().length < 2) {
    throw createError({ statusCode: 400, message: 'Ad name is required' })
  }
  if (!body.advertiser || body.advertiser.trim().length < 2) {
    throw createError({ statusCode: 400, message: 'Advertiser name is required' })
  }
  if (!body.placement) {
    throw createError({ statusCode: 400, message: 'Placement is required' })
  }

  try {
    const { data, error } = await supabase
      .from('advertisements')
      .insert({
        name: body.name.trim(),
        advertiser: body.advertiser.trim(),
        desktop_image: body.desktop_image || null,
        mobile_image: body.mobile_image || null,
        destination_url: body.destination_url || null,
        placement: body.placement,
        priority: body.priority || 0,
        is_active: body.is_active ?? true,
        starts_at: body.starts_at || null,
        expires_at: body.expires_at || null,
      })
      .select()
      .single()

    if (error) {
      if (error.message?.includes('does not exist') || error.code === '42P01') {
        throw createError({ statusCode: 503, message: 'Run supabase/migration-ads.sql first to create the advertisements table.' })
      }
      throw createError({ statusCode: 500, message: error.message })
    }

    return { data }
  } catch (e: any) {
    if (e?.statusCode) throw e
    if (e?.message?.includes('does not exist') || e?.code === '42P01') {
      throw createError({ statusCode: 503, message: 'Run supabase/migration-ads.sql first to create the advertisements table.' })
    }
    throw e
  }
})
