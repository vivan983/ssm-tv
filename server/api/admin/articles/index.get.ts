// =====================================================================
// ADMIN API: List ALL articles (published + drafts) for the admin panel
// =====================================================================
// BUG FIX #4a: The public /api/articles/index.get.ts endpoint hardcodes
// .eq('is_published', true), which means the admin "Ingingo" page could
// never see draft articles — the "Draft" filter was always empty.
//
// This admin endpoint:
//   - Returns ALL articles regardless of publish status
//   - Supports pagination (page, perPage)
//   - Supports category filtering
//   - Includes translations for the current locale
//   - Uses the admin service key to bypass RLS
// =====================================================================
import { requireAuth } from '../../../utils/auth'
import { useSupabaseAdmin } from '../../../utils/supabase-admin'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const query = getQuery(event)
  const page = parseInt(query.page as string) || 1
  const perPage = Math.min(parseInt(query.perPage as string) || 50, 200)
  const category = query.category as string
  const status = query.status as string // 'published' | 'draft' | undefined (all)

  const supabase = useSupabaseAdmin()
  const offset = (page - 1) * perPage

  // Build query — NO is_published filter by default (unlike the public endpoint)
  // The admin needs to see everything: drafts, published, everything.
  let dbQuery = supabase
    .from('articles')
    .select(
      `*, category:categories(id, slug), author:profiles(display_name, avatar_url)`,
      { count: 'exact' }
    )

  // Optional: filter by publish status if the admin selects a filter
  if (status === 'published') {
    dbQuery = dbQuery.eq('is_published', true)
  } else if (status === 'draft') {
    dbQuery = dbQuery.eq('is_published', false)
  }
  // If status is undefined or 'all', we don't filter — return everything

  // Optional: filter by category
  if (category) {
    const { data: catData } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', category)
      .single()
    if (catData) {
      dbQuery = dbQuery.eq('category_id', catData.id)
    }
  }

  // Order by most recently updated first, then apply pagination
  dbQuery = dbQuery
    .order('updated_at', { ascending: false })
    .range(offset, offset + perPage - 1)

  const { data, error, count } = await dbQuery

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  // Fetch translations for each article (current locale preference)
  const locale =
    (event.headers.get('accept-language') || 'rw').split(',')[0]?.split('-')[0] ||
    'rw'

  const articles = await Promise.all(
    (data || []).map(async (article: any) => {
      const { data: translations } = await supabase
        .from('article_translations')
        .select('*')
        .eq('article_id', article.id)

      const translation =
        (translations || []).find(
          (t: any) => t.language_code === locale
        ) ||
        (translations || []).find((t: any) => t.language_code === 'rw') ||
        (translations || [])[0]

      return {
        ...article,
        title: translation?.title || '',
        excerpt: translation?.excerpt || null,
        content: translation?.content || null,
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
            }
          : null,
        translations: translations || [],
      }
    })
  )

  return {
    data: articles,
    total: count || 0,
    page,
    totalPages: Math.ceil((count || 0) / perPage),
    perPage,
  }
})
