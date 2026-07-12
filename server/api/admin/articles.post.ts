import { requireAuth } from '../../utils/auth'
import { useSupabaseAdmin } from '../../utils/supabase-admin'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const body = await readBody(event)
  const supabase = useSupabaseAdmin()

  // Validate
  if (!body.slug || body.slug.length < 3) {
    throw createError({ statusCode: 400, message: 'Slug is required (min 3 characters)' })
  }
  if (!body.translations || body.translations.length === 0) {
    throw createError({ statusCode: 400, message: 'At least one translation is required' })
  }

  // Create article
  const { data: article, error: articleError } = await supabase
    .from('articles')
    .insert({
      slug: body.slug,
      category_id: body.category_id || null,
      featured_image: body.featured_image || null,
      featured_image_alt: body.featured_image_alt || null,
      is_featured: body.is_featured || false,
      is_published: body.is_published || false,
      is_video: body.is_video || false,
      youtube_url: body.youtube_url || null,
      published_at: body.published_at || null,
      meta_title: body.meta_title || null,
      meta_description: body.meta_description || null,
      og_image: body.og_image || null,
    })
    .select()
    .single()

  if (articleError) {
    throw createError({ statusCode: 500, message: articleError.message })
  }

  // Create translations
  const translations = body.translations.map((t: any) => ({
    article_id: article.id,
    language_code: t.language_code,
    title: t.title,
    excerpt: t.excerpt || null,
    content: t.content || null,
  }))

  const { error: transError } = await supabase.from('article_translations').insert(translations)

  if (transError) {
    // Cleanup article if translations fail
    await supabase.from('articles').delete().eq('id', article.id)
    throw createError({ statusCode: 500, message: transError.message })
  }

  return { data: article }
})
