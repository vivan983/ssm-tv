import { useSupabaseAdmin } from '../../utils/supabase-admin'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const supabase = useSupabaseAdmin()

  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return { data }
})
