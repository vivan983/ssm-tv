<template>
  <section v-if="categories.length > 0" class="mb-10">
    <div v-for="category in categories" :key="category.id" class="mb-10">
      <div class="flex items-center justify-between mb-5">
        <h2 class="text-xl lg:text-2xl font-bold text-neutral-900">
          {{ category.name }}
        </h2>
        <NuxtLink
          :to="localePath(`/category/${category.slug}`)"
          class="text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
        >
          {{ $t('home.viewAll') }} →
        </NuxtLink>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ArticleCard
          v-for="article in categoryArticles[category.id]"
          :key="article.id"
          :article="article"
        />
        <!-- Loading skeletons if loading -->
        <template v-if="categoryLoading[category.id]">
          <div v-for="i in 4" :key="'sk-' + i" class="card overflow-hidden">
            <BaseSkeleton variant="image" />
            <div class="p-3 space-y-2">
              <BaseSkeleton variant="title" />
              <BaseSkeleton variant="text" />
            </div>
          </div>
        </template>
      </div>

      <BaseEmptyState
        v-if="!categoryLoading[category.id] && (!categoryArticles[category.id] || categoryArticles[category.id].length === 0)"
        :message="$t('article.noArticles')"
        class="py-8"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Article, Category } from '~/types/article'
import ArticleCard from '~/components/article/ArticleCard.vue'
import BaseSkeleton from '~/components/ui/BaseSkeleton.vue'
import BaseEmptyState from '~/components/ui/BaseEmptyState.vue'

const localePath = useLocalePath()
const { locale } = useI18n()

// Fetch categories
const { data: categoriesData } = await useFetch('/api/categories')
const categories = computed<Category[]>(() => (categoriesData.value as any)?.data || [])

// Articles per category
const categoryArticles = ref<Record<string, Article[]>>({})
const categoryLoading = ref<Record<string, boolean>>({})

onMounted(async () => {
  for (const category of categories.value.slice(0, 3)) {
    categoryLoading.value[category.id] = true
    try {
      const { data } = await useFetch('/api/articles', {
        query: { category: category.slug, perPage: 4 },
      })
      categoryArticles.value[category.id] = (data.value as any)?.data || []
    } catch {
      categoryArticles.value[category.id] = []
    } finally {
      categoryLoading.value[category.id] = false
    }
  }
})
</script>
