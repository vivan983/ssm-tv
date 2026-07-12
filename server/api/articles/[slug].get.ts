// BUG FIX: Use useSupabaseAdmin() (service role) so the profiles join
// for the author byline doesn't fail on RLS. The profiles table only
// allows users to read their own profile via the anon key.
import { useSupabaseAdmin } from '../../utils/supabase-admin'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({ statusCode: 400, message: 'Slug is required' })
  }

  const supabase = useSupabaseAdmin()

  const { data: article, error } = await supabase
    .from('articles')
    .select(`*, category:categories(id, slug), author:profiles(display_name, avatar_url, bio)`)
    .eq('slug', slug)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      throw createError({ statusCode: 404, message: 'Article not found' })
    }
    throw createError({ statusCode: 500, message: error.message })
  }

  // Fetch all translations
  const { data: translations } = await supabase
    .from('article_translations')
    .select('*')
    .eq('article_id', article.id)

  // Increment view count (non-blocking)
  supabase
    .from('articles')
    .update({ view_count: (article.view_count || 0) + 1 })
    .eq('id', article.id)
    .then(() => {})
    .catch(() => {})

  return {
    data: {
      ...article,
      title: (translations || [])[0]?.title || '',
      excerpt: (translations || [])[0]?.excerpt || null,
      content: (translations || [])[0]?.content || null,
      translations: translations || [],
      category: article.category
        ? {
            id: article.category.id,
            slug: article.category.slug,
            name: article.category.slug,
          }
        : null,
      author: article.author
        ? {
            display_name: article.author.display_name,
            avatar_url: article.author.avatar_url,
            bio: article.author.bio,
          }
        : null,
    },
  }
})
