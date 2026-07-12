// BUG FIX: Use useSupabaseAdmin() instead of useSupabaseServer() because
// the profiles table RLS blocks the anon key from reading author profiles.
// The admin client (service role) bypasses RLS, which is safe here since
// this is a server-side only endpoint that only returns published articles.
import { useSupabaseAdmin } from '../../utils/supabase-admin'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const limit = Math.min(parseInt(query.limit as string) || 5, 20)

  const supabase = useSupabaseAdmin()

  const { data, error } = await supabase
    .from('articles')
    .select(`*, category:categories(id, slug), author:profiles(display_name, avatar_url)`)
    .eq('is_published', true)
    .order('view_count', { ascending: false })
    .limit(limit)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch most-read articles' })
  }

  const articles = await Promise.all(
    (data || []).map(async (article: any) => {
      const { data: translations } = await supabase
        .from('article_translations')
        .select('*')
        .eq('article_id', article.id)
        .limit(1)

      const translation = (translations || [])[0]
      return {
        ...article,
        title: translation?.title || '',
        excerpt: translation?.excerpt || null,
        author: article.author
          ? { display_name: article.author.display_name, avatar_url: article.author.avatar_url }
          : null,
      }
    })
  )

  return { data: articles }
})
