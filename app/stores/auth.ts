import { defineStore } from 'pinia'
import type { User, Session } from '@supabase/supabase-js'

interface Profile {
  id: string
  email: string
  display_name: string
  avatar_url: string | null
  role: 'admin' | 'editor' | 'contributor'
  bio: string | null
  is_active: boolean
}

interface AuthState {
  user: User | null
  profile: Profile | null
  session: Session | null
  loading: boolean
  initialized: boolean
  loginError: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    profile: null,
    session: null,
    loading: false,
    initialized: false,
    loginError: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.session && !!state.profile,
    isAdmin: (state) => state.profile?.role === 'admin',
    isEditor: (state) => state.profile?.role === 'admin' || state.profile?.role === 'editor',
    userRole: (state) => state.profile?.role || null,
  },

  actions: {
    async initialize() {
      if (this.initialized) return
      this.loading = true

      try {
        const supabase = useSupabaseClient()
        const {
          data: { session },
        } = await supabase.auth.getSession()
        this.session = session
        this.user = session?.user || null

        if (this.user) {
          await this.fetchProfile()
        }
      } catch (e) {
        console.error('Auth init error:', e)
      } finally {
        this.initialized = true
        this.loading = false
      }
    },

    async fetchProfile() {
      if (!this.user) return
      try {
        const supabase = useSupabaseClient()
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', this.user.id)
          .single()
        if (data) {
          this.profile = data as Profile
        }
      } catch (e) {
        console.error('Profile fetch error:', e)
      }
    },

    /**
     * Call the server to confirm the user's email and ensure a profile row exists.
     * Uses the admin service key so it bypasses RLS.
     * Stores the returned profile directly on the store.
     */
    async confirmAndProvision(identifier: { userId: string } | { email: string }) {
      try {
        // Send the session token if available so the server can verify
        // self-service profile provisioning
        const headers: Record<string, string> = { 'Content-Type': 'application/json' }
        if (this.session?.access_token) {
          headers['Authorization'] = `Bearer ${this.session.access_token}`
        }
        const response = await fetch('/api/admin/confirm-user', {
          method: 'POST',
          headers,
          body: JSON.stringify(identifier),
        })

        if (!response.ok) {
          const body = await response.json().catch(() => ({}))
          return {
            success: false as const,
            error: body.statusMessage || body.message || `Server error (${response.status})`,
          }
        }

        const result = await response.json()
        if (result.profile) {
          this.profile = result.profile as Profile
        }
        return { success: true as const }
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'Network error — is the server running?'
        return { success: false as const, error: msg }
      }
    },

    async register(email: string, password: string, displayName: string) {
      this.loading = true
      this.loginError = null

      try {
        const supabase = useSupabaseClient()

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: displayName },
          },
        })

        if (error) {
          this.loginError = error.message
          return false
        }

        // If email confirmation is ON (no session), auto-confirm via server
        if (!data.session && data.user) {
          const confirm = await this.confirmAndProvision({ userId: data.user.id })
          if (!confirm.success) {
            this.loginError = confirm.error
            return false
          }

          // Now sign in
          const { data: signInData, error: signInError } =
            await supabase.auth.signInWithPassword({ email, password })

          if (signInError) {
            this.loginError = signInError.message
            return false
          }

          this.session = signInData.session
          this.user = signInData.user
          // Profile already set by confirmAndProvision above

          if (!this.isEditor) {
            this.loginError =
              'Account created but requires admin approval to access the panel.'
            await this.logout()
            return false
          }

          return true
        }

        // Email confirmation is OFF — already signed in
        if (data.session) {
          this.session = data.session
          this.user = data.user

          const provision = await this.confirmAndProvision({ userId: data.user.id })
          if (!provision.success) {
            this.loginError = provision.error
            return false
          }
          // Profile already set by confirmAndProvision

          if (!this.isEditor) {
            this.loginError =
              'Account created but requires admin approval to access the panel.'
            await this.logout()
            return false
          }

          return true
        }

        this.loginError = 'Account creation failed. Please try again.'
        return false
      } catch (e) {
        console.error('Register error:', e)
        this.loginError = 'An unexpected error occurred'
        return false
      } finally {
        this.loading = false
      }
    },

    async login(email: string, password: string) {
      this.loading = true
      this.loginError = null

      try {
        const supabase = useSupabaseClient()

        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        // If email not confirmed, confirm it and retry
        if (error && error.message.toLowerCase().includes('email not confirmed')) {
          const confirm = await this.confirmAndProvision({ email })
          if (!confirm.success) {
            this.loginError = confirm.error
            return false
          }

          // Retry login
          const { data: retryData, error: retryError } =
            await supabase.auth.signInWithPassword({ email, password })

          if (retryError) {
            this.loginError = retryError.message
            return false
          }

          this.session = retryData.session
          this.user = retryData.user
          // Profile already set by confirmAndProvision above

          if (!this.isEditor) {
            this.loginError =
              'Your account does not have editor access. Please contact an administrator.'
            await this.logout()
            return false
          }

          return true
        }

        // Other errors (wrong password, etc.)
        if (error) {
          this.loginError = error.message
          return false
        }

        // Login succeeded
        this.session = data.session
        this.user = data.user

        // Fetch the profile. If it fails (e.g. RLS), provision via server.
        await this.fetchProfile()

        if (!this.profile) {
          const provision = await this.confirmAndProvision({ userId: data.user.id })
          if (!provision.success) {
            this.loginError = provision.error
            return false
          }
          // Profile set by confirmAndProvision
        }

        if (!this.isEditor) {
          this.loginError =
            'Your account does not have editor access. Please contact an administrator.'
          await this.logout()
          return false
        }

        return true
      } catch (e) {
        console.error('Login error:', e)
        this.loginError = 'An unexpected error occurred'
        return false
      } finally {
        this.loading = false
      }
    },

    async resendConfirmation(email: string) {
      this.loading = true
      this.loginError = null

      try {
        const supabase = useSupabaseClient()
        const { error } = await supabase.auth.resend({
          type: 'signup',
          email,
        })

        if (error) {
          this.loginError = error.message
          return false
        }

        return true
      } catch (e) {
        this.loginError = 'An unexpected error occurred'
        return false
      } finally {
        this.loading = false
      }
    },

    async logout() {
      const supabase = useSupabaseClient()
      await supabase.auth.signOut()
      this.user = null
      this.profile = null
      this.session = null
      this.initialized = false
    },
  },
})
