<template>
  <article class="card group overflow-hidden">
    <div class="relative aspect-video overflow-hidden bg-neutral-800">
      <img
        v-if="article.featured_image"
        :src="article.featured_image"
        :alt="article.title"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />
      <div v-else class="w-full h-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
        <svg class="h-12 w-12 text-white/50" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z"/>
        </svg>
      </div>
      <!-- Play button overlay -->
      <div class="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
        <div class="w-14 h-14 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
          <svg class="h-6 w-6 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </div>
      </div>
    </div>

    <div class="p-4">
      <NuxtLink :to="localePath(`/article/${article.slug}`)">
        <h3 class="font-semibold text-neutral-800 group-hover:text-green-700 transition-colors line-clamp-2 mb-2">
          {{ article.title }}
        </h3>
      </NuxtLink>
      <p class="text-xs text-neutral-500">
        {{ article.view_count ? formatViewCount(article.view_count) + ' ' + $t('article.views') : '' }}
      </p>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { Article } from '~/types/article'

defineProps<{
  article: Article
}>()

const localePath = useLocalePath()

function formatViewCount(count: number) {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
  return count.toString()
}
</script>
