<template>
  <div v-if="articles.length > 0 || loading" class="mt-10">
    <h3 class="text-xl font-bold text-neutral-900 mb-6 pb-3 border-b border-neutral-200">
      {{ $t('article.related') }}
    </h3>

    <!-- Loading -->
    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="i in 4" :key="i" class="card overflow-hidden">
        <BaseSkeleton variant="image" />
        <div class="p-3 space-y-2">
          <BaseSkeleton variant="title" />
          <BaseSkeleton variant="text" />
        </div>
      </div>
    </div>

    <!-- Loaded -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
