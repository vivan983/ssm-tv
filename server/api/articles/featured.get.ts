// Featured articles endpoint — resilient pattern.
// Fetches featured article without joining profiles (avoids RLS issues).
// Returns { data: null } on any error instead of throwing 500.
import { useSupabaseAdmin } from '../../utils/supabase-admin'

export default defineEventHandler(async () => {
  let supabase
  try {
    supabase = useSupabaseAdmin()
  } catch {
    return { data: null }
  }

  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('is_published', true)
      .eq('is_featured', true)
      .order('published_at', { ascending: false })
      .limit(1)
      .single()

    // PGRST116 = no rows returned — not an error, just no featured article
    if (error && error.code !== 'PGRST116') {
      console.error('[featured] Query error:', error.message)
      return { data: null }
    }

    if (!data) return { data: null }

    // Fetch translations and category separately (no joins — avoids RLS failures)
    const [{ data: translations }, { data: categories }] = await Promise.all([
      supabase.from('article_translations').select('*').eq('article_id', data.id),
      supabase.from('categories').select('id, slug').eq('id', data.category_id).limit(1),
    ])

    const translation = (translations || [])[0]
    const category = (categories || [])[0] || null

    return {
      data: {
        id: data.id,
        slug: data.slug,
        title: translation?.title || '',
        excerpt: translation?.excerpt || null,
        content: translation?.content || null,
        featured_image: data.featured_image || null,
        is_video: data.is_video || false,
        youtube_url: data.youtube_url || null,
        published_at: data.published_at,
        view_count: data.view_count || 0,
        category: category ? { id: category.id, slug: category.slug } : null,
      },
    }
  } catch (err: any) {
    console.error('[featured] Unexpected error:', err?.message || err)
    return { data: null }
  }
})
