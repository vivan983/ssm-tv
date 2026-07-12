<template>
  <div class="ssm-tv-page">
    <!-- Loading -->
    <div v-if="loading" class="ssm-loading">
      <div class="flex gap-6 mb-8">
        <div class="flex-[0_0_75%]">
          <div class="aspect-video bg-neutral-200 animate-pulse rounded-lg" />
        </div>
        <div class="flex-[0_0_25%] space-y-3">
          <div v-for="i in 4" :key="i" class="flex gap-3">
            <div class="w-36 aspect-video bg-neutral-200 animate-pulse rounded-lg flex-shrink-0" />
            <div class="flex-1 space-y-2 py-1">
              <div class="h-3 bg-neutral-200 animate-pulse rounded" />
              <div class="h-3 bg-neutral-100 animate-pulse rounded w-2/3" />
            </div>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 6" :key="i" class="bg-white rounded-lg overflow-hidden">
          <div class="aspect-video bg-neutral-200 animate-pulse" />
          <div class="p-4 space-y-2">
            <div class="h-5 bg-neutral-200 rounded animate-pulse" />
            <div class="h-4 bg-neutral-100 rounded animate-pulse w-1/2" />
          </div>
        </div>
      </div>
    </div>

    <!-- Error -->
    <div v-if="!loading && fetchError && videos.length === 0" class="text-center py-20">
      <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h3 class="text-lg font-semibold text-neutral-800 mb-1">Unable to load videos</h3>
      <p class="text-sm text-neutral-500 mb-4">{{ fetchError }}</p>
      <button class="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-sm" @click="loadVideos()">Try again</button>
    </div>

    <!-- ============================================================ -->
    <!-- CONTENT                                                     -->
    <!-- ============================================================ -->
    <div v-if="videos.length > 0">
      <!-- ============================================================ -->
      <!-- HERO SECTION: 75/25 split                                    -->
      <!-- ============================================================ -->
      <section class="ssm-hero mb-[30px]">
        <div class="flex flex-col lg:flex-row gap-3">
          <!-- LEFT: Large featured (75%) -->
          <NuxtLink
            :to="localePath(`/ssm-tv/video/${heroVideo.videoId}`)"
            class="flex-[0_0_75%] block group relative aspect-video bg-neutral-900 rounded-lg overflow-hidden shadow-lg group"
          >
            <img
              :src="heroVideo.thumbnailUrl"
              :alt="heroVideo.title"
              class="absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-out group-hover:scale-[1.03]"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
            <!-- SSM badge -->
            <div class="absolute top-3 left-3 z-10">
              <img src="/logo-ssm.png" alt="SSM" class="h-8 w-auto drop-shadow-lg" />
            </div>
            <!-- Play -->
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="w-[72px] h-[72px] rounded-full bg-red-600/90 flex items-center justify-center shadow-2xl group-hover:bg-red-700 group-hover:scale-110 transition-all duration-300 ease-out">
                <svg class="h-8 w-8 text-white ml-1.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              </div>
            </div>
            <!-- Title -->
            <div class="absolute bottom-0 inset-x-0 p-6">
              <p class="text-white/80 text-xs font-semibold uppercase tracking-wider mb-1.5">SSM TV &bull; Featured</p>
              <h1 class="text-white font-extrabold text-[28px] lg:text-[34px] leading-[1.2] line-clamp-2 drop-shadow-md">
                {{ heroVideo.title }}
              </h1>
              <p class="text-white/80 text-sm font-medium mt-2">
                {{ formatDate(heroVideo.publishedAt) }}
              </p>
            </div>
          </NuxtLink>

          <!-- RIGHT: 4 stacked videos (25%) -->
          <div class="flex-[0_0_25%] flex flex-col gap-3">
            <NuxtLink
              v-for="video in heroSideVideos"
              :key="video.videoId"
              :to="localePath(`/ssm-tv/video/${video.videoId}`)"
              class="flex-1 flex gap-3 group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 ease-out border border-neutral-100"
            >
              <div class="w-[45%] flex-shrink-0 relative overflow-hidden">
                <img :src="video.thumbnailUrl" :alt="video.title" class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105" loading="lazy" />
                <div class="absolute inset-0 bg-black/10 group-hover:bg-black/25 transition-colors flex items-center justify-center">
                  <div class="w-8 h-8 rounded-full bg-red-600/85 flex items-center justify-center shadow-lg group-hover:bg-red-700 group-hover:scale-110 transition-all duration-300">
                    <svg class="h-3.5 w-3.5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  </div>
                </div>
                <div class="absolute top-2 left-2">
                  <img src="/logo-ssm.png" alt="SSM" class="h-4 w-auto drop-shadow-md" />
                </div>
              </div>
              <div class="flex-1 min-w-0 flex flex-col justify-center pr-3">
                <p class="text-xs font-semibold text-green-700 uppercase tracking-wide mb-0.5">SSM TV</p>
                <h3 class="text-[13px] font-semibold text-neutral-800 group-hover:text-green-700 transition-colors line-clamp-2 leading-snug">
                  {{ video.title }}
                </h3>
                <p class="text-xs text-neutral-400 mt-1 font-medium">{{ formatDateShort(video.publishedAt) }}</p>
              </div>
            </NuxtLink>
          </div>
        </div>
      </section>

      <!-- ============================================================ -->
      <!-- Subscribe CTA                                               -->
      <!-- ============================================================ -->
      <a
        href="https://www.youtube.com/@THESTRUGGLESOFSINGLESMOTHERS"
        target="_blank" rel="noopener noreferrer"
        class="flex items-center gap-4 px-6 py-4 mb-[30px] rounded-lg bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md hover:shadow-xl transition-all duration-300 ease-out group hover:-translate-y-0.5"
      >
        <div class="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
          <svg class="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <span class="font-extrabold text-sm">{{ $t('video.subscribe') }}</span>
          <p class="text-red-100 text-xs mt-0.5 font-medium">{{ $t('video.description') }}</p>
        </div>
        <span class="text-sm font-bold text-red-100 group-hover:translate-x-1 transition-transform duration-300 hidden sm:inline-flex items-center gap-1">Subscribe<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg></span>
      </a>

      <!-- ============================================================ -->
      <!-- MAIN + SIDEBAR: 75/25 split                                  -->
      <!-- ============================================================ -->
      <div class="flex flex-col lg:flex-row gap-[30px]">
        <!-- ============================================================ -->
        <!-- LEFT: Video Grid (75%)                                       -->
        <!-- ============================================================ -->
        <div class="flex-[0_0_75%] min-w-0">
          <div v-if="gridVideos.length > 0">
            <div class="flex items-center gap-4 mb-5">
              <h2 class="text-xl font-extrabold text-neutral-900 tracking-tight">
                {{ $t('video.latestVideos') }}
              </h2>
              <div class="flex-1 h-px bg-neutral-200" />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <NuxtLink
                v-for="video in gridVideos"
                :key="video.videoId"
                :to="localePath(`/ssm-tv/video/${video.videoId}`)"
                class="ssm-video-card group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg border border-neutral-100 transition-all duration-300 ease-out hover:-translate-y-1"
              >
                <!-- Thumbnail -->
                <div class="relative aspect-video bg-neutral-200 overflow-hidden">
                  <img :src="video.thumbnailUrl" :alt="video.title" class="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]" loading="lazy" />
                  <!-- SSM badge -->
                  <div class="absolute top-2.5 left-2.5 z-10">
                    <img src="/logo-ssm.png" alt="SSM" class="h-4 w-auto drop-shadow-md" />
                  </div>
                  <!-- Stats -->
                  <div class="absolute top-2.5 right-2.5 flex items-center gap-2 z-10">
                    <span class="flex items-center gap-1 text-white text-[11px] font-semibold bg-black/55 backdrop-blur-sm px-2 py-0.5 rounded-full">
                      <svg class="h-3 w-3" fill="currentColor" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path fill-rule="evenodd" d="M12 4C7 4 2.73 7.11 1 11.5 2.73 15.89 7 19 12 19s9.27-3.11 11-7.5C21.27 7.11 17 4 12 4z" clip-rule="evenodd"/></svg>
                      {{ formatCount(video.views || 0) }}
                    </span>
                    <span class="flex items-center gap-1 text-white text-[11px] font-semibold bg-black/55 backdrop-blur-sm px-2 py-0.5 rounded-full">
                      <svg class="h-3 w-3" fill="currentColor" viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                      {{ formatCount(video.commentsCount || 0) }}
                    </span>
                  </div>
                  <!-- Play -->
                  <div class="absolute inset-0 flex items-center justify-center">
                    <div class="w-12 h-12 rounded-full bg-red-600/80 flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300 ease-out">
                      <svg class="h-5 w-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    </div>
                  </div>
                </div>
                <!-- Info -->
                <div class="p-[15px]">
                  <span class="text-xs font-bold text-green-700 uppercase tracking-wide">SSM TV</span>
                  <h3 class="text-[16px] lg:text-[18px] font-semibold text-neutral-800 group-hover:text-green-700 transition-colors line-clamp-2 leading-[1.4] mt-1">
                    {{ video.title }}
                  </h3>
                  <p class="text-sm text-neutral-500 mt-1.5 line-clamp-2 leading-relaxed">
                    {{ video.description || video.title }}
                  </p>
                  <p class="text-xs text-neutral-400 mt-2 font-medium">{{ formatDateShort(video.publishedAt) }}</p>
                </div>
              </NuxtLink>
            </div>
          </div>

          <!-- Load More -->
          <div v-if="hasMore" class="mt-[30px] text-center">
            <button
              class="px-8 py-3.5 bg-white border-2 border-neutral-300 text-neutral-700 rounded-lg hover:border-green-600 hover:text-green-700 hover:shadow-md transition-all duration-300 ease-out font-bold text-sm disabled:opacity-50"
              :disabled="loadingMore" @click="loadMore"
            >
              <span v-if="loadingMore" class="inline-flex items-center gap-2">
                <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Loading...
              </span>
              <span v-else>{{ $t('video.loadMore') || 'Load more videos' }}</span>
            </button>
          </div>
        </div>

        <!-- ============================================================ -->
        <!-- RIGHT: Sidebar (25%)                                         -->
        <!-- ============================================================ -->
        <aside class="flex-[0_0_25%] space-y-[30px]">
          <!-- MOST POPULAR -->
          <div class="bg-white rounded-lg p-[15px] shadow-sm border border-neutral-100">
            <h3 class="text-lg font-extrabold text-neutral-900 mb-4 pb-3 border-b-2 border-green-600 uppercase tracking-wide">
              Most Popular
            </h3>
            <div class="space-y-4">
              <NuxtLink
                v-for="(v, i) in popularVideos"
                :key="v.videoId"
                :to="localePath(`/ssm-tv/video/${v.videoId}`)"
                class="flex gap-3 group"
              >
                <div class="w-7 flex-shrink-0 pt-0.5">
                  <span class="text-sm font-black text-neutral-300 group-hover:text-green-500 transition-colors">{{ i + 1 }}</span>
                </div>
                <div class="w-[88px] flex-shrink-0">
                  <div class="relative aspect-video rounded-lg overflow-hidden bg-neutral-200 shadow-sm">
                    <img :src="v.thumbnailUrl" :alt="v.title" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                    <div class="absolute top-1 left-1">
                      <img src="/logo-ssm.png" alt="SSM" class="h-3 w-auto drop-shadow-sm" />
                    </div>
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <h4 class="text-sm font-semibold text-neutral-800 group-hover:text-green-700 transition-colors line-clamp-2 leading-snug">
                    {{ v.title }}
                  </h4>
                  <p class="text-xs text-neutral-400 mt-1 font-medium">{{ formatCount(v.views || 0) }} views</p>
                </div>
              </NuxtLink>
            </div>
          </div>

          <!-- TRENDING NOW -->
          <div class="bg-white rounded-lg p-[15px] shadow-sm border border-neutral-100">
            <h3 class="text-lg font-extrabold text-neutral-900 mb-4 pb-3 border-b-2 border-green-600 uppercase tracking-wide">
              Trending Now
            </h3>
            <div class="space-y-3">
              <NuxtLink
                v-for="v in trendingVideos"
                :key="v.videoId"
                :to="localePath(`/ssm-tv/video/${v.videoId}`)"
                class="flex gap-3 group"
              >
                <div class="w-[88px] flex-shrink-0">
                  <div class="relative aspect-video rounded-lg overflow-hidden bg-neutral-200">
                    <img :src="v.thumbnailUrl" :alt="v.title" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                    <div class="absolute top-1 left-1">
                      <img src="/logo-ssm.png" alt="SSM" class="h-3 w-auto drop-shadow-sm" />
                    </div>
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <h4 class="text-sm font-semibold text-neutral-800 group-hover:text-green-700 transition-colors line-clamp-2 leading-snug">
                    {{ v.title }}
                  </h4>
                  <p class="text-xs text-neutral-400 mt-1 font-medium">{{ formatCount(v.views || 0) }} views &bull; {{ formatDateShort(v.publishedAt) }}</p>
                </div>
              </NuxtLink>
            </div>
          </div>

          <!-- LATEST VIDEOS -->
          <div class="bg-white rounded-lg p-[15px] shadow-sm border border-neutral-100">
            <h3 class="text-lg font-extrabold text-neutral-900 mb-4 pb-3 border-b-2 border-green-600 uppercase tracking-wide">
              Latest Videos
            </h3>
            <div class="space-y-3">
              <NuxtLink
                v-for="v in latestSidebarVideos"
                :key="v.videoId"
                :to="localePath(`/ssm-tv/video/${v.videoId}`)"
                class="flex gap-3 group"
              >
                <div class="w-[88px] flex-shrink-0">
                  <div class="relative aspect-video rounded-lg overflow-hidden bg-neutral-200">
                    <img :src="v.thumbnailUrl" :alt="v.title" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                    <div class="absolute top-1 left-1">
                      <img src="/logo-ssm.png" alt="SSM" class="h-3 w-auto drop-shadow-sm" />
                    </div>
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <h4 class="text-sm font-semibold text-neutral-800 group-hover:text-green-700 transition-colors line-clamp-2 leading-snug">
                    {{ v.title }}
                  </h4>
                  <p class="text-xs text-neutral-400 mt-1 font-medium">{{ formatDateShort(v.publishedAt) }}</p>
                </div>
              </NuxtLink>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { YouTubeVideo } from '~/types/video'

interface VideoWithStats extends YouTubeVideo {
  views?: number
  commentsCount?: number
}

const { t, locale } = useI18n()
const localePath = useLocalePath()
const PER_PAGE = 12

const videos = ref<VideoWithStats[]>([])
const loading = ref(true)
const loadingMore = ref(false)
const fetchError = ref<string | null>(null)
const currentPage = ref(1)
const totalPages = ref(1)

const heroVideo = computed(() => videos.value[0])
const heroSideVideos = computed(() => videos.value.slice(1, 5))
const gridVideos = computed(() => videos.value.slice(5))
const popularVideos = computed(() => videos.value.slice(0, 5))
const trendingVideos = computed(() => videos.value.slice(2, 6))
const latestSidebarVideos = computed(() => videos.value.slice(6, 10))
const hasMore = computed(() => currentPage.value < totalPages.value)

async function loadVideos(page = 1, append = false) {
  if (page === 1) loading.value = true
  else loadingMore.value = true
  fetchError.value = null
  try {
    const { data } = await useFetch('/api/youtube/videos', { query: { maxResults: PER_PAGE, page } })
    const result = data.value as any
    if (result?.videos?.length) {
      const enriched = result.videos.map((v: any) => ({ ...v, views: v.views || 0, commentsCount: v.commentsCount || 0 }))
      if (append) videos.value = [...videos.value, ...enriched]
      else videos.value = enriched
      currentPage.value = result.page || page
      totalPages.value = result.totalPages || 1
    } else if (!append) videos.value = []
  } catch (e: any) {
    if (!append) fetchError.value = e.message || 'Failed to load videos'
  } finally { loading.value = false; loadingMore.value = false }
}

function loadMore() { if (!hasMore.value || loadingMore.value) return; loadVideos(currentPage.value + 1, true) }

function formatDate(date: string) {
  if (!date) return ''
  return new Date(date).toLocaleDateString(
    locale.value === 'rw' ? 'rw-RW' : locale.value === 'fr' ? 'fr-FR' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  )
}
function formatDateShort(date: string) {
  if (!date) return ''
  return new Date(date).toLocaleDateString(
    locale.value === 'rw' ? 'rw-RW' : locale.value === 'fr' ? 'fr-FR' : 'en-US',
    { year: 'numeric', month: 'short', day: 'numeric' }
  )
}
function formatCount(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K'
  return String(n)
}

await loadVideos().catch(() => {})

useHead({
  title: t('seo.ssmTv.title'),
  meta: [
    { name: 'description', content: t('seo.ssmTv.description') },
    { property: 'og:title', content: t('seo.ssmTv.title') },
    { property: 'og:description', content: t('seo.ssmTv.description') },
  ],
})

definePageMeta({ layout: 'default' })
</script>

<style scoped>
/* ---- Page container — matches site-wide 1280px system ---- */
.ssm-tv-page {
  max-width: 1280px;
  margin: 0 auto;
  padding: 40px 16px 64px 16px;
}

@media (min-width: 768px) {
  .ssm-tv-page {
    padding-left: 24px;
    padding-right: 24px;
  }
}

@media (min-width: 1024px) {
  .ssm-tv-page {
    padding-left: 32px;
    padding-right: 32px;
  }
}

/* ---- Video listing card ---- */
.ssm-video-card {
  border-radius: 6px;
  transition: box-shadow 0.2s ease;
}

.ssm-video-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}
</style>
