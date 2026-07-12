<template>
  <section class="mb-10">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl lg:text-2xl font-bold text-neutral-900">
        {{ $t('home.latestNews') }}
      </h2>
      <NuxtLink
        :to="localePath('/search')"
        class="text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
      >
        {{ $t('home.viewAll') }} →
      </NuxtLink>
    </div>

    <ArticleGrid
      :articles="latest"
      :loading="loading"
      :skeleton-count="6"
    />

    <!-- Error -->
    <BaseErrorState
      v-if="!loading && error"
      :message="error"
      @retry="refresh"
      class="mt-4"
    />

    <!-- Pagination -->
    <BasePagination
      v-if="!loading && totalPages > 1"
      :current-page="currentPage"
      :total-pages="totalPages"
      class="mt-8"
      @change="changePage"
    />
  </section>
</template>

<script setup lang="ts">
import ArticleGrid from '~/components/article/ArticleGrid.vue'
import BasePagination from '~/components/ui/BasePagination.vue'
import BaseErrorState from '~/components/ui/BaseErrorState.vue'
import { useArticlesStore } from '~/stores/articles'

const localePath = useLocalePath()
const store = useArticlesStore()

const latest = computed(() => store.latest)
const loading = computed(() => store.latestLoading)
const error = computed(() => store.latestError)
const currentPage = computed(() => store.latestPage)
const totalPages = computed(() => store.latestTotalPages)

onMounted(() => {
  store.fetchLatest(1)
})

function changePage(page: number) {
  store.fetchLatest(page)
}

function refresh() {
  store.fetchLatest(currentPage.value)
}
</script>
