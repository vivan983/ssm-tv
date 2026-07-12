import { useSupabaseServer } from '../../../utils/supabase-admin'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) return { tracked: false }

  const supabase = useSupabaseServer()

  const { data: current } = await supabase
    .from('advertisements')
    .select('impression_count')
    .eq('id', id)
    .single()

  await supabase
    .from('advertisements')
    .update({ impression_count: (current?.impression_count || 0) + 1 })
    .eq('id', id)

  return { tracked: true }
})
