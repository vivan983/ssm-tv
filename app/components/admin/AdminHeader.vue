<template>
  <header class="admin-header">
    <!-- Mobile toggle -->
    <button class="lg:hidden p-1.5 text-neutral-500 hover:text-neutral-700 rounded" @click="$emit('toggleSidebar')">
      <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>

    <!-- Page title -->
    <h1 class="admin-header-title">{{ pageTitle }}</h1>

    <div class="flex-1" />

    <!-- User -->
    <div class="admin-header-user">
      <span class="admin-header-name">{{ authStore.profile?.display_name }}</span>
      <span class="admin-header-role">{{ authStore.profile?.role }}</span>
    </div>
  </header>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const route = useRoute()
const { t } = useI18n()

defineEmits<{ toggleSidebar: [] }>()

const pageTitle = computed(() => {
  const path = route.path
  if (path === '/admin') return t('admin.dashboard')
  if (path.startsWith('/admin/articles')) return t('admin.articles')
  if (path.startsWith('/admin/create')) return t('admin.createArticle')
  if (path.startsWith('/admin/edit')) return t('admin.editArticle')
  if (path.startsWith('/admin/categories')) return t('admin.categories')
  if (path.startsWith('/admin/messages')) return t('admin.messages')
  return 'Admin'
})
</script>

<style scoped>
.admin-header {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 56px;
  padding: 0 16px;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
}

@media (min-width: 1024px) {
  .admin-header {
    padding: 0 24px;
  }
}

.admin-header-title {
  font-size: 1rem;
  font-weight: 700;
  color: #141414;
  margin: 0;
}

.admin-header-user {
  display: flex;
  align-items: center;
  gap: 10px;
}

.admin-header-name {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #374151;
  display: none;
}

@media (min-width: 640px) {
  .admin-header-name {
    display: inline;
  }
}

.admin-header-role {
  font-size: 0.6875rem;
  font-weight: 600;
  padding: 2px 10px;
  border-radius: 9999px;
  background: #f0fdf4;
  color: #15803d;
  text-transform: capitalize;
}
</style>
