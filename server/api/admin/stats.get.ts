// BUG FIX: Use admin client — RLS on contact_messages/articles blocks
// the anon key from counting rows. Auth already verified via requireAuth().
import { useSupabaseAdmin } from '../../utils/supabase-admin'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const supabase = useSupabaseAdmin()

  const [
    { count: totalArticles },
    { count: publishedArticles },
    { count: unreadMessages },
  ] = await Promise.all([
    supabase.from('articles').select('*', { count: 'exact', head: true }),
    supabase.from('articles').select('*', { count: 'exact', head: true }).eq('is_published', true),
    supabase.from('contact_messages').select('*', { count: 'exact', head: true }).eq('is_read', false),
  ])

  const { data: viewData } = await supabase
    .from('articles')
    .select('view_count')

  const totalViews = (viewData || []).reduce((sum, a) => sum + (a.view_count || 0), 0)

  return {
    data: {
      totalArticles: totalArticles || 0,
      publishedArticles: publishedArticles || 0,
      totalViews,
      unreadMessages: unreadMessages || 0,
    },
  }
})
