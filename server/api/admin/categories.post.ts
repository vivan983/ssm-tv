import { requireAuth } from '../../utils/auth'
import { useSupabaseAdmin } from '../../utils/supabase-admin'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const body = await readBody(event)
  const supabase = useSupabaseAdmin()

  if (!body.slug || !body.translations?.length) {
    throw createError({ statusCode: 400, message: 'Slug and translations are required' })
  }

  const { data: category, error } = await supabase
    .from('categories')
    .insert({ slug: body.slug, is_active: true, display_order: body.display_order || 99 })
    .select()
    .single()

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  const { error: transError } = await supabase.from('category_translations').insert(
    body.translations.map((t: any) => ({
      category_id: category.id,
      language_code: t.language_code,
      name: t.name,
      description: t.description || null,
    }))
  )

  if (transError) {
    await supabase.from('categories').delete().eq('id', category.id)
    throw createError({ statusCode: 500, message: transError.message })
  }

  return { data: category }
})
