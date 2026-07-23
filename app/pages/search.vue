<!-- =====================================================================
     PROFESSIONAL NEWSROOM SEARCH RESULTS PAGE
     Features:
       - Content type filters: All | Articles | Videos
       - Sort: Relevance | Newest | Oldest
       - Keyword highlighting in titles and excerpts
       - Result stats with search duration
       - Video results from YouTube API
       - Proper empty/loading/error states per tab
       - Breadcrumb navigation
       - Accessible keyboard navigation
     ===================================================================== -->
<template>
  <div class="search-page">
    <!-- ================================================================ -->
    <!-- BREADCRUMB                                                        -->
    <!-- ================================================================ -->
    <nav class="search-breadcrumb" aria-label="Breadcrumb">
      <NuxtLink :to="localePath('/')" class="search-breadcrumb-link">
        {{ $t('nav.home') }}
      </NuxtLink>
      <svg class="search-breadcrumb-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
      </svg>
      <span class="search-breadcrumb-current">{{ $t('search.title') }}</span>
      <template v-if="searchedQuery">
        <svg class="search-breadcrumb-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <span class="search-breadcrumb-query">"{{ searchedQuery }}"</span>
      </template>
    </nav>

    <!-- ================================================================ -->
    <!-- SEARCH HEADER: form + stats                                       -->
    <!-- ================================================================ -->
    <div class="search-header">
      <!-- Search form -->
      <form @submit.prevent="doSearch" class="search-form">
        <div class="search-input-row">
          <svg
            class="search-input-icon"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref="searchInputEl"
            v-model="query"
            type="text"
            :placeholder="$t('search.placeholder')"
            class="search-input"
            autocomplete="off"
            @keydown.escape="query = ''"
          />
          <BaseButton type="submit" :loading="articleLoading">
            {{ $t('nav.search') }}
          </BaseButton>
        </div>
      </form>

      <!-- Search stats -->
      <p v-if="searched" class="search-stats">
        <template v-if="totalVisibleResults > 0">
          <span class="search-stats-count">{{ totalVisibleResults }}</span>
          {{ $t('search.foundFor') }} <strong>"{{ searchedQuery }}"</strong>
          <span v-if="searchDurationMs > 0" class="search-stats-time">
            ({{ searchDurationMs }}ms)
          </span>
        </template>
        <template v-else-if="!articleLoading && !videoLoading">
          {{ $t('search.noResultsFor') || 'Nta bisubizo byabonetse kuri' }} <strong>"{{ searchedQuery }}"</strong>
        </template>
      </p>
    </div>

    <!-- ================================================================ -->
    <!-- FILTER + SORT BAR                                                 -->
    <!-- ================================================================ -->
    <div v-if="searched" class="search-toolbar">
      <!-- Content type tabs -->
      <div class="search-tabs" role="tablist" aria-label="Content type filter">
        <button
          v-for="tab in filterTabs"
          :key="tab.key"
          role="tab"
          :aria-selected="activeTab === tab.key"
          class="search-tab"
          :class="{ 'search-tab--active': activeTab === tab.key }"
          @click="switchTab(tab.key)"
        >
          {{ tab.label }}
          <span v-if="tabCounts[tab.key] !== undefined" class="search-tab-count">
            {{ tabCounts[tab.key] }}
          </span>
        </button>
      </div>

      <!-- Sort dropdown -->
      <div class="search-sort">
        <label :for="sortSelectId" class="search-sort-label">{{ $t('search.sort') || 'Itondekanya:' }}</label>
        <select
          :id="sortSelectId"
          v-model="sortOrder"
          class="search-sort-select"
          @change="applySort"
        >
          <option value="relevance">{{ $t('search.sortRelevance') || 'Ukurikije ibisobanuro' }}</option>
          <option value="newest">{{ $t('search.sortNewest') || 'Ibishya' }}</option>
          <option value="oldest">{{ $t('search.sortOldest') || 'Ibishaje' }}</option>
        </select>
      </div>
    </div>

    <!-- ================================================================ -->
    <!-- RESULTS AREA                                                      -->
    <!-- ================================================================ -->
    <div v-if="searched" class="search-results-area">
      <!-- ================================================================ -->
      <!-- ARTICLE RESULTS TAB                                               -->
      <!-- ================================================================ -->
      <div v-if="activeTab === 'articles' || activeTab === 'all'" class="search-results-section">
        <!-- Section label -->
        <h2 v-if="activeTab === 'all' && articleResults.length > 0" class="search-section-label">
          {{ $t('search.articles') || 'Ingingo' }}
          <span class="search-section-count">{{ articleResults.length }}</span>
        </h2>

        <!-- Loading skeleton -->
        <div v-if="articleLoading" class="search-results-grid">
          <div v-for="n in 6" :key="n" class="search-result-skeleton">
            <div class="search-result-skeleton-img skeleton-pulse" />
            <div class="search-result-skeleton-body">
              <div class="skeleton-pulse search-result-skeleton-cat" />
              <div class="skeleton-pulse search-result-skeleton-title" />
              <div class="skeleton-pulse search-result-skeleton-excerpt" />
              <div class="skeleton-pulse search-result-skeleton-meta" />
            </div>
          </div>
        </div>

        <!-- Article error -->
        <BaseErrorState
          v-else-if="articleError"
          :message="articleError"
          @retry="doSearch"
          class="py-12"
        />

        <!-- Article results -->
        <div v-else-if="articleResults.length > 0" class="search-results-grid">
          <article
            v-for="item in sortedArticleResults"
            :key="item.id"
            class="search-result-card group"
          >
            <!-- Thumbnail -->
            <NuxtLink
              :to="localePath(`/article/${item.slug}`)"
              class="search-result-img-wrap"
              :aria-label="item.title"
            >
              <img
                v-if="item.featured_image"
                :src="item.featured_image"
                :alt="item.featured_image_alt || item.title"
                class="search-result-img"
                loading="lazy"
              />
              <div v-else class="search-result-img-placeholder">
                <svg class="h-8 w-8 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
            </NuxtLink>

            <!-- Content -->
            <div class="search-result-body">
              <!-- Category -->
              <NuxtLink
                v-if="item.category"
                :to="localePath(`/category/${item.category.slug}`)"
                class="search-result-category"
              >
                {{ item.category.name }}
              </NuxtLink>

              <!-- Title with keyword highlighting -->
              <h3 class="search-result-title">
                <NuxtLink :to="localePath(`/article/${item.slug}`)">
                  <span v-html="highlightMatches(item.title)" />
                </NuxtLink>
              </h3>

              <!-- Excerpt with keyword highlighting -->
              <p v-if="item.excerpt" class="search-result-excerpt">
                <span v-html="highlightMatches(item.excerpt)" />
              </p>

              <!-- Meta row -->
              <div class="search-result-meta">
                <time v-if="item.published_at" :datetime="item.published_at">
                  {{ formatDate(item.published_at) }}
                </time>
                <span v-if="item.author" class="search-result-author">
                  {{ $t('article.by') }} {{ item.author.display_name }}
                </span>
                <span v-if="item.view_count > 0" class="search-result-views">
                  {{ formatViewCount(item.view_count) }} {{ $t('article.views') }}
                </span>
              </div>
            </div>
          </article>
        </div>

        <!-- Article empty state (only show if articles tab is active or "all" tab with no videos either) -->
        <div
          v-if="!articleLoading && !articleError && articleResults.length === 0 && activeTab === 'articles'"
          class="search-empty"
        >
          <div class="search-empty-icon">
            <svg class="h-10 w-10 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 class="search-empty-title">{{ $t('search.noArticlesFound') || 'Nta ngingo zabonetse' }}</h3>
          <p class="search-empty-hint">{{ $t('search.tryDifferent') || 'Gerageza ijambo rindi.' }}</p>
        </div>
      </div>

      <!-- ================================================================ -->
      <!-- VIDEO RESULTS TAB                                                 -->
      <!-- ================================================================ -->
      <div v-if="activeTab === 'videos' || activeTab === 'all'" class="search-results-section">
        <!-- Section label -->
        <h2 v-if="activeTab === 'all' && videoResults.length > 0 && !videoLoading" class="search-section-label">
          {{ $t('search.videos') || 'Amashusho (SSM TV)' }}
          <span class="search-section-count">{{ videoResults.length }}</span>
        </h2>

        <!-- Video loading skeleton -->
        <div v-if="videoLoading" class="search-results-grid">
          <div v-for="n in 3" :key="n" class="search-result-skeleton">
            <div class="search-result-skeleton-img skeleton-pulse" />
            <div class="search-result-skeleton-body">
              <div class="skeleton-pulse search-result-skeleton-cat" />
              <div class="skeleton-pulse search-result-skeleton-title" />
              <div class="skeleton-pulse search-result-skeleton-meta" />
            </div>
          </div>
        </div>

        <!-- Video error (non-fatal — show inline) -->
        <p v-if="videoError" class="search-video-error">{{ videoError }}</p>

        <!-- Video results -->
        <div v-if="videoResults.length > 0 && !videoLoading" class="search-results-grid">
          <article
            v-for="v in videoResults"
            :key="v.videoId"
            class="search-result-card group"
          >
            <!-- Thumbnail with play overlay -->
            <NuxtLink
              :to="localePath(`/ssm-tv/video/${v.videoId}`)"
              class="search-result-img-wrap"
              :aria-label="v.title"
            >
              <img
                :src="v.thumbnailUrl"
                :alt="v.title"
                class="search-result-img"
                loading="lazy"
              />
              <div class="search-result-play">
                <svg class="h-8 w-8 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </NuxtLink>

            <!-- Content -->
            <div class="search-result-body">
              <span class="search-result-category search-result-category--video">
                SSM TV
              </span>

              <h3 class="search-result-title">
                <NuxtLink :to="localePath(`/ssm-tv/video/${v.videoId}`)">
                  <span v-html="highlightMatches(v.title)" />
                </NuxtLink>
              </h3>

              <p v-if="v.description" class="search-result-excerpt">
                <span v-html="highlightMatches(v.description.substring(0, 160))" />
              </p>

              <div class="search-result-meta">
                <time v-if="v.publishedAt" :datetime="v.publishedAt">
                  {{ formatDate(v.publishedAt) }}
                </time>
                <span>{{ v.channelTitle }}</span>
              </div>
            </div>
          </article>
        </div>

        <!-- Video empty state -->
        <div
          v-if="!videoLoading && !videoError && videoResults.length === 0 && activeTab === 'videos'"
          class="search-empty"
        >
          <div class="search-empty-icon">
            <svg class="h-10 w-10 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 class="search-empty-title">{{ $t('search.noVideosFound') || 'Nta mashusho yabonetse' }}</h3>
          <p class="search-empty-hint">{{ $t('search.tryDifferent') || 'Gerageza ijambo rindi.' }}</p>
        </div>
      </div>

      <!-- ================================================================ -->
      <!-- COMPLETE EMPTY — nothing in any tab                               -->
      <!-- ================================================================ -->
      <div
        v-if="!articleLoading && !videoLoading && !articleError && totalVisibleResults === 0 && searched"
        class="search-empty search-empty--full"
      >
        <div class="search-empty-icon">
          <svg class="h-12 w-12 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="search-empty-title">{{ $t('search.nothingFound') || 'Nta cyabonetse' }}</h3>
        <p class="search-empty-hint">
          {{ $t('search.emptySuggestions') || "Nta ngingo cyangwa amashusho bihuye n'ijambo ryashakishijwe. Gerageza:" }}
        </p>
        <ul class="search-empty-tips">
          <li>{{ $t('search.tip1') || 'Kwandika ijambo mu buryo butandukanye' }}</li>
          <li>{{ $t('search.tip2') || 'Gukoresha ijambo rigufi' }}</li>
          <li>{{ $t('search.tip3') || 'Kureba niba ijambo ryanditse neza' }}</li>
        </ul>
      </div>
    </div>

    <!-- ================================================================ -->
    <!-- PRE-SEARCH EMPTY STATE (no query yet)                              -->
    <!-- ================================================================ -->
    <div v-if="!searched" class="search-presearch">
      <div class="search-presearch-icon">
        <svg class="h-14 w-14 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <h2 class="search-presearch-title">{{ $t('search.title') }}</h2>
      <p class="search-presearch-hint">{{ $t('search.helper') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Article } from '~/types/article'
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseErrorState from '~/components/ui/BaseErrorState.vue'

interface VideoResult {
  videoId: string
  title: string
  description: string
  thumbnailUrl: string
  publishedAt: string
  channelTitle: string
  url: string
}

const { t, locale } = useI18n()
const localePath = useLocalePath()
const route = useRoute()

// ====================================================================
// FORM STATE
// ====================================================================
const query = ref('')
const searchInputEl = ref<HTMLInputElement>()
const searched = ref(false)
const searchedQuery = ref('')

// ====================================================================
// FILTER + SORT STATE
// ====================================================================
const activeTab = ref<'all' | 'articles' | 'videos'>('all')
const sortOrder = ref<'relevance' | 'newest' | 'oldest'>('relevance')
const sortSelectId = `sort-${Math.random().toString(36).substring(2, 9)}`

const filterTabs = computed(() => [
  {
    key: 'all' as const,
    label: t('search.all') || 'Byose',
  },
  {
    key: 'articles' as const,
    label: t('search.articles') || 'Ingingo',
  },
  {
    key: 'videos' as const,
    label: t('search.videos') || 'Amashusho',
  },
])

// ====================================================================
// ARTICLE RESULTS
// ====================================================================
const articleResults = ref<Article[]>([])
const articleLoading = ref(false)
const articleError = ref('')

// ====================================================================
// VIDEO RESULTS
// ====================================================================
const videoResults = ref<VideoResult[]>([])
const videoLoading = ref(false)
const videoError = ref('')

// ====================================================================
// SEARCH TIMING
// ====================================================================
const searchStartTime = ref(0)
const searchDurationMs = ref(0)

// ====================================================================
// COMPUTED
// ====================================================================
const totalVisibleResults = computed(() => {
  let count = 0
  if (activeTab.value === 'all' || activeTab.value === 'articles') {
    count += articleResults.value.length
  }
  if (activeTab.value === 'all' || activeTab.value === 'videos') {
    count += videoResults.value.length
  }
  return count
})

const tabCounts = computed(() => ({
  all: articleResults.value.length + videoResults.value.length,
  articles: articleResults.value.length,
  videos: videoResults.value.length,
}))

// Sorted article results — relevance respects original API order;
// newest/oldest sort by published_at
const sortedArticleResults = computed(() => {
  const arr = [...articleResults.value]
  if (sortOrder.value === 'newest') {
    arr.sort((a, b) => new Date(b.published_at || 0).getTime() - new Date(a.published_at || 0).getTime())
  } else if (sortOrder.value === 'oldest') {
    arr.sort((a, b) => new Date(a.published_at || 0).getTime() - new Date(b.published_at || 0).getTime())
  }
  return arr
})

// ====================================================================
// SEARCH EXECUTION
// ====================================================================
async function doSearch() {
  const q = query.value.trim()
  if (!q) return

  searched.value = true
  searchedQuery.value = q
  searchStartTime.value = Date.now()
  searchDurationMs.value = 0

  // Fetch articles (always fetch for "all" and "articles" tabs)
  if (activeTab.value === 'all' || activeTab.value === 'articles') {
    articleLoading.value = true
    articleError.value = ''
  }

  // Fetch videos (for "all" and "videos" tabs)
  if (activeTab.value === 'all' || activeTab.value === 'videos') {
    videoLoading.value = true
    videoError.value = ''
  }

  const promises: Promise<void>[] = []

  // Articles fetch
  if (activeTab.value === 'all' || activeTab.value === 'articles') {
    promises.push(
      (async () => {
        try {
          const { data } = await useFetch('/api/articles', {
            query: { search: q, perPage: 20 },
          })
          articleResults.value = (data.value as any)?.data || []
        } catch (e: any) {
          articleError.value = e?.message || 'Ntibyashobotse gushakisha ingingo.'
          articleResults.value = []
        } finally {
          articleLoading.value = false
        }
      })()
    )
  }

  // Videos fetch
  if (activeTab.value === 'all' || activeTab.value === 'videos') {
    promises.push(
      (async () => {
        try {
          const { data } = await useFetch('/api/youtube/videos', {
            query: { search: q, maxResults: 12 },
          })
          videoResults.value = (data.value as any)?.videos || []
        } catch (e: any) {
          videoError.value = e?.message || 'Ntibyashobotse gushakisha amashusho.'
          videoResults.value = []
        } finally {
          videoLoading.value = false
        }
      })()
    )
  }

  await Promise.all(promises)
  searchDurationMs.value = Date.now() - searchStartTime.value
}

function switchTab(tab: 'all' | 'articles' | 'videos') {
  activeTab.value = tab
  if (searchedQuery.value) {
    doSearch()
  }
}

function applySort() {
  // Sorted computed will react to sortOrder change automatically
}

// ====================================================================
// KEYWORD HIGHLIGHTING
// ====================================================================
function highlightMatches(text: string): string {
  if (!text || !searchedQuery.value) return escapeHtml(text)

  const escapedQuery = searchedQuery.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escapedQuery})`, 'gi')

  return escapeHtml(text).replace(
    regex,
    '<mark class="search-highlight">$1</mark>'
  )
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// ====================================================================
// FORMATTING HELPERS
// ====================================================================
function formatDate(date: string) {
  if (!date) return ''
  return new Date(date).toLocaleDateString(
    locale.value === 'rw' ? 'rw-RW' : locale.value === 'fr' ? 'fr-FR' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  )
}

function formatViewCount(count: number) {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
  return count.toString()
}

// ====================================================================
// LIFECYCLE — support ?q= parameter for shareable search URLs
// ====================================================================
onMounted(() => {
  const q = route.query.q as string
  if (q) {
    query.value = q
    nextTick(() => doSearch())
  }
})

// ====================================================================
// SEO
// ====================================================================
useHead({
  title: t('seo.search.title'),
  meta: [
    { name: 'description', content: t('seo.search.title') },
  ],
})

definePageMeta({
  layout: 'default',
})
</script>

<style scoped>
/* ===================================================================
   SEARCH PAGE — PROFESSIONAL NEWSROOM SEARCH RESULTS
   =================================================================== */

/* ---- Page container ---- */
.search-page {
  max-width: 1280px;
  margin: 0 auto;
  padding: 28px 16px 64px 16px;
}

@media (min-width: 768px) {
  .search-page {
    padding: 36px 24px 72px 24px;
  }
}

@media (min-width: 1024px) {
  .search-page {
    padding: 40px 32px 80px 32px;
  }
}

/* ===================================================================
   BREADCRUMB
   =================================================================== */
.search-breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8125rem;
  color: #6b7280;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.search-breadcrumb-link {
  color: #6b7280;
  text-decoration: none;
  transition: color 0.15s ease;
  font-weight: 500;
}

.search-breadcrumb-link:hover {
  color: #16a34a;
}

.search-breadcrumb-arrow {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  color: #d1d5db;
}

.search-breadcrumb-current {
  color: var(--text-heading);
  font-weight: 700;
}

.search-breadcrumb-query {
  color: #16a34a;
  font-weight: 600;
}

/* ===================================================================
   SEARCH HEADER
   =================================================================== */
.search-header {
  margin-bottom: 24px;
}

.search-form {
  margin-bottom: 14px;
}

.search-input-row {
  display: flex;
  gap: 10px;
  max-width: 640px;
  position: relative;
}

.search-input-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: #9ca3af;
  pointer-events: none;
  z-index: 1;
}

.search-input {
  flex: 1;
  padding: 13px 16px 13px 46px;
  border: 1.5px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  color: var(--text-heading);
  background: #fff;
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  font-family: inherit;
}

.search-input::placeholder {
  color: #9ca3af;
}

.search-input:focus {
  border-color: #16a34a;
  box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.1);
}

/* ===================================================================
   SEARCH STATS
   =================================================================== */
.search-stats {
  font-size: 0.9375rem;
  color: var(--text-muted);
  margin: 0;
  line-height: 1.5;
}

.search-stats-count {
  font-weight: 800;
  color: var(--text-heading);
}

.search-stats-time {
  color: #9ca3af;
  font-size: 0.8125rem;
  margin-left: 4px;
}

/* ===================================================================
   FILTER + SORT TOOLBAR
   =================================================================== */
.search-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  padding-bottom: 20px;
  margin-bottom: 28px;
  border-bottom: 1px solid #e5e7eb;
}

/* ---- Content type tabs ---- */
.search-tabs {
  display: flex;
  gap: 2px;
  background: #f3f4f6;
  border-radius: 8px;
  padding: 3px;
}

.search-tab {
  padding: 7px 16px;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #6b7280;
  background: transparent;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.search-tab--active {
  background: #fff;
  color: var(--text-heading);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
}

.search-tab-count {
  font-size: 0.6875rem;
  font-weight: 700;
  padding: 1px 7px;
  border-radius: 9999px;
  background: #e5e7eb;
  color: #6b7280;
}

.search-tab--active .search-tab-count {
  background: #f0fdf4;
  color: #15803d;
}

/* ---- Sort dropdown ---- */
.search-sort {
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-sort-label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #6b7280;
  white-space: nowrap;
}

.search-sort-select {
  padding: 7px 32px 7px 12px;
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--text-heading);
  background: #fff;
  border: 1.5px solid #d1d5db;
  border-radius: 6px;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  outline: none;
  transition: border-color 0.15s ease;
}

.search-sort-select:focus {
  border-color: #16a34a;
  box-shadow: 0 0 0 2px rgba(22, 163, 74, 0.1);
}

/* ===================================================================
   RESULTS AREA
   =================================================================== */
.search-results-area {
  min-height: 200px;
}

/* ---- Section label (used in "All" tab) ---- */
.search-section-label {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--text-heading);
  margin: 0 0 16px 0;
  padding-bottom: 10px;
  border-bottom: 2px solid #141414;
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-section-count {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 600;
}

.search-results-section + .search-results-section {
  margin-top: 36px;
}

/* ===================================================================
   RESULT CARDS
   =================================================================== */
.search-results-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

@media (min-width: 640px) {
  .search-results-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .search-results-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.search-result-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #f3f4f6;
  transition: box-shadow 0.2s ease;
}

.search-result-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

/* ---- Image area ---- */
.search-result-img-wrap {
  display: block;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: #f5f5f5;
  position: relative;
}

.search-result-img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.search-result-card:hover .search-result-img {
  transform: scale(1.03);
}

.search-result-img-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
}

/* ---- Play button overlay (video cards) ---- */
.search-result-play {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.25);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.search-result-card:hover .search-result-play {
  opacity: 1;
}

/* ---- Card body ---- */
.search-result-body {
  padding: 16px;
}

/* ---- Category label ---- */
.search-result-category {
  display: inline-block;
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #16a34a;
  text-decoration: none;
  margin-bottom: 6px;
}

.search-result-category:hover {
  text-decoration: underline;
  text-underline-offset: 3px;
}

.search-result-category--video {
  color: #dc2626;
}

/* ---- Title ---- */
.search-result-title {
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.35;
  color: var(--text-heading);
  margin: 0 0 6px 0;
}

.search-result-title a {
  color: inherit;
  text-decoration: none;
}

.search-result-title a:hover {
  color: #16a34a;
  text-decoration: underline;
  text-underline-offset: 3px;
  text-decoration-thickness: 1.5px;
}

/* ---- Excerpt ---- */
.search-result-excerpt {
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--text-muted);
  margin: 0 0 10px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ---- Meta row ---- */
.search-result-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 0.75rem;
  color: #6b7280;
}

.search-result-author {
  font-weight: 600;
  color: var(--text-muted);
}

.search-result-views {
  color: #9ca3af;
}

/* ===================================================================
   KEYWORD HIGHLIGHTING
   =================================================================== */
:deep(.search-highlight) {
  background: #fef08a;
  color: var(--text-heading);
  padding: 1px 2px;
  border-radius: 2px;
  font-weight: 700;
}

/* ===================================================================
   SKELETON LOADING
   =================================================================== */
.search-result-skeleton {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #f3f4f6;
}

.search-result-skeleton-img {
  aspect-ratio: 16 / 9;
}

.search-result-skeleton-body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.search-result-skeleton-cat {
  width: 30%;
  height: 10px;
  border-radius: 2px;
}

.search-result-skeleton-title {
  width: 90%;
  height: 18px;
  border-radius: 2px;
}

.search-result-skeleton-excerpt {
  width: 100%;
  height: 14px;
  border-radius: 2px;
}

.search-result-skeleton-meta {
  width: 40%;
  height: 10px;
  border-radius: 2px;
}

/* ===================================================================
   EMPTY STATES
   =================================================================== */
/* ---- No results (per-tab) ---- */
.search-empty {
  text-align: center;
  padding: 40px 20px;
}

.search-empty--full {
  padding: 60px 20px;
}

.search-empty-icon {
  margin-bottom: 16px;
}

.search-empty-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #374151;
  margin: 0 0 6px 0;
}

.search-empty-hint {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 auto;
  max-width: 400px;
  line-height: 1.5;
}

.search-empty-tips {
  margin: 16px auto 0 auto;
  max-width: 360px;
  text-align: left;
  list-style: disc;
  padding-left: 20px;
  font-size: 0.8125rem;
  color: #6b7280;
  line-height: 1.7;
}

/* ===================================================================
   PRE-SEARCH (no query yet)
   =================================================================== */
.search-presearch {
  text-align: center;
  padding: 64px 20px 40px;
}

.search-presearch-icon {
  margin-bottom: 20px;
}

.search-presearch-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-heading);
  margin: 0 0 8px 0;
}

.search-presearch-hint {
  font-size: 0.9375rem;
  color: #6b7280;
  margin: 0;
}

/* ===================================================================
   VIDEO ERROR (non-fatal inline notice)
   =================================================================== */
.search-video-error {
  font-size: 0.8125rem;
  color: #9ca3af;
  padding: 12px;
  text-align: center;
}
</style>
