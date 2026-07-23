<template>
  <div v-if="articles.length > 0 || loading" class="mt-10">
    <h3 class="text-xl font-bold text-neutral-900 dark:text-white mb-6 pb-3 border-b border-neutral-200 dark:border-neutral-700">
      {{ $t('article.related') }}
    </h3>

    <!-- Loading -->
    <div v-if="loading" class="related-grid">
      <div v-for="i in 4" :key="i" class="card overflow-hidden">
        <BaseSkeleton variant="image" />
        <div class="p-3 space-y-2">
          <BaseSkeleton variant="title" />
          <BaseSkeleton variant="text" />
        </div>
      </div>
    </div>

    <!-- Loaded -->
    <div v-else class="related-grid">
      <ArticleCard
        v-for="article in articles"
        :key="article.id"
        :article="article"
        class="related-card"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Article } from '~/types/article'
import ArticleCard from './ArticleCard.vue'
import BaseSkeleton from '~/components/ui/BaseSkeleton.vue'
import { useArticlesStore } from '~/stores/articles'

const props = defineProps<{
  categoryId: string
  currentArticleId: string
  limit?: number
}>()

const store = useArticlesStore()

const articles = computed(() => store.relatedArticles)
const loading = computed(() => store.relatedLoading)

onMounted(() => {
  store.fetchRelated(props.categoryId, props.currentArticleId, props.limit || 4)
})
</script>

<style scoped>
.related-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

@media (min-width: 640px) {
  .related-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
}

@media (min-width: 1024px) {
  .related-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* Scale down cards in related section */
.related-grid :deep(.bbc-card-title) {
  font-size: 0.8125rem !important;
}

.related-grid :deep(.bbc-card-excerpt) {
  font-size: 0.75rem !important;
  -webkit-line-clamp: 1 !important;
}

.related-grid :deep(.bbc-card-body) {
  padding: 10px 10px 10px 10px !important;
}

@media (min-width: 768px) {
  .related-grid :deep(.bbc-card-title) {
    font-size: 0.875rem !important;
  }
}
</style>
