<template>
  <section v-if="articles.length >= 2" class="mb-8">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
      <ArticleCard
        v-for="article in articles.slice(0, 2)"
        :key="article.id"
        :article="article"
      />
    </div>
  </section>

  <!-- Loading -->
  <section v-else-if="loading" class="mb-8">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div v-for="i in 2" :key="i" class="card overflow-hidden">
        <BaseSkeleton variant="image" class="aspect-[16/10]" />
        <div class="p-4 space-y-3">
          <BaseSkeleton variant="title" />
          <BaseSkeleton variant="text" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Article } from '~/types/article'
import ArticleCard from '~/components/article/ArticleCard.vue'
import BaseSkeleton from '~/components/ui/BaseSkeleton.vue'

defineProps<{
  articles: Article[]
  loading?: boolean
}>()
</script>
