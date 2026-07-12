export default defineNuxtRouteMiddleware(async (to) => {
  // Only run for admin routes
  if (!to.path.startsWith('/admin')) return

  // Skip login page
  if (to.path === '/admin/login') return

  const authStore = useAuthStore()

  // Initialize auth if not yet done
  if (!authStore.initialized) {
    await authStore.initialize()
  }

  // Not authenticated — redirect to login
  if (!authStore.isAuthenticated) {
    return navigateTo('/admin/login')
  }

  // Not an editor or admin — redirect
  if (!authStore.isEditor) {
    return navigateTo('/')
  }
})
