import { useSupabaseAdmin } from '../../utils/supabase-admin'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const formData = await readMultipartFormData(event)
  const file = formData?.find((f) => f.name === 'file')

  if (!file) {
    throw createError({ statusCode: 400, message: 'No file uploaded' })
  }

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
  const isSvg = file.filename?.endsWith('.svg')
  if (!allowedTypes.includes(file.type || '') && !isSvg) {
    throw createError({ statusCode: 400, message: 'Invalid file type. Use JPG, PNG, WebP, or SVG.' })
  }

  // Validate file size (5MB)
  if (file.data.length > 5 * 1024 * 1024) {
    throw createError({ statusCode: 400, message: 'File too large. Max 5MB.' })
  }

  const ext = file.filename?.split('.').pop() || 'jpg'
  const uniqueName = `articles/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`

  const supabase = useSupabaseAdmin()

  // SVG files: Supabase Storage rejects image/svg+xml and octet-stream.
  // Send as image/png so the bucket accepts it. Browsers still render
  // SVGs correctly based on the .svg extension and file content.
  const uploadContentType = isSvg ? 'image/png' : (file.type || 'image/png')

  const { error } = await supabase.storage.from('article-images').upload(uniqueName, file.data, {
    contentType: uploadContentType,
    upsert: false,
  })

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  const { data: urlData } = supabase.storage.from('article-images').getPublicUrl(uniqueName)

  return {
    data: {
      url: urlData.publicUrl,
      path: uniqueName,
    },
  }
})
