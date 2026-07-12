<!-- =====================================================================
     MOST READ LIST — Birasomwa Cyane
     Dynamic editorial section showing the most-viewed published articles.
     - Top 3 stories get numbered rank badges (gold/silver/bronze)
     - Thumbnail, headline, category, and date for each article
     - Auto-updates via the articles store
     - Proper loading, error, and empty states
     ===================================================================== -->
<template>
  <div>
    <!-- ================================================================ -->
    <!-- LOADING                                                           -->
    <!-- ================================================================ -->
    <div v-if="loading" class="mostread-loading">
      <div v-for="i in limit" :key="i" class="mostread-skeleton-row">
        <BaseSkeleton variant="text" width="28px" height="28px" class="rounded-full flex-shrink-0" />
        <BaseSkeleton variant="image" width="64px" height="48px" class="rounded flex-shrink-0" />
        <div class="flex-1 space-y-1.5">
          <BaseSkeleton variant="text" />
          <BaseSkeleton variant="text" width="50%" />
        </div>
      </div>
    </div>

    <!-- ================================================================ -->
    <!-- ERROR                                                             -->
    <!-- ================================================================ -->
    <div v-else-if="error" class="mostread-error">
      <p class="text-xs text-red-500">{{ error }}</p>
      <button class="text-xs text-green-600 hover:text-green-700 font-semibold mt-1" @click="refresh">
        Ongera ugerageze
      </button>
    </div>

    <!-- ================================================================ -->
    <!-- EMPTY                                                             -->
    <!-- ================================================================ -->
    <div v-else-if="articles.length === 0" class="mostread-empty">
      <svg class="mostread-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
      </svg>
      <p class="mostread-empty-text">Nta nkuru zagaragaye</p>
      <p class="mostread-empty-hint">Inkuru zizagaragara hano nizamara gusohoka</p>
    </div>

    <!-- ================================================================ -->
    <!-- LOADED — Ranked article list                                      -->
    <!-- ================================================================ -->
    <ol v-else class="mostread-list">
      <li
        v-for="(article, index) in articles"
        :key="article.id"
        class="mostread-item group"
      >
        <NuxtLink
          :to="localePath(`/article/${article.slug}`)"
          class="mostread-link"
        >
          <!-- Rank number -->
          <span class="mostread-rank" :class="rankClass(index)">
            {{ index + 1 }}
          </span>

          <!-- Thumbnail -->
          <div class="mostread-thumb">
            <img
              v-if="article.featured_image"
              :src="article.featured_image"
              :alt="article.title"
              class="mostread-thumb-img"
              loading="lazy"
            />
            <div v-else class="mostread-thumb-placeholder">
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
          </div>

          <!-- Text -->
          <div class="mostread-text">
            <h4 class="mostread-title">
              {{ article.title }}
            </h4>
            <div class="mostread-meta">
              <span
                v-if="article.category"
                class="mostread-category"
              >
                {{ article.category.name || article.category.slug }}
              </span>
              <span class="mostread-sep" v-if="article.category && article.published_at">&middot;</span>
              <time
                v-if="article.published_at"
                :datetime="article.published_at"
                class="mostread-date"
              >
                {{ formatDate(article.published_at) }}
              </time>
            </div>
          </div>
        </NuxtLink>
      </li>
    </ol>
  </div>
</template>

<script setup lang="ts">
import type { Article } from '~/types/article'
import BaseSkeleton from '~/components/ui/BaseSkeleton.vue'
import { useArticlesStore } from '~/stores/articles'

const props = withDefaults(
  defineProps<{ limit?: number }>(),
  { limit: 5 }
)

const localePath = useLocalePath()
const { locale } = useI18n()
const store = useArticlesStore()

const articles = computed(() => store.mostRead.slice(0, props.limit))
const loading = computed(() => store.mostReadLoading)
const error = computed(() => store.mostReadError)

function refresh() {
  store.fetchMostRead(props.limit)
}

onMounted(() => {
  if (store.mostRead.length === 0 && !store.mostReadLoading) {
    store.fetchMostRead(props.limit)
  }
})

// Rank styling: gold=1, silver=2, bronze=3, neutral=4+
function rankClass(index: number) {
  if (index === 0) return 'mostread-rank--gold'
  if (index === 1) return 'mostread-rank--silver'
  if (index === 2) return 'mostread-rank--bronze'
  return 'mostread-rank--plain'
}

function formatDate(date: string) {
  if (!date) return ''
  return new Date(date).toLocaleDateString(
    locale.value === 'rw' ? 'rw-RW' : locale.value === 'fr' ? 'fr-FR' : 'en-US',
    { month: 'short', day: 'numeric' }
  )
}
</script>

<style scoped>
/* ===================================================================
   MOST READ LIST — Editorial ranked article list
   =================================================================== */

/* ---- List ---- */
.mostread-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.mostread-item {
  border-bottom: 1px solid #f3f4f6;
}
.mostread-item:last-child {
  border-bottom: none;
}

.mostread-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  text-decoration: none;
  transition: padding-left 0.15s ease;
}
.mostread-link:hover {
  padding-left: 4px;
}

/* ---- Rank number ---- */
.mostread-rank {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8125rem;
  font-weight: 800;
  flex-shrink: 0;
  transition: transform 0.15s ease;
}
.mostread-link:hover .mostread-rank {
  transform: scale(1.1);
}

.mostread-rank--gold   { background: #F59E0B; color: #fff; }
.mostread-rank--silver { background: #9CA3AF; color: #fff; }
.mostread-rank--bronze { background: #D97706; color: #fff; }
.mostread-rank--plain  { background: #F3F4F6; color: #6B7280; }

/* ---- Thumbnail ---- */
.mostread-thumb {
  width: 64px;
  height: 48px;
  border-radius: 4px;
  overflow: hidden;
  flex-shrink: 0;
  background: #f3f4f6;
}
.mostread-thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}
.mostread-link:hover .mostread-thumb-img {
  transform: scale(1.05);
}
.mostread-thumb-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #d1d5db;
  background: linear-gradient(135deg, #f9fafb, #f3f4f6);
}

/* ---- Text ---- */
.mostread-text {
  flex: 1;
  min-width: 0;
}

.mostread-title {
  font-size: 0.8125rem;
  font-weight: 600;
  line-height: 1.35;
  color: #1f2937;
  margin: 0 0 4px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.mostread-link:hover .mostread-title {
  color: #16a34a;
}

/* ---- Meta ---- */
.mostread-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
  font-size: 0.6875rem;
}

.mostread-category {
  font-weight: 700;
  color: #16a34a;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.mostread-sep {
  color: #d1d5db;
}

.mostread-date {
  color: #9ca3af;
}

/* ===================================================================
   LOADING
   =================================================================== */
.mostread-loading {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 4px 0;
}
.mostread-skeleton-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* ===================================================================
   ERROR
   =================================================================== */
.mostread-error {
  text-align: center;
  padding: 12px 0;
}

/* ===================================================================
   EMPTY
   =================================================================== */
.mostread-empty {
  text-align: center;
  padding: 20px 0;
}
.mostread-empty-icon {
  width: 28px;
  height: 28px;
  color: #d1d5db;
  margin: 0 auto 8px auto;
}
.mostread-empty-text {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #9ca3af;
  margin: 0 0 2px 0;
}
.mostread-empty-hint {
  font-size: 0.6875rem;
  color: #d1d5db;
  margin: 0;
}
</style>
