// =====================================================================
// ADMIN API: Get single article by ID (for edit page)
// =====================================================================
// BUG FIX #3a: The public /api/articles/[slug].get.ts endpoint fetches
// articles by slug. The admin edit page uses article.id (UUID) in the URL
// route (/admin/edit/[id].vue), so the public endpoint always returned 404.
//
// This new admin endpoint:
//   - Fetches article by UUID (id column) using the admin service key
//   - Returns ALL articles regardless of publish status (drafts too)
//   - Includes all translations for the editor form
//   - Includes category and author data
// =====================================================================
import { useSupabaseAdmin } from '../../../utils/supabase-admin'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, message: 'Article ID is required' })
  }

  const supabase = useSupabaseAdmin()

  // Fetch the article by UUID (id column), NOT by slug.
  // This is the key fix: the public endpoint queries .eq('slug', slug)
  // but we need .eq('id', id) for the admin edit page.
  const { data: article, error } = await supabase
    .from('articles')
    .select(`*, category:categories(id, slug), author:profiles(display_name, avatar_url, bio)`)
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      throw createError({ statusCode: 404, statusMessage: 'Article not found' })
    }
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch article' })
  }

  // Fetch ALL translations for this article (all languages)
  const { data: translations } = await supabase
    .from('article_translations')
    .select('*')
    .eq('article_id', article.id)

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
