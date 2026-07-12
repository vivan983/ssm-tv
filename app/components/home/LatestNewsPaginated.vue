<template>
  <section class="mb-10">
    <div class="flex flex-col lg:flex-row gap-8">
      <!-- Left: Paginated article list -->
      <div class="flex-1 min-w-0">
        <!-- Loading -->
        <div v-if="loading" class="space-y-4">
          <div v-for="i in 10" :key="i" class="flex gap-4">
            <BaseSkeleton variant="text" width="120px" height="80px" />
            <div class="flex-1 space-y-2">
              <BaseSkeleton variant="title" />
              <BaseSkeleton variant="text" />
              <BaseSkeleton variant="text" width="40%" />
            </div>
          </div>
        </div>

        <!-- Article list -->
        <div v-else-if="articles.length > 0" class="space-y-0 divide-y divide-neutral-200">
          <article
            v-for="article in articles"
            :key="article.id"
            class="flex gap-4 py-4 group"
          >
            <!-- Thumbnail -->
            <div class="w-28 h-20 lg:w-36 lg:h-24 flex-shrink-0 rounded-lg overflow-hidden bg-neutral-200">
              <NuxtLink :to="localePath(`/article/${article.slug}`)" class="block h-full">
                <img
                  v-if="article.featured_image"
                  :src="article.featured_image"
                  :alt="article.title"
                  class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div v-else class="w-full h-full bg-gradient-to-br from-green-300 to-blue-400 flex items-center justify-center">
                  <span class="text-xs font-black text-white/20">SSM</span>
                </div>
              </NuxtLink>
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <BaseBadge
                v-if="article.category"
                variant="green"
                size="xs"
                class="mb-1"
              >
                {{ article.category.name }}
              </BaseBadge>
              <NuxtLink :to="localePath(`/article/${article.slug}`)">
                <h3 class="text-sm lg:text-base font-semibold text-neutral-800 group-hover:text-green-700 transition-colors line-clamp-2">
                  {{ article.title }}
                </h3>
              </NuxtLink>
              <div class="text-xs text-neutral-500 mt-1">
                {{ formatDateShort(article.published_at) }}
              </div>
            </div>
          </article>
        </div>

        <!-- Empty -->
        <BaseEmptyState
          v-else
          :message="$t('article.noArticles')"
        />

        <!-- Pagination -->
        <BasePagination
          v-if="!loading && totalPages > 1"
          :current-page="currentPage"
          :total-pages="totalPages"
          class="mt-6"
          @change="$emit('pageChange', $event)"
        />
      </div>

      <!-- Right: Sidebar -->
      <aside class="w-full lg:w-80 xl:w-96 flex-shrink-0 space-y-6">
        <!-- AD: Sidebar -->
        <AdPlacement placement="sidebar" :limit="1" />

        <!-- PREMIUM: Advertise With Us CTA -->
        <AdvertiseCTA />

        <!-- Most Read -->
        <div class="card p-4">
          <h3 class="text-base font-bold text-neutral-900 mb-4 pb-3 border-b border-neutral-200">
            {{ $t('home.mostRead') }}
          </h3>
          <MostReadList :limit="5" />
        </div>

        <!-- Social media -->
        <div class="card p-4">
          <h3 class="text-base font-bold text-neutral-900 mb-4 pb-3 border-b border-neutral-200">
            {{ $t('footer.followUs') }}
          </h3>
          <div class="grid grid-cols-3 gap-2">
            <a
              v-for="social in socialLinks"
              :key="social.name"
              :href="social.url"
              target="_blank"
              rel="noopener noreferrer"
              class="flex flex-col items-center gap-1 px-2 py-3 rounded-lg text-xs font-medium transition-colors"
              :class="social.bgClass"
            >
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path :d="social.iconPath" />
              </svg>
              <span>{{ social.name }}</span>
            </a>
          </div>
        </div>
      </aside>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Article } from '~/types/article'
import BaseBadge from '~/components/ui/BaseBadge.vue'
import BaseSkeleton from '~/components/ui/BaseSkeleton.vue'
import BasePagination from '~/components/ui/BasePagination.vue'
import BaseEmptyState from '~/components/ui/BaseEmptyState.vue'
import MostReadList from '~/components/article/MostReadList.vue'
import AdPlacement from '~/components/ads/AdPlacement.vue'

defineProps<{
  articles: Article[]
  loading?: boolean
  currentPage?: number
  totalPages?: number
}>()

defineEmits<{
  pageChange: [page: number]
}>()

const localePath = useLocalePath()
const { locale } = useI18n()

function formatDateShort(date: string) {
  if (!date) return ''
  return new Date(date).toLocaleDateString(
    locale.value === 'rw' ? 'rw-RW' : locale.value === 'fr' ? 'fr-FR' : 'en-US',
    { year: 'numeric', month: 'short', day: 'numeric' }
  )
}

const socialLinks = [
  {
    name: 'YouTube',
    url: 'https://www.youtube.com/@THESTRUGGLESOFSINGLESMOTHERS',
    bgClass: 'bg-red-50 text-red-600 hover:bg-red-100',
    iconPath: 'M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/nolinda_belle?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
    bgClass: 'bg-pink-50 text-pink-600 hover:bg-pink-100',
    iconPath: 'M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 01-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 017.8 2m.2 2A3.6 3.6 0 004.4 8v8a3.6 3.6 0 003.6 3.6h8a3.6 3.6 0 003.6-3.6V8A3.6 3.6 0 0016 4.4H8m9.65 1.5a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5M12 7a5 5 0 110 10 5 5 0 010-10m0 2a3 3 0 100 6 3 3 0 000-6z',
  },
  {
    name: 'WhatsApp',
    url: 'https://wa.me/250726268780',
    bgClass: 'bg-green-50 text-green-600 hover:bg-green-100',
    iconPath: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347',
  },
]
</script>
