<template>
  <div class="flex flex-wrap items-center gap-4 text-sm text-neutral-600 py-4 border-y border-neutral-200 my-6">
    <div v-if="article.author" class="flex items-center gap-2">
      <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-xs">
        {{ article.author.display_name.charAt(0).toUpperCase() }}
      </div>
      <div>
        <p class="font-medium text-neutral-800">{{ article.author.display_name }}</p>
        <p class="text-xs text-neutral-500">{{ $t('article.by') }}</p>
      </div>
    </div>
    <div class="flex-1" />
    <div v-if="article.published_at" class="flex items-center gap-1.5">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <span>{{ formatDate(article.published_at) }}</span>
    </div>
    <div v-if="article.view_count > 0" class="flex items-center gap-1.5">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
      <span>{{ formatViewCount(article.view_count) }} {{ $t('article.views') }}</span>
    </div>
    <div v-if="article.category" class="flex items-center gap-1.5">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
      <span>{{ article.category.name }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Article } from '~/types/article'

defineProps<{
  article: Article
}>()

const { locale } = useI18n()

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(
    locale.value === 'rw' ? 'rw-RW' : locale.value === 'fr' ? 'fr-FR' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  )
}

function formatViewCount(count: number) {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
  return count.toString()
}
</script>
