<template>
  <div class="max-w-5xl mx-auto px-4 md:px-6 py-6">
    <!-- ============================================================ -->
    <!-- Loading                                                     -->
    <!-- ============================================================ -->
    <div v-if="loading" class="space-y-5 max-w-4xl mx-auto">
      <div class="h-8 bg-neutral-200 animate-pulse rounded w-3/4" />
      <div class="h-6 bg-neutral-200 animate-pulse rounded w-1/2" />
      <div class="aspect-video bg-neutral-200 animate-pulse rounded-xl" />
      <div class="h-20 bg-neutral-100 animate-pulse rounded" />
    </div>

    <!-- ============================================================ -->
    <!-- Error                                                       -->
    <!-- ============================================================ -->
    <div v-if="!loading && error" class="text-center py-20">
      <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h2 class="text-lg font-bold text-neutral-800 mb-2">Unable to load video</h2>
      <p class="text-sm text-neutral-500 mb-4">{{ error }}</p>
      <button
        class="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-sm"
        @click="loadVideo"
      >Try again</button>
    </div>

    <!-- ============================================================ -->
    <!-- Video Content                                               -->
    <!-- ============================================================ -->
    <div v-if="video" class="max-w-4xl mx-auto">
      <!-- ============================================================ -->
      <!-- 1. VIDEO TITLE                                              -->
      <!-- ============================================================ -->
      <h1 class="text-xl lg:text-2xl font-extrabold text-neutral-900 uppercase leading-tight mb-5">
        {{ video.title }}
      </h1>

      <!-- ============================================================ -->
      <!-- 2. VIDEO PLAYER                                             -->
      <!-- ============================================================ -->
      <div class="relative aspect-video bg-black rounded-xl overflow-hidden shadow-xl mb-6">
        <!-- Thumbnail / poster state -->
        <div
          v-if="!playing"
          class="absolute inset-0 cursor-pointer group z-10"
          @click="playing = true"
          role="button"
          :aria-label="`Play: ${video.title}`"
          tabindex="0"
          @keydown.enter="playing = true"
          @keydown.space.prevent="playing = true"
        >
          <img
            :src="video.thumbnailUrl"
            :alt="video.title"
            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <!-- Dark overlay + play button -->
          <div class="absolute inset-0 flex items-center justify-center bg-black/35 group-hover:bg-black/45 transition-colors">
            <div class="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center shadow-2xl group-hover:bg-red-700 group-hover:scale-110 transition-all duration-200">
              <svg class="h-9 w-9 text-white ml-1.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- SSM Logo Watermark -->
        <div
          class="absolute top-[15px] left-[15px] z-20 pointer-events-none"
          :class="{ 'hidden': !playing }"
        >
          <img
            src="/logo-ssm.png"
            alt="SSM TV"
            class="h-8 lg:h-10 w-auto opacity-90 drop-shadow-lg"
          />
        </div>

        <!-- YouTube iframe -->
        <iframe
          v-if="playing"
          :src="embedUrl"
          class="absolute inset-0 w-full h-full z-0"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
          :title="video.title"
        />
      </div>

      <!-- ============================================================ -->
      <!-- 3. VIDEO METADATA                                           -->
      <!-- ============================================================ -->
      <div class="space-y-4">
        <!-- Category + Date row -->
        <div class="flex flex-wrap items-center gap-3 text-sm text-neutral-600">
          <span class="inline-block text-xs font-bold text-green-700 bg-green-100 px-2.5 py-0.5 rounded">
            SSM TV
          </span>
          <span class="text-neutral-300" aria-hidden="true">|</span>
          <span class="flex items-center gap-1.5">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {{ formatDate(video.publishedAt) || 'Recently published' }}
          </span>
          <span class="text-neutral-300" aria-hidden="true">|</span>
          <span class="flex items-center gap-1.5">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {{ video.channelTitle || 'SSM TV' }}
          </span>
        </div>

        <!-- Divider -->
        <div class="border-t border-neutral-200" />

        <!-- Description -->
        <div v-if="video.description" class="bg-neutral-50 rounded-lg p-5 border border-neutral-200">
          <h3 class="text-sm font-bold text-neutral-700 mb-2 uppercase tracking-wide">Description</h3>
          <p class="text-sm text-neutral-700 leading-relaxed whitespace-pre-line">
            {{ video.description }}
          </p>
        </div>

        <!-- Subscribe CTA -->
        <a
          href="https://www.youtube.com/@THESTRUGGLESOFSINGLESMOTHERS"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-3 px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white transition-colors shadow-md hover:shadow-lg group mt-6"
        >
          <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
            <svg class="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </div>
          <div class="flex-1 min-w-0">
            <span class="font-bold text-sm">{{ $t('video.subscribe') }}</span>
            <p class="text-red-100 text-xs mt-0.5">{{ $t('video.description') }}</p>
          </div>
          <span class="text-xs font-semibold text-red-100 group-hover:translate-x-0.5 transition-transform hidden sm:inline">
            Subscribe &rarr;
          </span>
        </a>
      </div>

      <!-- ============================================================ -->
      <!-- Related Videos                                              -->
      <!-- ============================================================ -->
      <div v-if="relatedVideos.length > 0" class="mt-10">
        <div class="flex items-center gap-3 mb-5">
          <h3 class="text-base font-extrabold text-neutral-900 uppercase tracking-wide">
            More from SSM TV
          </h3>
          <div class="flex-1 h-px bg-neutral-200" />
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <NuxtLink
            v-for="rv in relatedVideos"
            :key="rv.videoId"
            :to="`/ssm-tv/video/${rv.videoId}`"
            class="card overflow-hidden group transition-shadow hover:shadow-card-hover"
          >
            <div class="relative aspect-video bg-neutral-200 overflow-hidden">
              <img
                :src="rv.thumbnailUrl"
                :alt="rv.title"
                class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <div class="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/25 transition-colors">
                <div class="w-10 h-10 rounded-full bg-red-600/80 flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-200">
                  <svg class="h-4 w-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>
            <div class="p-3">
              <h4 class="text-sm font-semibold text-neutral-800 group-hover:text-green-700 transition-colors line-clamp-2 leading-snug">
                {{ rv.title }}
              </h4>
              <p class="text-xs text-neutral-500 mt-1.5">{{ formatDate(rv.publishedAt) }}</p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { YouTubeVideo } from '~/types/video'
import { useYoutubeStore } from '~/stores/youtube'

const { t, locale } = useI18n()
const route = useRoute()
const store = useYoutubeStore()
const { public: { siteUrl } } = useRuntimeConfig()

const video = ref<YouTubeVideo | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const playing = ref(false)

const videoId = computed(() => route.params.videoId as string)

const embedUrl = computed(() => {
  const origin = encodeURIComponent(siteUrl || 'https://ssmtv.rw')
  return `https://www.youtube.com/embed/${videoId.value}?autoplay=1&rel=0&origin=${origin}`
})

const videoUrl = computed(() => `https://www.youtube.com/watch?v=${videoId.value}`)

const relatedVideos = computed(() => {
  return store.videos.filter((v) => v.videoId !== videoId.value).slice(0, 6)
})

// ---------------------------------------------------------------------------
// Load video
// ---------------------------------------------------------------------------

async function loadVideo() {
  loading.value = true
  error.value = null
  playing.value = false

  // 1. Pinia store
  const cached = store.getVideoById(videoId.value)
  if (cached) { video.value = cached; loading.value = false; return }

  // 2. Server API
  try {
    const { data } = await useFetch('/api/youtube/videos', { query: { maxResults: 50 } })
    const result = data.value as any
    if (result?.videos) {
      store.setVideos(result.videos, 1, 1, result.videos.length)
      const found = store.getVideoById(videoId.value)
      if (found) { video.value = found; loading.value = false; return }
    }
  } catch { /* continue */ }

  // 3. YouTube oEmbed fallback
  try {
    const oembed = await $fetch<any>(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(videoUrl.value)}&format=json`
    )
    if (oembed) {
      video.value = {
        videoId: videoId.value,
        title: oembed.title || 'Untitled Video',
        description: '',
        thumbnailUrl: oembed.thumbnail_url || `https://i.ytimg.com/vi/${videoId.value}/hqdefault.jpg`,
        publishedAt: '',
        channelTitle: oembed.author_name || 'SSM TV',
        url: videoUrl.value,
      }
      loading.value = false
      return
    }
  } catch { /* continue */ }

  // 4. Minimal fallback
  video.value = {
    videoId: videoId.value,
    title: 'SSM TV Video',
    description: '',
    thumbnailUrl: `https://i.ytimg.com/vi/${videoId.value}/hqdefault.jpg`,
    publishedAt: '',
    channelTitle: 'SSM TV',
    url: videoUrl.value,
  }
  loading.value = false
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(date: string) {
  if (!date) return ''
  return new Date(date).toLocaleDateString(
    locale.value === 'rw' ? 'rw-RW' : locale.value === 'fr' ? 'fr-FR' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  )
}

// ---------------------------------------------------------------------------
// Lifecycle
// ---------------------------------------------------------------------------

// Fetch during SSR + client
await loadVideo().catch(() => {})

watch(videoId, () => {
  loadVideo()
  window.scrollTo({ top: 0, behavior: 'smooth' })
})

useHead(() => ({
  title: video.value?.title || 'SSM TV',
  meta: [
    { name: 'description', content: video.value?.description?.substring(0, 160) || t('seo.ssmTv.description') },
    { property: 'og:title', content: video.value?.title || 'SSM TV' },
    { property: 'og:description', content: video.value?.description?.substring(0, 200) || t('seo.ssmTv.description') },
    { property: 'og:type', content: 'video.other' },
    { property: 'og:image', content: video.value?.thumbnailUrl || '' },
    { property: 'og:video', content: videoUrl.value },
    { name: 'twitter:card', content: 'player' },
    { name: 'twitter:title', content: video.value?.title || 'SSM TV' },
    { name: 'twitter:image', content: video.value?.thumbnailUrl || '' },
  ],
}))

definePageMeta({ layout: 'default' })
</script>
