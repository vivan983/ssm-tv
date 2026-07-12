<template>
  <section class="mb-10">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl lg:text-2xl font-bold text-neutral-900">
        {{ $t('home.videos') }}
      </h2>
      <NuxtLink
        :to="localePath('/ssm-tv')"
        class="text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
      >
        {{ $t('home.viewAll') }} →
      </NuxtLink>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <VideoCard
        v-for="video in videos"
        :key="video.id"
        :article="video"
      />
    </div>

    <BaseEmptyState
      v-if="!loading && videos.length === 0"
      :message="$t('video.noVideos')"
      class="py-8"
    />
  </section>
</template>

<script setup lang="ts">
import type { Article } from '~/types/article'
import VideoCard from '~/components/video/VideoCard.vue'
import BaseEmptyState from '~/components/ui/BaseEmptyState.vue'

const localePath = useLocalePath()

const videos = ref<Article[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const { data } = await useFetch('/api/articles', {
      query: { perPage: 3 },
    })
    const articles = (data.value as any)?.data || []
    // Filter video articles (is_video = true), or just take some for demo
    videos.value = articles.filter((a: Article) => a.is_video).slice(0, 3)
    // Fallback: if no video articles, show featured articles as video placeholders
    if (videos.value.length === 0) {
      videos.value = articles.slice(0, 3)
    }
  } catch {
    // Silently fail
  } finally {
    loading.value = false
  }
})
</script>
