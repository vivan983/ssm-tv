// Category articles endpoint — resilient pattern.
// Fetches articles for a category without joining profiles (avoids RLS issues).
// Returns empty articles array on any error instead of throwing 500.
import { useSupabaseAdmin } from '../../utils/supabase-admin'

export default defineEventHandler(async (event) => {
  const rawSlug = getRouterParam(event, 'slug')
  const query = getQuery(event)
  const page = parseInt(query.page as string) || 1
  const perPage = Math.min(parseInt(query.perPage as string) || 12, 50)

  if (!rawSlug) {
    throw createError({ statusCode: 400, statusMessage: 'Slug is required' })
  }

  const supabase = useSupabaseAdmin()

  try {
    // Look up category by slug (case-insensitive)
    const { data: category, error: catError } = await supabase
      .from('categories')
      .select(`*, translations:category_translations(*)`)
      .ilike('slug', rawSlug)
      .maybeSingle()

    if (catError) {
      console.error('[category/slug] Category lookup error:', catError.message)
      return {
        data: { name: rawSlug, description: null, slug: rawSlug },
        articles: [],
        total: 0,
        page,
        totalPages: 0,
      }
    }

    if (!category) {
      return {
        data: { name: rawSlug, description: null, slug: rawSlug },
        articles: [],
        total: 0,
        page,
        totalPages: 0,
      }
    }

    const offset = (page - 1) * perPage

    // Fetch articles WITHOUT joining profiles (avoids RLS failures)
    const { data: articles, error, count } = await supabase
      .from('articles')
      .select('*', { count: 'exact' })
      .eq('category_id', category.id)
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .range(offset, offset + perPage - 1)

    if (error) {
      console.error('[category/slug] Articles query error:', error.message)
      return {
        data: { name: rawSlug, description: null, slug: rawSlug },
        articles: [],
        total: 0,
        page,
        totalPages: 0,
      }
    }

    // Attach translations to each article
    const articlesWithTranslations = await Promise.all(
      (articles || []).map(async (article: any) => {
        try {
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
          }
        } catch {
          return { ...article, title: '', excerpt: null }
        }
      })
    )

    const rw = (category.translations || []).find((t: any) => t.language_code === 'rw')

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
  } catch (err: any) {
    console.error('[category/slug] Unexpected error:', err?.message || err)
    return {
      data: { name: rawSlug, description: null, slug: rawSlug },
      articles: [],
      total: 0,
      page,
      totalPages: 0,
    }
  }
})
