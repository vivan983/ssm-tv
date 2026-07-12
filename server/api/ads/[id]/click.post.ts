import { useSupabaseServer } from '../../../utils/supabase-admin'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) return { tracked: false }

  const supabase = useSupabaseServer()

  // Increment click_count via RPC or raw update
  const { error } = await supabase.rpc('increment_ad_click', { ad_id: id })

  if (error) {
    // Fallback: direct update
    const { data: current } = await supabase
      .from('advertisements')
      .select('click_count')
      .eq('id', id)
      .single()

    await supabase
      .from('advertisements')
      .update({ click_count: (current?.click_count || 0) + 1 })
      .eq('id', id)
  }

  return { tracked: true }
})
