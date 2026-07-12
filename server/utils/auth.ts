// ============================================================================
// SSM TV — SHARED SERVER-SIDE AUTH UTILITY
// ============================================================================
// Provides requireAuth() and requireAdmin() guards for API endpoints.
// These must be called at the top of every /api/admin/* handler to ensure
// the caller is authenticated and has the required role.
//
// Auth methods (tried in order):
//   1. Authorization: Bearer <jwt> header (useAdminFetch / programmatic)
//   2. Supabase session cookie (browser-based useFetch / SSR)
//
// BUG FIX: Previously admin endpoints had ZERO server-side auth.
// Now all endpoints enforce authentication consistently, supporting
// both header-based and cookie-based JWT extraction.
// ============================================================================
import { useSupabaseAdmin } from './supabase-admin'

/** Extract a JWT from the request using multiple strategies.
 *  Returns the token string or null if nothing found. */
async function extractToken(event: any): Promise<string | null> {
  // Strategy 1: Authorization header (Bearer token)
  const authHeader = event.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7)
  }

  // Strategy 2: Supabase session cookie
  // The cookie name is sb-<project-ref>-auth-token (e.g. sb-lmmecjuybkfwxzzmfpnw-auth-token)
  const cookieHeader = event.headers.get('cookie') || ''
  const supabaseCookie = cookieHeader
    .split(';')
    .map((c: string) => c.trim())
    .find((c: string) => c.startsWith('sb-') && c.endsWith('-auth-token'))

  if (supabaseCookie) {
    const cookieValue = supabaseCookie.split('=')[1]
    if (cookieValue) {
      try {
        // Supabase stores the session as a base64-encoded JSON array: [access_token, refresh_token, ...]
        const decoded = Buffer.from(decodeURIComponent(cookieValue), 'base64').toString('utf-8')
        const parsed = JSON.parse(decoded)
        if (parsed[0] && typeof parsed[0] === 'string') {
          return parsed[0] // access_token is the first element
        }
      } catch {
        // Cookie malformed — fall through
      }
    }
  }

  return null
}

/** Validates the JWT token and returns the authenticated user + profile.
 *  Tries Authorization header first, then Supabase session cookie.
 *  Throws 401 if no valid token, 403 if user lacks editor/admin role. */
export async function requireAuth(event: any) {
  const token = await extractToken(event)

  if (!token) {
    throw createError({
      statusCode: 401,
      message: 'Authentication required. Please log in to continue.',
    })
  }

  const supabase = useSupabaseAdmin()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser(token)

  if (authError || !user) {
    throw createError({
      statusCode: 401,
      message: 'Invalid or expired authentication token.',
    })
  }

  // Verify the user has at least editor role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, display_name')
    .eq('id', user.id)
    .single()

  if (!profile || (profile.role !== 'admin' && profile.role !== 'editor')) {
    throw createError({
      statusCode: 403,
      message: 'Insufficient permissions. Editor or admin role required.',
    })
  }

  return { user, profile }
}

/** Same as requireAuth() but additionally requires the 'admin' role.
 *  Use this for sensitive operations like user management. */
export async function requireAdmin(event: any) {
  const { user, profile } = await requireAuth(event)

  if (profile.role !== 'admin') {
    throw createError({
      statusCode: 403,
      message: 'Admin permissions required for this operation.',
    })
  }

  return { user, profile }
}
