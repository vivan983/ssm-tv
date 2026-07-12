<template>
  <div class="cat-page">
    <!-- Breadcrumb -->
    <nav class="cat-breadcrumb">
      <NuxtLink :to="localePath('/')" class="cat-breadcrumb-link">
        {{ $t('nav.home') }}
      </NuxtLink>
      <span class="cat-breadcrumb-sep">/</span>
      <span class="cat-breadcrumb-current">{{ categoryDisplayName }}</span>
    </nav>

    <!-- Category header — unified editorial section-heading pattern -->
    <div class="cat-heading">
      <h1 class="cat-title">
        {{ categoryDisplayName }}
      </h1>
    </div>
    <p v-if="categoryDescription" class="cat-description">
      {{ categoryDescription }}
    </p>

    <!-- Articles grid — reuses shared ArticleGrid same as homepage -->
    <ArticleGrid
      :articles="articles"
      :loading="loading"
      :empty-message="$t('article.noArticles')"
    />

    <!-- Error state -->
    <BaseErrorState
      v-if="!loading && fetchError"
      :message="fetchError"
      @retry="refresh"
      class="mt-6"
    />

    <!-- Pagination — scoped to filtered category results -->
    <BasePagination
      v-if="!loading && totalPages > 1"
      :current-page="currentPage"
      :total-pages="totalPages"
      class="mt-10"
      @change="changePage"
    />
  </div>
</template>

<script setup lang="ts">
// =====================================================================
// CATEGORY ARCHIVE PAGE — /category/[slug]
// =====================================================================
// BUG FIX: Replaced onMounted + store-only fetch with useAsyncData.
//
// ROOT CAUSE: onMounted never executes during SSR, so the server always
// rendered the empty state. Client-side hydration showed "Nta nkuru
// zihari" briefly, and on slow connections it stayed forever.
//
// FIX: useAsyncData runs on BOTH server and client. The unique cache
// key tied to slug+page prevents cross-category data caching. The
// watch option triggers automatic re-fetch when navigating between
// categories or changing pages — no stale data.
// =====================================================================

import ArticleGrid from '~/components/article/ArticleGrid.vue'
import BasePagination from '~/components/ui/BasePagination.vue'
import BaseErrorState from '~/components/ui/BaseErrorState.vue'

const route = useRoute()
const localePath = useLocalePath()
const { t } = useI18n()

// ---- Reactive slug from URL — updates on client-side navigation between categories ---- //
const slug = computed(() => route.params.slug as string)

// ---- Pagination state ---- //
const currentPage = ref(1)

// ---- useAsyncData: SSR-compatible fetch with unique cache key per slug + page ---- //
// The key pattern "category-{slug}-page-{page}" guarantees that:
//   1. Each category's data lives in its own Nuxt cache bucket
//   2. Different pages of the same category don't collide
//   3. Navigating from /category/politiki to /category/ubuzima triggers
//      a fresh fetch because the key changes
// The watch: [slug, currentPage] option ensures the composable re-fetches
// whenever either ref changes — no onMounted or manual watchers needed.
const {
  data: categoryData,
  pending,
  error: fetchErrorRef,
  refresh,
} = useAsyncData(
  () => `category-${slug.value}-page-${currentPage.value}`,
  async () => {
    // Direct $fetch to the server API route that handles category
    // lookup + article filtering + translation enrichment
    const response = await $fetch(`/api/categories/${slug.value}`, {
      query: {
        page: currentPage.value,
        perPage: 12,
      },
    })

    return response as {
      data: { name?: string; description?: string; slug: string }
      articles: any[]
      total: number
      page: number
      totalPages: number
    }
  },
  {
    // Re-fetch whenever the slug or page changes — handles both
    // client-side category navigation and pagination clicks
    watch: [slug, currentPage],
  },
)

// ---- Derived reactive state from useAsyncData result ---- //
const articles = computed(() => (categoryData.value as any)?.articles || [])
const loading = computed(() => pending.value)
const fetchError = computed(() => (fetchErrorRef.value as any)?.statusMessage || (fetchErrorRef.value as any)?.message || null)
const totalPages = computed(() => (categoryData.value as any)?.totalPages || 1)
const categoryName = computed(() => (categoryData.value as any)?.data?.name || '')
const categoryDescription = computed(() => (categoryData.value as any)?.data?.description || '')

// Fallback display name: capitalize the slug when no translation available
const categoryDisplayName = computed(() =>
  categoryName.value || formatSlug(slug.value),
)

// ---- Slug formatting for fallback display ---- //
function formatSlug(s: string) {
  if (!s) return ''
  return s
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

// ---- Pagination handler — updates currentPage ref, triggers re-fetch via watch ---- //
function changePage(page: number) {
  currentPage.value = page
  // Scroll to top for smooth UX when navigating between pages
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// ---- SEO: dynamic head based on category metadata ---- //
useHead({
  title: () =>
    categoryName.value
      ? `${categoryName.value} - ${t('category.title')}`
      : t('category.title'),
  meta: [
    {
      name: 'description',
      content: () => categoryDescription.value || t('seo.home.description'),
    },
  ],
})

definePageMeta({
  layout: 'default',
})
</script>

<style scoped>
/* ---- Page container — matches homepage container-main (1280px) ---- */
.cat-page {
  max-width: 1280px;
  margin: 0 auto;
  padding: 40px 16px 64px 16px;
}

@media (min-width: 768px) {
  .cat-page {
    padding-left: 24px;
    padding-right: 24px;
  }
}

@media (min-width: 1024px) {
  .cat-page {
    padding-left: 32px;
    padding-right: 32px;
  }
}

/* ---- Breadcrumb ---- */
.cat-breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8125rem;
  color: #6b7280;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e7eb;
}

.cat-breadcrumb-link {
  color: #6b7280;
  text-decoration: none;
  transition: color 0.15s ease;
}

.cat-breadcrumb-link:hover {
  color: #16a34a;
}

.cat-breadcrumb-sep {
  color: #d1d5db;
}

.cat-breadcrumb-current {
  color: #141414;
  font-weight: 600;
}

/* ---- Category heading — unified editorial pattern ---- */
.cat-heading {
  margin-bottom: 24px;
  padding-top: 16px;
  padding-bottom: 14px;
  border-top: 3px solid #16a34a;
  border-bottom: 2px solid #141414;
}

.cat-title {
  font-size: 1.5rem;
  font-weight: 800;
  line-height: 1.2;
  color: #141414;
  margin: 0;
  letter-spacing: -0.012em;
}

@media (min-width: 768px) {
  .cat-title {
    font-size: 1.75rem;
  }
}

/* ---- Category description ---- */
.cat-description {
  font-size: 0.9375rem;
  line-height: 1.6;
  color: #545658;
  margin: -8px 0 28px 0;
  max-width: 650px;
}
</style>
