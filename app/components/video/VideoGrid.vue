<template>
  <div>
    <!-- Loading -->
    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <div v-for="i in skeletonCount" :key="i" class="card overflow-hidden">
        <BaseSkeleton variant="image" class="aspect-video" />
        <div class="p-4 space-y-2">
          <BaseSkeleton variant="title" />
          <BaseSkeleton variant="text" width="40%" />
        </div>
      </div>
    </div>

    <!-- Empty -->
    <BaseEmptyState
      v-else-if="videos.length === 0"
      :message="$t('video.noVideos')"
    />

    <!-- Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <VideoCard
        v-for="video in videos"
        :key="video.id"
        :article="video"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Article } from '~/types/article'
import VideoCard from './VideoCard.vue'
import BaseSkeleton from '~/components/ui/BaseSkeleton.vue'
import BaseEmptyState from '~/components/ui/BaseEmptyState.vue'

withDefaults(
  defineProps<{
    videos: Article[]
    loading?: boolean
    skeletonCount?: number
  }>(),
  { loading: false, skeletonCount: 6 }
)
</script>
