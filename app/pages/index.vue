<template>
  <div class="bbc-home">
    <!-- DEBUG: Remove this line once articles render -->
    <div v-if="!articlesLoaded" class="text-center py-16 px-4" style="background:#f0fdf4;border:2px dashed #16a34a;margin:16px;border-radius:8px;">
      <p class="text-green-800 font-bold text-lg">SSM TV — Amakuru Araza (News Loading...)</p>
      <p class="text-green-600 text-sm mt-2">Ibaze niba ukibona iyi message, amakuru ntabwo yashoboye kwerekana.</p>
    </div>

    <HeroFeatured />

    <!-- AD: Homepage Banner -->
    <AdPlacement placement="homepage_banner" :limit="1" />

    <!-- SECTION 2: Secondary highlights (2-up) -->
    <section v-if="secondaryArticles.length > 0 || secondaryLoading" class="bbc-section">
      <div v-if="secondaryLoading" class="bbc-grid bbc-grid--2col">
        <div v-for="n in 2" :key="n" class="bbc-card-skeleton">
          <div class="bbc-card-skeleton-img skeleton-pulse" />
          <div class="bbc-card-skeleton-body">
            <div class="bbc-card-skeleton-category skeleton-pulse" />
            <div class="bbc-card-skeleton-title skeleton-pulse" />
            <div class="bbc-card-skeleton-meta skeleton-pulse" />
          </div>
        </div>
      </div>
      <div v-else class="bbc-grid bbc-grid--2col">
        <ArticleCard
          v-for="article in secondaryArticles"
          :key="article.id"
          :article="article"
        />
      </div>
    </section>

    <!-- SECTION 3: Paginated latest news — single "Amakuru Mashya" feed -->
    <section class="bbc-section">
      <div class="bbc-section-heading">
        <h2 class="bbc-section-title">{{ $t('home.latestNews') }}</h2>
      </div>
      <LatestNewsPaginated
        :articles="paginatedArticles"
        :loading="paginatedLoading"
        :current-page="currentPage"
        :total-pages="totalPages"
        @page-change="handlePageChange"
      />
    </section>

    <!-- SECTION 4: IMYIDAGADURO category -->
    <section v-if="entertainmentArticles.length > 0 || entertainmentLoading" class="bbc-section">
      <div class="bbc-section-heading">
        <h2 class="bbc-section-title">{{ $t('nav.imyidagaduro') }}</h2>
        <NuxtLink to="/category/imyidagaduro" class="bbc-section-more">
          {{ $t('home.viewAll') }} &rarr;
        </NuxtLink>
      </div>
      <div v-if="entertainmentLoading" class="bbc-grid">
        <div v-for="n in 3" :key="n" class="bbc-card-skeleton">
          <div class="bbc-card-skeleton-img skeleton-pulse" />
          <div class="bbc-card-skeleton-body">
            <div class="bbc-card-skeleton-title skeleton-pulse" />
            <div class="bbc-card-skeleton-meta skeleton-pulse" />
          </div>
        </div>
      </div>
      <div v-else class="bbc-grid">
        <ArticleCard
          v-for="article in entertainmentArticles"
          :key="article.id"
          :article="article"
        />
      </div>
    </section>

    <!-- SECTION 5: IMIKINO category -->
    <section v-if="sportArticles.length > 0 || sportLoading" class="bbc-section">
      <div class="bbc-section-heading">
        <h2 class="bbc-section-title">{{ $t('nav.imikino') }}</h2>
        <NuxtLink to="/category/imikino" class="bbc-section-more">
          {{ $t('home.viewAll') }} &rarr;
        </NuxtLink>
      </div>
      <div v-if="sportLoading" class="bbc-grid">
        <div v-for="n in 3" :key="n" class="bbc-card-skeleton">
          <div class="bbc-card-skeleton-img skeleton-pulse" />
          <div class="bbc-card-skeleton-body">
            <div class="bbc-card-skeleton-title skeleton-pulse" />
            <div class="bbc-card-skeleton-meta skeleton-pulse" />
          </div>
        </div>
      </div>
      <div v-else class="bbc-grid">
        <ArticleCard
          v-for="article in sportArticles"
          :key="article.id"
          :article="article"
        />
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import type { Article } from '~/types/article'
import HeroFeatured from '~/components/home/HeroFeatured.vue'
import ArticleCard from '~/components/article/ArticleCard.vue'
import LatestNewsPaginated from '~/components/home/LatestNewsPaginated.vue'

import AdPlacement from '~/components/ads/AdPlacement.vue'
import { useArticlesStore } from '~/stores/articles'

const { t } = useI18n()
const store = useArticlesStore()

const articlesLoaded = ref(false)
const secondaryLoading = ref(true)
const secondaryArticles = ref<Article[]>([])

const paginatedLoading = ref(true)
const paginatedArticles = ref<Article[]>([])
const currentPage = ref(1)
const totalPages = ref(1)

const entertainmentLoading = ref(true)
const entertainmentArticles = ref<Article[]>([])

const sportLoading = ref(true)
const sportArticles = ref<Article[]>([])

interface ArticleListResponse {
  data: Article[]
  total: number
  page: number
  totalPages: number
}

onMounted(async () => {
  await store.fetchFeatured()

  // Latest articles — seed secondary row + paginated feed
  try {
    const response = await $fetch('/api/articles', {
      query: { page: 1, perPage: 12 },
    }) as ArticleListResponse
    const allLatest = response.data || []
    secondaryArticles.value = allLatest.slice(0, 2)
    secondaryLoading.value = false
    paginatedArticles.value = allLatest
    paginatedLoading.value = false
    totalPages.value = response.totalPages || 1
  } catch {
    secondaryLoading.value = false
    paginatedLoading.value = false
  }

  // IMYIDAGADURO
  try {
    const response = await $fetch('/api/articles', {
      query: { category: 'imyidagaduro', perPage: 3 },
    }) as ArticleListResponse
    entertainmentArticles.value = response.data || []
  } catch {} finally {
    entertainmentLoading.value = false
  }

  // IMIKINO
  try {
    const response = await $fetch('/api/articles', {
      query: { category: 'imikino', perPage: 3 },
    }) as ArticleListResponse
    sportArticles.value = response.data || []
  } catch {} finally {
    sportLoading.value = false
    articlesLoaded.value = true
  }
})

async function handlePageChange(page: number) {
  currentPage.value = page
  paginatedLoading.value = true
  try {
    const response = await $fetch('/api/articles', {
      query: { page, perPage: 10 },
    }) as ArticleListResponse
    paginatedArticles.value = response.data || []
    totalPages.value = response.totalPages || 1
  } catch {} finally {
    paginatedLoading.value = false
  }
}

useHead({
  title: t('seo.home.title'),
  meta: [
    { name: 'description', content: t('seo.home.description') },
    { property: 'og:title', content: t('seo.home.title') },
    { property: 'og:description', content: t('seo.home.description') },
    { property: 'og:type', content: 'website' },
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'SSM TV',
        url: 'https://ssmtv.rw',
        logo: 'https://ssmtv.rw/logo-icon.svg',
        sameAs: [
          'https://www.youtube.com/@THESTRUGGLESOFSINGLESMOTHERS',
          'https://twitter.com/ssmtv',
          'https://facebook.com/ssmtv',
        ],
      }),
    },
  ],
})

definePageMeta({
  layout: 'default',
})
</script>

<style scoped>
.bbc-home {
  background: #fff;
  padding: 0;
}

.bbc-section {
  max-width: 1280px;
  margin: 0 auto 48px auto;
  padding: 0 16px;
}

@media (min-width: 768px) {
  .bbc-section {
    padding: 0 24px;
  }
}

@media (min-width: 1024px) {
  .bbc-section {
    padding: 0 32px;
  }
}

/* ---- Section heading with green accent bar + black bottom border ---- */
.bbc-section-heading {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 24px;
  padding-top: 16px;
  padding-bottom: 14px;
  border-top: 3px solid #16a34a;
  border-bottom: 2px solid #141414;
}

.bbc-section-title {
  font-size: 1.25rem;
  font-weight: 800;
  line-height: 1.2;
  color: #141414;
  margin: 0;
  letter-spacing: -0.012em;
}

@media (min-width: 768px) {
  .bbc-section-title {
    font-size: 1.5rem;
  }
}

.bbc-section-more {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #16a34a;
  text-decoration: none;
  white-space: nowrap;
}

.bbc-section-more:hover {
  text-decoration: underline;
  text-underline-offset: 3px;
  text-decoration-thickness: 1.5px;
}

/* ---- Responsive grid ---- */
.bbc-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

@media (min-width: 600px) {
  .bbc-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 900px) {
  .bbc-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.bbc-grid--2col {
  grid-template-columns: 1fr;
}

@media (min-width: 600px) {
  .bbc-grid--2col {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* ---- Skeleton cards — use shared .skeleton-pulse from main.css ---- */
.bbc-card-skeleton {
  background: #fff;
  border-radius: 6px;
  overflow: hidden;
}

.bbc-card-skeleton-img {
  aspect-ratio: 16 / 9;
}

.bbc-card-skeleton-body {
  padding: 16px 0 0 0;
}

.bbc-card-skeleton-category {
  width: 30%;
  height: 10px;
  border-radius: 2px;
  margin-bottom: 8px;
}

.bbc-card-skeleton-title {
  width: 90%;
  height: 16px;
  border-radius: 2px;
  margin-bottom: 8px;
}

.bbc-card-skeleton-meta {
  width: 40%;
  height: 10px;
  border-radius: 2px;
}
</style>
