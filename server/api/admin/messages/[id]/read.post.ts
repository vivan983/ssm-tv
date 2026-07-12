import { useSupabaseAdmin } from '../../../../utils/supabase-admin'
import { requireAuth } from '../../../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, message: 'Message ID is required' })
  }

  const supabase = useSupabaseAdmin()

  const { error } = await supabase
    .from('contact_messages')
    .update({ is_read: true })
    .eq('id', id)

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return { success: true }
})
