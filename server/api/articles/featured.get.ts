// BUG FIX: Use admin client — profiles RLS blocks anon key from joining author info
import { useSupabaseAdmin } from '../../utils/supabase-admin'

export default defineEventHandler(async () => {
  const supabase = useSupabaseAdmin()

  const { data, error } = await supabase
    .from('articles')
    .select(`*, category:categories(id, slug), author:profiles(display_name, avatar_url)`)
    .eq('is_published', true)
    .eq('is_featured', true)
    .order('published_at', { ascending: false })
    .limit(1)
    .single()

  if (error && error.code !== 'PGRST116') {
    throw createError({ statusCode: 500, message: error.message })
  }

  if (!data) return { data: null }

  // Fetch translations
  const { data: translations } = await supabase
    .from('article_translations')
    .select('*')
    .eq('article_id', data.id)

  const translation = (translations || [])[0]

  return {
    data: {
      ...data,
      title: translation?.title || '',
      excerpt: translation?.excerpt || null,
      content: translation?.content || null,
      category: data.category
        ? { id: data.category.id, slug: data.category.slug, name: data.category.slug }
        : null,
      author: data.author
        ? { display_name: data.author.display_name, avatar_url: data.author.avatar_url }
        : null,
    },
  }
})
