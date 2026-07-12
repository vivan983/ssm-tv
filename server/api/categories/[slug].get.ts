// BUG FIX: Use useSupabaseAdmin() (service role) instead of useSupabaseServer()
// (anon key) because the profiles table RLS blocks the anon role from reading
// author profiles when joining. The admin client is safe — server-side only.
import { useSupabaseAdmin } from '../../utils/supabase-admin'

export default defineEventHandler(async (event) => {
  const rawSlug = getRouterParam(event, 'slug')
  const query = getQuery(event)
  const page = parseInt(query.page as string) || 1
  const perPage = Math.min(parseInt(query.perPage as string) || 12, 50)

  if (!rawSlug) {
    throw createError({ statusCode: 400, statusMessage: 'Slug is required' })
  }

  const dbSlug = rawSlug

  const supabase = useSupabaseAdmin()

  // BUG FIX: Use .ilike() instead of .eq() for case-insensitive slug matching.
  // Category slugs in the database are UPPERCASE (POLITIKI, UBUCURUZI, etc.)
  // but URL routes are lowercase (/category/politiki). PostgreSQL's eq() is
  // case-sensitive, so the lookup always failed and returned empty articles.
  const { data: category, error: catError } = await supabase
    .from('categories')
    .select(`*, translations:category_translations(*)`)
    .ilike('slug', dbSlug)
    .maybeSingle()

  // BUG FIX: Return empty articles instead of 404 when category doesn't exist.
  // This handles the case where seed data hasn't been run yet — the page
  // shows a professional empty state rather than an error.
  if (catError) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to look up category' })
  }

  if (!category) {
    return {
      data: { name: dbSlug, description: null, slug: dbSlug },
      articles: [],
      total: 0,
      page,
      totalPages: 0,
    }
  }

  const offset = (page - 1) * perPage

  const { data: articles, error, count } = await supabase
    .from('articles')
    .select(`*, author:profiles(display_name, avatar_url)`, { count: 'exact' })
    .eq('category_id', category.id)
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .range(offset, offset + perPage - 1)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch articles for this category' })
  }

  const rw = (category.translations || []).find((t: any) => t.language_code === 'rw')

  // Attach translations to each article
  const articlesWithTranslations = await Promise.all(
    (articles || []).map(async (article: any) => {
      const { data: trans } = await supabase
        .from('article_translations')
        .select('*')
        .eq('article_id', article.id)
        .limit(1)
      const t = (trans || [])[0]
      return {
        ...article,
        title: t?.title || '',
        excerpt: t?.excerpt || null,
        author: article.author
          ? { display_name: article.author.display_name, avatar_url: article.author.avatar_url }
          : null,
      }
    })
  )

  return {
    data: {
      ...category,
      name: rw?.name || category.slug,
      description: rw?.description || null,
    },
    articles: articlesWithTranslations,
    total: count || 0,
    page,
    totalPages: Math.ceil((count || 0) / perPage),
  }
})
