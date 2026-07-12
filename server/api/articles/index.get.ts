// BUG FIX: Use useSupabaseAdmin() instead of useSupabaseServer() because
// the profiles table RLS blocks the anon key from reading author profiles
// when joining. The admin client is safe here — this is server-side only.
import { useSupabaseAdmin } from '../../utils/supabase-admin'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = parseInt(query.page as string) || 1
  const perPage = Math.min(parseInt(query.perPage as string) || 12, 50)
  const category = query.category as string
  const featured = query.featured as string
  const search = query.search as string

  const supabase = useSupabaseAdmin()
  const offset = (page - 1) * perPage

  let dbQuery = supabase
    .from('articles')
    .select(
      `*, category:categories(id, slug), author:profiles(display_name, avatar_url)`,
      { count: 'exact' }
    )
    .eq('is_published', true)

  if (category) {
    // BUG FIX: Use .ilike() for case-insensitive slug matching.
    // Category slugs in DB are UPPERCASE but query params use lowercase.
    const { data: catData } = await supabase
      .from('categories')
      .select('id')
      .ilike('slug', category)
      .single()
    if (catData) {
      dbQuery = dbQuery.eq('category_id', catData.id)
    }
  }

  if (featured === 'true') {
    dbQuery = dbQuery.eq('is_featured', true)
  }

  if (search) {
    const term = `%${search}%`

    // Search across article_translations: title, excerpt, and content
    const { data: translationMatches } = await supabase
      .from('article_translations')
      .select('article_id')
      .or(`title.ilike.${term},excerpt.ilike.${term},content.ilike.${term}`)

    let matchingIds = [...new Set((translationMatches || []).map((t: any) => t.article_id))]

    // Also search by slug
    const { data: slugMatches } = await supabase
      .from('articles')
      .select('id')
      .ilike('slug', term)

    matchingIds = [...new Set([...matchingIds, ...(slugMatches || []).map((a: any) => a.id)])]

    if (matchingIds.length > 0) {
      dbQuery = dbQuery.in('id', matchingIds)
    } else {
      // No matches found — return empty result set early
      return { data: [], total: 0, page, totalPages: 0, perPage }
    }
  }

  dbQuery = dbQuery
    .order('published_at', { ascending: false })
    .range(offset, offset + perPage - 1)

  const { data, error, count } = await dbQuery

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  // Fetch translations for current locale
  const locale = (event.headers.get('accept-language') || 'rw').split(',')[0]?.split('-')[0] || 'rw'

  const articles = await Promise.all(
    (data || []).map(async (article: any) => {
      const { data: translations } = await supabase
        .from('article_translations')
        .select('*')
        .eq('article_id', article.id)

      const translation =
        (translations || []).find((t: any) => t.language_code === locale) ||
        (translations || []).find((t: any) => t.language_code === 'rw') ||
        (translations || [])[0]

      return {
        ...article,
        title: translation?.title || '',
        excerpt: translation?.excerpt || null,
        content: translation?.content || null,
        category: article.category
          ? { id: article.category.id, slug: article.category.slug, name: article.category.slug }
          : null,
        author: article.author
          ? { display_name: article.author.display_name, avatar_url: article.author.avatar_url }
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
