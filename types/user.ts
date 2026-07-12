export type UserRole = 'admin' | 'editor' | 'contributor'

export interface UserProfile {
  id: string
  email: string
  display_name: string
  avatar_url: string | null
  role: UserRole
  bio: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}
