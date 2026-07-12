<template>
  <section class="mb-8">
    <ArticleHero :article="featured" :loading="loading" />

    <!-- Empty state (no featured article available) -->
    <div v-if="!loading && !featured" class="card p-6 text-center text-neutral-500">
      <p>{{ $t('home.noFeatured') }}</p>
    </div>
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
