<!-- =====================================================================
     BBC NEWS-STYLE ARTICLE GRID
     Responsive grid container for news cards.
       - 3 columns on desktop (BBC standard)
       - 2 columns on tablet
       - 1 column on mobile
       - 24px gutters (BBC uses generous spacing between cards)
       - Optional section heading above the grid
     ===================================================================== -->
<template>
  <div>
    <!-- ================================================================ -->
    <!-- LOADING STATE — skeleton cards in the same grid proportions       -->
    <!-- ================================================================ -->
    <div
      v-if="loading"
      class="bbc-grid"
    >
      <div
        v-for="n in skeletonCount"
        :key="n"
        class="bbc-card-skeleton"
      >
        <div class="bbc-card-skeleton-img skeleton-pulse" />
        <div class="bbc-card-skeleton-body">
          <div class="bbc-card-skeleton-category skeleton-pulse" />
          <div class="bbc-card-skeleton-title skeleton-pulse" />
          <div class="bbc-card-skeleton-excerpt skeleton-pulse" />
          <div class="bbc-card-skeleton-meta skeleton-pulse" />
        </div>
      </div>
    </div>

    <!-- ================================================================ -->
    <!-- EMPTY STATE                                                       -->
    <!-- ================================================================ -->
    <BaseEmptyState
      v-else-if="articles.length === 0"
      :message="emptyMessage || $t('article.noArticles')"
    />

    <!-- ================================================================ -->
    <!-- NEWS CARD GRID — BBC 3-column layout                             -->
    <!-- ================================================================ -->
    <div v-else class="bbc-grid">
      <ArticleCard
        v-for="article in articles"
        :key="article.id"
        :article="article"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Article } from '~/types/article'
import ArticleCard from './ArticleCard.vue'
import BaseEmptyState from '~/components/ui/BaseEmptyState.vue'

withDefaults(
  defineProps<{
    articles: Article[]
    loading?: boolean
    emptyMessage?: string
    skeletonCount?: number
  }>(),
  { loading: false, skeletonCount: 6 }
)
</script>

<style scoped>
/* ===================================================================
   BBC GRID LAYOUT
   3 columns desktop, 2 tablet, 1 mobile — 24px gutters.
   BBC uses a generous amount of white space between cards.
   =================================================================== */
.bbc-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 28px 24px;
}

/* 2 columns at 600px (wide phones / small tablets) */
@media (min-width: 600px) {
  .bbc-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* 3 columns at 900px (desktop) — BBC's standard card grid */
@media (min-width: 900px) {
  .bbc-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 32px 24px;
  }
}

/* ===================================================================
   SKELETON LOADING — uses shared .skeleton-pulse from main.css
   =================================================================== */
.bbc-card-skeleton {
  background: #fff;
  border-radius: 6px;
  overflow: hidden;
}

.bbc-card-skeleton-img {
  aspect-ratio: 16 / 9;
}

.bbc-card-skeleton-body {
  padding: 16px 14px 14px 14px;
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

.bbc-card-skeleton-excerpt {
  width: 100%;
  height: 12px;
  border-radius: 2px;
  margin-bottom: 12px;
}

.bbc-card-skeleton-meta {
  width: 40%;
  height: 10px;
  border-radius: 2px;
}
</style>
