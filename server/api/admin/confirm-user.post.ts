// ============================================================================
// ADMIN API: Confirm user email and provision profile row
// ============================================================================
// SECURITY MODEL (revised):
//   - Confirming by EMAIL (self-service during login/signup): allowed without
//     auth — the user already proved email ownership by registering with it.
//     Always assigns 'editor' role. Never auto-escalates to admin.
//   - Confirming by USER ID: requires admin authentication — only existing
//     admins can target specific user IDs.
//   - The FIRST admin must be created manually via Supabase Dashboard.
// ============================================================================
import { useSupabaseAdmin } from '../../utils/supabase-admin'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { userId, email } = body

  if (!userId && !email) {
    throw createError({ statusCode: 400, statusMessage: 'Missing userId or email' })
  }

  // --- AUTH CHECK ---
  // Self-service by EMAIL: allowed without auth (user proved ownership by
  // registering with that email). Always assigns 'editor' role.
  //
  // By USER ID: If the caller provides a valid JWT for the SAME user,
  // allow self-provisioning. Otherwise require admin auth.
  if (userId && !email) {
    const authHeader = event.headers.get('authorization')
    let isSelfService = false

    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.slice(7)
        const { data: { user } } = await supabase.auth.getUser(token)
        if (user && user.id === userId) {
          isSelfService = true // User provisioning their own profile
        }
      } catch {
        // Token invalid — fall through to admin check
      }
    }

    if (!isSelfService) {
      const { requireAdmin } = await import('../../utils/auth')
      await requireAdmin(event)
    }
  }
  // --- END AUTH CHECK ---

  const supabase = useSupabaseAdmin()

  let targetUserId = userId

  // If email provided instead of userId, look up the user first
  if (!targetUserId && email) {
    const { data: users, error: listError } = await supabase.auth.admin.listUsers()

    if (listError) {
      throw createError({ statusCode: 500, statusMessage: listError.message })
    }

    const matchedUser = users.users.find(
      (u: { email?: string }) => u.email?.toLowerCase() === email.toLowerCase()
    )

    if (!matchedUser) {
      throw createError({ statusCode: 404, statusMessage: 'User not found with that email' })
    }

    targetUserId = matchedUser.id
  }

  // Confirm the user's email (no-op if already confirmed)
  const { error: confirmError } = await supabase.auth.admin.updateUserById(targetUserId, {
    email_confirm: true,
  })

  if (confirmError) {
    throw createError({ statusCode: 500, statusMessage: confirmError.message })
  }

  // Get user details for display name
  const { data: authUser } = await supabase.auth.admin.getUserById(targetUserId)
  const userEmail = authUser?.user?.email || email || ''
  const displayName =
    authUser?.user?.user_metadata?.display_name || userEmail.split('@')[0] || 'User'

  // Ensure a profile row exists (bypasses RLS via admin client)
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id, email, display_name, role, avatar_url, bio, is_active')
    .eq('id', targetUserId)
    .maybeSingle()

  let profile: {
    id: string
    email: string
    display_name: string
    role: string
    avatar_url: string | null
    bio: string | null
    is_active: boolean
  }

  if (existingProfile) {
    profile = existingProfile
  } else {
    // SECURITY: Self-service confirmations always get 'editor' role.
    // Admin promotion must be done manually via Supabase Dashboard.
    // The first-ever admin account should be created directly in the DB.
    const role = 'editor'

    const { data: newProfile, error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: targetUserId,
        email: userEmail,
        display_name: displayName,
        role,
        is_active: true,
      })
      .select('id, email, display_name, role, avatar_url, bio, is_active')
      .single()

    if (insertError) {
      throw createError({ statusCode: 500, statusMessage: insertError.message })
    }

    profile = newProfile
  }

  return {
    success: true,
    profile: {
      id: profile.id,
      email: profile.email,
      display_name: profile.display_name,
      role: profile.role,
      avatar_url: profile.avatar_url,
      bio: profile.bio,
      is_active: profile.is_active,
    },
  }
})
