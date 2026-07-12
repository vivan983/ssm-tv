// Most-read articles endpoint — resilient fallback pattern.
// Tries useSupabaseAdmin (service role) first, falls back to
// useSupabaseServer (anon key) if service key is unavailable.
// Returns empty array on any error instead of throwing 500.
import { useSupabaseAdmin, useSupabaseServer } from '../../utils/supabase-admin'

export default defineEventHandler(async () => {
  // ------------------------------------------------------------------
  // 1. Try admin client (service role — bypasses RLS for profiles join)
  // ------------------------------------------------------------------
  const serviceKey = process.env.SUPABASE_SERVICE_KEY
  const supabase = serviceKey ? useSupabaseAdmin() : useSupabaseServer()

  try {
    // ------------------------------------------------------------------
    // 2. Query published articles ordered by view_count
    // ------------------------------------------------------------------
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .limit(5)

    if (error) {
      console.error('[most-read] Query error:', error.message)
      return { data: [] }
    }

    if (!data || data.length === 0) {
      return { data: [] }
    }

    // ------------------------------------------------------------------
    // 3. Fetch translations + category for each article individually
    //    (avoids join failures if profiles/categories tables have RLS)
    // ------------------------------------------------------------------
    const articles = await Promise.all(
      data.map(async (article: any) => {
        try {
          const [{ data: translations }, { data: categories }] = await Promise.all([
            supabase
              .from('article_translations')
              .select('*')
              .eq('article_id', article.id)
              .limit(1),
            supabase
              .from('categories')
              .select('id, slug')
              .eq('id', article.category_id)
              .limit(1),
          ])

          const translation = (translations || [])[0]
          const category = (categories || [])[0] || null

          return {
            id: article.id,
            slug: article.slug,
            title: translation?.title || '',
            excerpt: translation?.excerpt || null,
            featured_image: article.featured_image || null,
            published_at: article.published_at,
            view_count: article.view_count || 0,
            is_featured: article.is_featured || false,
            category: category ? { id: category.id, slug: category.slug } : null,
          }
        } catch {
          return null
        }
      })
    )

    // Filter out any failed fetches
    const valid = articles.filter(Boolean)

    return { data: valid }
  } catch (err: any) {
    console.error('[most-read] Unexpected error:', err?.message || err)
    return { data: [] }
  }
})
