<template>
  <section v-if="!loading && articles.length > 0" class="mb-10">
    <!-- Section heading -->
    <h2 class="text-xl lg:text-2xl font-extrabold text-neutral-900 mb-5 pb-3 border-b-2 border-green-600">
      {{ title }}
    </h2>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <!-- Lead article (larger, with excerpt) — spans 2 cols -->
      <div class="lg:col-span-2">
        <article class="card group overflow-hidden h-full">
          <div class="relative aspect-[16/9] overflow-hidden">
            <NuxtLink :to="localePath(`/article/${articles[0].slug}`)" class="block h-full">
              <img
                v-if="articles[0].featured_image"
                :src="articles[0].featured_image"
                :alt="articles[0].title"
                class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <div v-else class="w-full h-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
                <span class="text-4xl font-black text-white/30">SSM</span>
              </div>
            </NuxtLink>
            <BaseBadge
              v-if="articles[0].category"
              variant="green"
              class="absolute top-3 left-3 z-10"
            >
              {{ articles[0].category.name }}
            </BaseBadge>
          </div>
          <div class="p-5">
            <NuxtLink :to="localePath(`/article/${articles[0].slug}`)">
              <h3 class="text-lg lg:text-xl font-bold text-neutral-800 group-hover:text-green-700 transition-colors mb-2 line-clamp-2">
                {{ articles[0].title }}
              </h3>
            </NuxtLink>
            <p v-if="articles[0].excerpt" class="text-sm text-neutral-500 line-clamp-3 mb-3">
              {{ articles[0].excerpt }}
            </p>
            <div class="text-xs text-neutral-500">
              {{ formatDateShort(articles[0].published_at) }}
            </div>
          </div>
        </article>
      </div>

      <!-- Vertical list of remaining articles (up to 2) — 1 col -->
      <div class="flex flex-col gap-4">
        <article
          v-for="a in articles.slice(1, 3)"
          :key="a.id"
          class="card group overflow-hidden flex gap-3 p-3"
        >
          <div class="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-neutral-200">
            <NuxtLink :to="localePath(`/article/${a.slug}`)" class="block h-full">
              <img
                v-if="a.featured_image"
                :src="a.featured_image"
                :alt="a.title"
                class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <div v-else class="w-full h-full bg-gradient-to-br from-green-300 to-blue-400 flex items-center justify-center">
                <span class="text-xs font-black text-white/30">SSM</span>
              </div>
            </NuxtLink>
          </div>
          <div class="flex-1 min-w-0">
            <BaseBadge
              v-if="a.category"
              variant="green"
              size="xs"
              class="mb-1"
            >
              {{ a.category.name }}
            </BaseBadge>
            <NuxtLink :to="localePath(`/article/${a.slug}`)">
              <h4 class="text-sm font-semibold text-neutral-800 group-hover:text-green-700 transition-colors line-clamp-2">
                {{ a.title }}
              </h4>
            </NuxtLink>
          </div>
        </article>
      </div>
    </div>
  </section>

  <!-- Loading skeleton -->
  <section v-else-if="loading" class="mb-10">
    <BaseSkeleton variant="title" class="w-48 mb-5" />
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div class="lg:col-span-2">
        <div class="card overflow-hidden">
          <BaseSkeleton variant="image" class="aspect-[16/9]" />
          <div class="p-5 space-y-3">
            <BaseSkeleton variant="title" />
            <BaseSkeleton variant="text" />
            <BaseSkeleton variant="text" />
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-4">
        <div v-for="i in 2" :key="i" class="card flex gap-3 p-3">
          <BaseSkeleton variant="text" width="96px" height="96px" />
          <div class="flex-1 space-y-2">
            <BaseSkeleton variant="title" />
            <BaseSkeleton variant="text" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Article } from '~/types/article'
import BaseBadge from '~/components/ui/BaseBadge.vue'
import BaseSkeleton from '~/components/ui/BaseSkeleton.vue'

defineProps<{
  title: string
  articles: Article[]
  loading?: boolean
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
</script>
