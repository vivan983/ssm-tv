import { requireAuth } from '../../../utils/auth'
import { useSupabaseAdmin } from '../../../utils/supabase-admin'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'Category ID is required' })

  const supabase = useSupabaseAdmin()

  // Set articles to no category, then delete
  await supabase.from('articles').update({ category_id: null }).eq('category_id', id)
  const { error } = await supabase.from('categories').delete().eq('id', id)

  if (error) throw createError({ statusCode: 500, message: error.message })

  return { success: true }
})
