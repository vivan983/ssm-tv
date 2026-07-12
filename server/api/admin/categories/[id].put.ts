import { requireAuth } from '../../../utils/auth'
import { useSupabaseAdmin } from '../../../utils/supabase-admin'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!id) throw createError({ statusCode: 400, message: 'Category ID is required' })

  const supabase = useSupabaseAdmin()

  await supabase
    .from('categories')
    .update({ slug: body.slug, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (body.translations?.length) {
    await supabase.from('category_translations').delete().eq('category_id', id)
    await supabase.from('category_translations').insert(
      body.translations.map((t: any) => ({
        category_id: id,
        language_code: t.language_code,
        name: t.name,
        description: t.description || null,
      }))
    )
  }

  return { success: true }
})
