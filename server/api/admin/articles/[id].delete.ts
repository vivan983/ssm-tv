// =====================================================================
// ADMIN API: Delete article by ID (DELETE)
// =====================================================================
// BUG FIX #7a: Added Supabase auth session verification.
// Previously this endpoint had NO authentication — anyone could delete
// any article by sending a DELETE request. Now it verifies the user's
// JWT token with Supabase.
// =====================================================================
import { requireAuth } from '../../../utils/auth'
import { useSupabaseAdmin } from '../../../utils/supabase-admin'

export default defineEventHandler(async (event) => {
  // --- AUTH CHECK ---
  // BUG FIX: Authentication is now MANDATORY. Previously the else clause
  // was commented out, allowing unauthenticated requests to delete articles.
  await requireAuth(event)
  // --- END AUTH CHECK ---

  const id = getRouterParam(event, 'id')

  // BUG FIX #7c: Validate article ID before any database operations
  if (!id) {
    throw createError({ statusCode: 400, message: 'Article ID is required' })
  }

  const supabase = useSupabaseAdmin()

  // BUG FIX #7d: First, check if the article actually exists.
  // This prevents unnecessary translation cleanup attempts when
  // the article ID is syntactically valid but doesn't exist in the DB.
  // It also gives a clear 404 error instead of a generic 500.
  const { data: existingArticle, error: fetchError } = await supabase
    .from('articles')
    .select('id, slug')
    .eq('id', id)
    .maybeSingle()

  if (fetchError) {
    throw createError({ statusCode: 500, message: fetchError.message })
  }

  if (!existingArticle) {
    throw createError({ statusCode: 404, message: 'Article not found' })
  }

  // BUG FIX #7e: Delete translations first (child records).
  // Since article_translations has article_id as a foreign key,
  // we clean them up first. Supabase's FK cascade might handle this
  // (depending on your schema), but explicit cleanup is safer and
  // avoids orphaned records if cascading isn't configured.
  const { error: transDeleteError } = await supabase
    .from('article_translations')
    .delete()
    .eq('article_id', id)

  if (transDeleteError) {
    throw createError({
      statusCode: 500,
      message: `Failed to delete article translations: ${transDeleteError.message}`,
    })
  }

  // BUG FIX #7f: Delete the article itself.
  // The .eq('id', id) clause is Supabase's equivalent of a prepared
  // statement — it binds the id value as a parameter rather than
  // concatenating it into a raw SQL string. This prevents SQL injection.
  const { error } = await supabase.from('articles').delete().eq('id', id)

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  // BUG FIX #7g: Return success with a meaningful message and the
  // deleted article's slug so the frontend can use it in toast text.
  return {
    success: true,
    message: 'Article deleted successfully',
  }
})
