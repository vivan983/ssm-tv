// =====================================================================
// COMPOSABLE: useAdminFetch — Authenticated API calls for admin routes
// =====================================================================
// BUG FIX #8a: Provides a wrapper around $fetch that automatically
// includes the Supabase session JWT token in the Authorization header.
//
// Usage: const data = await useAdminFetch('/api/admin/articles')
//        const result = await useAdminFetch('/api/admin/articles/123', { method: 'DELETE' })
//
// This allows server-side admin API endpoints to verify the user's
// identity and role before performing CRUD operations.
// =====================================================================

export async function useAdminFetch(url: string, options: RequestInit = {}) {
  // Try the auth store first — it holds the session from login/signup.
  // The store's session.access_token is the active JWT. Falling back to
  // supabase.auth.getSession() handles edge cases where the store hasn't
  // been initialized yet.
  let token: string | undefined

  try {
    const authStore = useAuthStore()
    token = authStore.session?.access_token
  } catch {
    // Auth store not available — fall through to direct Supabase call
  }

  if (!token) {
    const supabase = useSupabaseClient()
    const { data } = await supabase.auth.getSession()
    token = data.session?.access_token
  }

  const customHeaders = (options.headers as Record<string, string>) || {}
  const headers: Record<string, string> = { ...customHeaders }

  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData
  if (!isFormData && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json'
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  return $fetch(url, {
    ...options,
    headers,
  })
}
