import { useSupabaseServer } from '../utils/supabase-admin'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // Basic validation
  if (!body.name || body.name.length < 2) {
    throw createError({ statusCode: 400, message: 'Name is required (min 2 characters)' })
  }
  if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    throw createError({ statusCode: 400, message: 'Valid email is required' })
  }
  if (!body.message || body.message.length < 10) {
    throw createError({ statusCode: 400, message: 'Message is required (min 10 characters)' })
  }

  const supabase = useSupabaseServer()

  const { error } = await supabase.from('contact_messages').insert({
    name: body.name,
    email: body.email,
    subject: body.subject || null,
    message: body.message,
  })

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return { success: true, message: 'Message sent successfully' }
})
