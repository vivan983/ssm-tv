<template>
  <div v-if="breakingArticles.length > 0" class="bg-red-700 text-white overflow-hidden">
    <div class="container-main flex items-center h-9 gap-3">
      <span class="flex-shrink-0 text-xs font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded">
        {{ $t('home.breakingNews') }}
      </span>
      <div class="overflow-hidden flex-1 relative h-full flex items-center">
        <!-- BUG FIX: Content is rendered twice so the CSS marquee animation
             (translateX(-50%)) shows continuous scrolling without blank space.
             The second copy fills the gap as the first scrolls off-screen. -->
        <div class="animate-marquee whitespace-nowrap text-sm flex">
          <span class="breaking-ticker-track">
            <template v-for="article in breakingArticles" :key="article.id">
              <NuxtLink
                :to="localePath(`/article/${article.slug}`)"
                class="hover:underline mx-4"
              >
                • {{ article.title }}
              </NuxtLink>
            </template>
          </span>
          <!-- Duplicate for seamless infinite scroll -->
          <span class="breaking-ticker-track" aria-hidden="true">
            <template v-for="article in breakingArticles" :key="`dup-${article.id}`">
              <NuxtLink
                :to="localePath(`/article/${article.slug}`)"
                class="hover:underline mx-4"
                tabindex="-1"
              >
                • {{ article.title }}
              </NuxtLink>
            </template>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const localePath = useLocalePath()

// In production, fetch from API/store
// For now, placeholder - will be populated from the articles store
const breakingArticles = ref<Array<{ id: string; slug: string; title: string }>>([])

// Fetch breaking/urgent articles on mount
onMounted(async () => {
  try {
    const { data } = await useFetch('/api/articles', {
      query: { featured: 'true', perPage: 3 },
    })
    if (data.value?.data) {
      breakingArticles.value = data.value.data
    }
  } catch {
    // Silently fail - breaking news bar is non-critical
  }
})
</script>

<style scoped>
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.animate-marquee {
  animation: marquee 30s linear infinite;
}
.breaking-ticker-track {
  flex-shrink: 0;
}
</style>
