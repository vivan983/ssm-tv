<template>
  <div>
    <!-- Stats cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <!-- Total Articles -->
      <div class="card p-5">
        <p class="dash-stat-label">Ingingo zose</p>
        <p v-if="!statsLoading" class="dash-stat-value">{{ stats.totalArticles }}</p>
        <div v-else class="dash-stat-skeleton" />
      </div>

      <!-- Published -->
      <div class="card p-5">
        <p class="dash-stat-label">Zasohotse</p>
        <p v-if="!statsLoading" class="dash-stat-value dash-stat-value--green">{{ stats.publishedArticles }}</p>
        <div v-else class="dash-stat-skeleton" />
      </div>

      <!-- Total Views -->
      <div class="card p-5">
        <p class="dash-stat-label">Ababonye bose</p>
        <p v-if="!statsLoading" class="dash-stat-value dash-stat-value--blue">{{ formatNumber(stats.totalViews) }}</p>
        <div v-else class="dash-stat-skeleton" />
      </div>

      <!-- Unread Messages -->
      <div class="card p-5">
        <p class="dash-stat-label">Ubutumwa butarasomwa</p>
        <p v-if="!statsLoading" class="dash-stat-value" :class="stats.unreadMessages > 0 ? 'dash-stat-value--red' : ''">
          {{ stats.unreadMessages }}
        </p>
        <div v-else class="dash-stat-skeleton" />
      </div>
    </div>

    <!-- Quick actions -->
    <div class="flex gap-3 mb-8">
      <BaseButton @click="navigateTo('/admin/create')">
        + Andika Ingingo
      </BaseButton>
      <BaseButton variant="outline" @click="navigateTo('/admin/articles')">
        Ingingo
      </BaseButton>
    </div>

    <!-- Recent articles -->
    <div class="card">
      <div class="dash-table-header">
        <h2 class="dash-table-title">Ingingo ziheruka</h2>
      </div>

      <div class="overflow-x-auto">
        <table v-if="!recentLoading && recentArticles.length > 0" class="dash-table">
          <thead>
            <tr>
              <th>Umutwe</th>
              <th class="dash-th-hide-sm">Imiterere</th>
              <th class="dash-th-hide-md">Itariki</th>
              <th class="dash-th-right">Ababonye</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="article in recentArticles"
              :key="article.id"
              class="dash-tr"
            >
              <td>
                <NuxtLink :to="`/admin/edit/${article.id}`" class="dash-link">
                  {{ article.title || 'Nta mutwe' }}
                </NuxtLink>
              </td>
              <td class="dash-th-hide-sm">
                <span class="dash-badge" :class="article.is_published ? 'dash-badge--published' : 'dash-badge--draft'">
                  {{ article.is_published ? 'Zasohotse' : 'Umushinga' }}
                </span>
              </td>
              <td class="dash-th-hide-md dash-td-muted">
                {{ article.published_at ? formatDate(article.published_at) : '—' }}
              </td>
              <td class="dash-td-right dash-td-muted">
                {{ formatNumber(article.view_count) }}
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Loading skeletons -->
        <div v-else-if="recentLoading" class="dash-loading-rows">
          <div v-for="i in 5" :key="i" class="dash-skeleton-row">
            <div class="skeleton-pulse dash-skeleton-cell dash-skeleton-cell--lg" />
            <div class="skeleton-pulse dash-skeleton-cell dash-skeleton-cell--sm" />
            <div class="skeleton-pulse dash-skeleton-cell dash-skeleton-cell--md" />
            <div class="skeleton-pulse dash-skeleton-cell dash-skeleton-cell--xs" />
          </div>
        </div>

        <!-- Empty -->
        <div v-else class="dash-empty">
          Nta ngingo zihari
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Article } from '~/types/article'
import BaseButton from '~/components/ui/BaseButton.vue'

definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth'],
})

const statsLoading = ref(true)
const stats = reactive({
  totalArticles: 0,
  publishedArticles: 0,
  totalViews: 0,
  unreadMessages: 0,
})

const recentLoading = ref(true)
const recentArticles = ref<Article[]>([])

onMounted(async () => {
  // Real stats from dedicated admin endpoint
  try {
    // BUG FIX: useAdminFetch returns data directly (not wrapped in a ref like useFetch)
    const result = await useAdminFetch('/api/admin/stats')
    const s = (result as any)?.data
    if (s) {
      stats.totalArticles = s.totalArticles
      stats.publishedArticles = s.publishedArticles
      stats.totalViews = s.totalViews
      stats.unreadMessages = s.unreadMessages
    }
  } catch {} finally {
    statsLoading.value = false
  }

  // Recent articles — use admin endpoint to see drafts too
  try {
    // BUG FIX: Use admin endpoint (not public) so drafts appear in the dashboard
    const result = await useAdminFetch('/api/admin/articles?perPage=10')
    recentArticles.value = (result as any)?.data || []
  } catch {} finally {
    recentLoading.value = false
  }
})

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('rw-RW', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
}

function formatNumber(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K'
  return String(n)
}
</script>

<style scoped>
/* ---- Stat cards ---- */
.dash-stat-label {
  font-size: 0.8125rem;
  color: #6b7280;
  margin: 0 0 4px 0;
}

.dash-stat-value {
  font-size: 2rem;
  font-weight: 800;
  color: #141414;
  margin: 0;
  line-height: 1.2;
}

.dash-stat-value--green { color: #16a34a; }
.dash-stat-value--blue  { color: #2563eb; }
.dash-stat-value--red   { color: #dc2626; }

.dash-stat-skeleton {
  width: 60px;
  height: 34px;
  margin-top: 4px;
  border-radius: 4px;
}

/* ---- Table ---- */
.dash-table-header {
  padding: 14px 20px;
  border-bottom: 1px solid #e5e7eb;
}

.dash-table-title {
  font-size: 1rem;
  font-weight: 700;
  color: #141414;
  margin: 0;
}

.dash-table {
  width: 100%;
  font-size: 0.875rem;
  border-collapse: collapse;
}

.dash-table thead th {
  text-align: left;
  padding: 10px 20px;
  font-weight: 600;
  color: #6b7280;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
}

.dash-table tbody td {
  padding: 12px 20px;
  border-bottom: 1px solid #f3f4f6;
}

.dash-tr:hover {
  background: #f9fafb;
}

.dash-th-right, .dash-td-right {
  text-align: right;
}

.dash-td-muted {
  color: #6b7280;
}

.dash-th-hide-sm {
  display: none;
}
@media (min-width: 640px) {
  .dash-th-hide-sm { display: table-cell; }
}

.dash-th-hide-md {
  display: none;
}
@media (min-width: 768px) {
  .dash-th-hide-md { display: table-cell; }
}

/* ---- Link ---- */
.dash-link {
  color: #141414;
  font-weight: 600;
  text-decoration: none;
}
.dash-link:hover {
  color: #16a34a;
  text-decoration: underline;
}

/* ---- Badges ---- */
.dash-badge {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 2px 10px;
  border-radius: 9999px;
}

.dash-badge--published {
  background: #f0fdf4;
  color: #15803d;
}

.dash-badge--draft {
  background: #f3f4f6;
  color: #6b7280;
}

/* ---- Empty ---- */
.dash-empty {
  padding: 32px 20px;
  text-align: center;
  font-size: 0.875rem;
  color: #9ca3af;
}

/* ---- Loading rows ---- */
.dash-loading-rows {
  padding: 0;
}

.dash-skeleton-row {
  display: flex;
  gap: 20px;
  padding: 14px 20px;
  border-bottom: 1px solid #f3f4f6;
}

.dash-skeleton-cell {
  height: 14px;
  border-radius: 3px;
}

.dash-skeleton-cell--lg { flex: 2; }
.dash-skeleton-cell--md { flex: 1; }
.dash-skeleton-cell--sm { flex: 0.8; }
.dash-skeleton-cell--xs { flex: 0.4; }
</style>
