<template>
  <section class="mb-8">
    <ArticleHero :article="featured" :loading="loading" />
  </section>
</template>

<script setup lang="ts">
import ArticleHero from '~/components/article/ArticleHero.vue'
import { useArticlesStore } from '~/stores/articles'

const store = useArticlesStore()

const featured = computed(() => store.featured)
const loading = computed(() => store.featuredLoading)

onMounted(() => {
  store.fetchFeatured()
})
</script>
