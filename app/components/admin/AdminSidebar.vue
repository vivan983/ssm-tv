<template>
  <aside class="admin-sidebar w-64 bg-neutral-900 text-white min-h-screen flex-shrink-0 flex flex-col">
    <!-- Logo -->
    <div class="px-5 py-5 border-b border-white/10">
      <NuxtLink to="/admin" class="flex items-center gap-3">
        <img src="/logo.png" alt="SSM TV" class="h-7 w-auto brightness-0 invert" />
        <span class="text-xs text-neutral-400 uppercase tracking-wider font-semibold">CMS</span>
      </NuxtLink>
    </div>

    <!-- Nav -->
    <nav class="flex-1 px-3 py-4 space-y-1">
      <NuxtLink
        v-for="item in menuItems"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors"
        :class="isActive(item.to) ? 'bg-green-600 text-white font-medium' : 'text-neutral-300 hover:bg-white/10 hover:text-white'"
      >
        <svg class="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" :d="item.icon" />
        </svg>
        <span>{{ item.label }}</span>
      </NuxtLink>
    </nav>

    <!-- View Site -->
    <div class="px-3 py-3 border-t border-white/10">
      <a
        href="/"
        target="_blank"
        rel="noopener"
        class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-neutral-400 hover:bg-white/10 hover:text-white transition-colors w-full"
      >
        <svg class="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
        <span>{{ $t('admin.viewSite') }}</span>
      </a>
    </div>

    <!-- Logout -->
    <div class="px-3 py-3 border-t border-white/10">
      <button
        class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-neutral-400 hover:bg-red-600/20 hover:text-red-300 transition-colors w-full"
        @click="handleLogout"
      >
        <svg class="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span>{{ $t('admin.logout') }}</span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
const { t } = useI18n()
const route = useRoute()
const authStore = useAuthStore()
const router = useRouter()

const menuItems = computed(() => [
  { to: '/admin', label: t('admin.dashboard'), icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { to: '/admin/articles', label: t('admin.articles'), icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' },
  { to: '/admin/categories', label: t('admin.categories'), icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' },
  { to: '/admin/messages', label: t('admin.messages'), icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  { to: '/admin/ads', label: t('admin.ads'), icon: 'M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z' },
])

function isActive(path: string) {
  return route.path === path || (path !== '/admin' && route.path.startsWith(path))
}

async function handleLogout() {
  await authStore.logout()
  router.push('/admin/login')
}
</script>
