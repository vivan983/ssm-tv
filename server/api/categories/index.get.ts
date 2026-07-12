import { useSupabaseServer } from '../../utils/supabase-admin'

export default defineEventHandler(async () => {
  const supabase = useSupabaseServer()

  const { data: categories, error } = await supabase
    .from('categories')
    .select(`*, translations:category_translations(*)`)
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  if (error) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch categories' })
  }

  const items = (categories || []).map((cat: any) => {
    const rw = (cat.translations || []).find((t: any) => t.language_code === 'rw')
    return {
      ...cat,
      name: rw?.name || cat.slug,
      description: rw?.description || null,
      translations: cat.translations || [],
    }
  })

  return { data: items }
})
