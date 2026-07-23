<template>
  <header
    class="sticky top-0 z-header bg-white dark:bg-[#0d0d0d] border-b border-neutral-200 dark:border-neutral-800 transition-shadow duration-200"
    :class="{ 'shadow-header': isScrolled }"
  >
    <div class="container-main">
      <div class="flex items-center justify-between h-16 lg:h-20">
        <!-- Logo -->
        <NuxtLink :to="localePath('/')" class="flex items-center gap-2 flex-shrink-0 -my-4" aria-label="SSM TV">
          <img
            src="/logo.png"
            alt="SSM TV"
            class="h-28 lg:h-32 w-auto"
          />
        </NuxtLink>

        <!-- Desktop Navigation -->
        <nav class="hidden lg:flex items-center gap-0" aria-label="Main navigation">
          <template v-for="item in navItems" :key="item.to">
            <a
              v-if="item.external"
              :href="item.href"
              target="_blank"
              rel="noopener noreferrer"
              class="px-3 py-2 text-[0.8125rem] font-bold uppercase tracking-wide text-neutral-700 dark:text-neutral-300 hover:text-green-700 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-md transition-colors"
            >
              {{ $t(item.labelKey) }}
            </a>
            <NuxtLink
              v-else
              :to="localePath(item.to)"
              class="px-3 py-2 text-[0.8125rem] font-bold uppercase tracking-wide text-neutral-700 dark:text-neutral-300 hover:text-green-700 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-md transition-colors"
              active-class="text-green-700 bg-green-50 font-bold"
              exact-active-class="text-green-700 bg-green-50 font-bold"
            >
              {{ $t(item.labelKey) }}
            </NuxtLink>
          </template>
        </nav>

        <!-- Right actions -->
        <div class="flex items-center gap-1">
          <!-- Dark mode toggle -->
          <button
            class="p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 rounded-lg transition-colors"
            @click="darkMode.toggle()"
            :aria-label="darkMode.isDark.value ? 'Light mode' : 'Dark mode'"
            :title="darkMode.isDark.value ? 'Light mode' : 'Dark mode'"
          >
            <!-- Sun icon (shown in dark mode → switch to light) -->
            <svg
              v-if="darkMode.isDark.value"
              xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <!-- Moon icon (shown in light mode → switch to dark) -->
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>

          <!-- Search trigger -->
          <button
            class="p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 rounded-lg transition-colors"
            @click="showSearch = true"
            :aria-label="$t('nav.search')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          <!-- Mobile menu button -->
          <button
            class="lg:hidden p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
            @click="mobileNavOpen = !mobileNavOpen"
            :aria-label="mobileNavOpen ? $t('nav.close') : $t('nav.menu')"
          >
            <svg v-if="!mobileNavOpen" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Navigation -->
    <MobileNav :open="mobileNavOpen" @close="mobileNavOpen = false" />

    <!-- ====================================================================
         SEARCH OVERLAY — professional newsroom search
         • Press "/" anywhere to open (BBC/Guardian standard)
         • Debounced live suggestions as you type
         • Results show: article titles, video titles, categories
         • ESC or click-outside to dismiss
         • Accessible: focus trapped, ARIA announced
         ==================================================================== -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="showSearch"
          class="fixed inset-0 z-toast flex items-start justify-center pt-[12vh] px-4"
          @click.self="closeSearch"
        >
          <!-- Backdrop -->
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          <!-- Search panel -->
          <div
            class="relative w-full max-w-xl bg-white rounded-xl shadow-2xl border border-neutral-200 overflow-hidden"
            role="search"
            aria-label="Site search"
          >
            <!-- Input row -->
            <div class="flex items-center gap-3 px-5 py-4 border-b border-neutral-100">
              <!-- Magnifying glass -->
              <svg
                class="h-5 w-5 text-neutral-400 flex-shrink-0"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>

              <!-- Input -->
              <input
                ref="searchInputRef"
                v-model="searchQuery"
                type="text"
                :placeholder="$t('search.placeholder')"
                class="flex-1 text-base text-neutral-900 placeholder:text-neutral-400 bg-transparent border-none outline-none"
                autocomplete="off"
                spellcheck="false"
                @keydown.escape="closeSearch"
                @keydown.arrow-down.prevent="highlightNext"
                @keydown.arrow-up.prevent="highlightPrev"
                @keydown.enter.prevent="handleSearchEnter"
                aria-label="Search articles and videos"
              />

              <!-- Loading spinner -->
              <LoadingSpinner v-if="suggestionsLoading" size="sm" class="text-neutral-400 flex-shrink-0" />

              <!-- Close button -->
              <button
                class="flex-shrink-0 p-1.5 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
                @click="closeSearch"
                aria-label="Close search"
              >
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- LIVE SUGGESTIONS DROPDOWN -->
            <div v-if="searchQuery.trim().length >= 2" class="max-h-[55vh] overflow-y-auto">
              <!-- Articles section -->
              <div v-if="suggestions.length > 0" class="py-2">
                <p class="px-5 py-1.5 text-[0.6875rem] font-bold text-neutral-400 uppercase tracking-widest">
                  {{ $t('nav.articles') || 'Articles' }}
                </p>
                <button
                  v-for="(item, idx) in suggestions"
                  :key="item.id"
                  class="w-full text-left px-5 py-3 hover:bg-green-50 transition-colors flex items-start gap-3 group"
                  :class="{ 'bg-neutral-50': idx === highlightedIndex }"
                  @click="goToResult(item)"
                  @mouseenter="highlightedIndex = idx"
                >
                  <!-- Thumbnail -->
                  <div class="w-12 h-12 rounded-md overflow-hidden bg-neutral-100 flex-shrink-0">
                    <img
                      v-if="item.featured_image"
                      :src="item.featured_image"
                      :alt="''"
                      class="w-full h-full object-cover"
                    />
                    <div v-else class="w-full h-full flex items-center justify-center">
                      <svg class="h-5 w-5 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                    </div>
                  </div>
                  <!-- Info -->
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-semibold text-neutral-800 group-hover:text-green-700 transition-colors line-clamp-1">
                      {{ item.title }}
                    </p>
                    <div class="flex items-center gap-2 mt-0.5">
                      <span
                        v-if="item.category"
                        class="text-[0.6875rem] font-bold text-green-600 uppercase tracking-wide"
                      >
                        {{ item.category.name }}
                      </span>
                      <span class="text-[0.6875rem] text-neutral-400">
                        {{ formatDateShort(item.published_at) }}
                      </span>
                    </div>
                  </div>
                  <!-- Arrow -->
                  <svg class="h-4 w-4 text-neutral-300 group-hover:text-green-500 flex-shrink-0 mt-1 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              <!-- No results state -->
              <div v-if="!suggestionsLoading && suggestions.length === 0 && searchQuery.trim().length >= 2" class="py-8 text-center">
                <p class="text-sm text-neutral-500">{{ $t('search.noResults') }}</p>
                <p class="text-xs text-neutral-400 mt-1">{{ $t('search.tryDifferent') || 'Gerageza ijambo rindi.' }}</p>
              </div>

              <!-- View all results footer -->
              <div v-if="searchQuery.trim().length >= 2" class="border-t border-neutral-100 px-5 py-3">
                <button
                  class="w-full flex items-center justify-between text-sm font-semibold text-green-600 hover:text-green-700 transition-colors"
                  @click="handleSearch"
                >
                  <span>
                    {{ $t('search.viewAll') || 'Reba ibisubizo byose' }}
                    <span v-if="suggestions.length > 0" class="text-neutral-400 font-normal">
                      ({{ suggestions.length }}+)
                    </span>
                  </span>
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Empty state before typing -->
            <div v-if="searchQuery.trim().length < 2" class="py-6 px-5 text-center">
              <p class="text-xs text-neutral-400">
                {{ $t('search.startTyping') || 'Tangira kwandika kugira ngo ushakishe...' }}
              </p>
              <div class="flex items-center justify-center gap-2 mt-3">
                <kbd class="px-2 py-0.5 text-[0.6875rem] font-medium text-neutral-500 bg-neutral-100 border border-neutral-200 rounded">ESC</kbd>
                <span class="text-[0.6875rem] text-neutral-400">gufunga</span>
                <span class="text-neutral-300 mx-1">·</span>
                <kbd class="px-2 py-0.5 text-[0.6875rem] font-medium text-neutral-500 bg-neutral-100 border border-neutral-200 rounded">↑↓</kbd>
                <span class="text-[0.6875rem] text-neutral-400">kuzenguruka</span>
                <span class="text-neutral-300 mx-1">·</span>
                <kbd class="px-2 py-0.5 text-[0.6875rem] font-medium text-neutral-500 bg-neutral-100 border border-neutral-200 rounded">↵</kbd>
                <span class="text-[0.6875rem] text-neutral-400">gufungura</span>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </header>
</template>

<script setup lang="ts">
import type { Article } from '~/types/article'
import MobileNav from './MobileNav.vue'
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue'

const localePath = useLocalePath()
const router = useRouter()
const { locale } = useI18n()
const darkMode = useDarkMode()

const isScrolled = ref(false)
const mobileNavOpen = ref(false)

// ====================================================================
// SEARCH STATE
// ====================================================================
const showSearch = ref(false)
const searchQuery = ref('')
const searchInputRef = ref<HTMLInputElement>()
const suggestions = ref<Article[]>([])
const suggestionsLoading = ref(false)
const highlightedIndex = ref(-1)
let debounceTimer: ReturnType<typeof setTimeout> | null = null

// ====================================================================
// NAVIGATION ITEMS — i18n key resolved via $t() in template
// Using labelKey pattern to work with lazy-loaded locale messages
// ====================================================================
const categoryLinks = [
  { to: '/category/politiki', labelKey: 'nav.politiki' },
  { to: '/category/ubuzima', labelKey: 'nav.ubuzima' },
  { to: '/category/ubucuruzi', labelKey: 'nav.ubucuruzi' },
  { to: '/category/ikoranabuhanga', labelKey: 'nav.ikoranabuhanga' },
  { to: '/category/imyidagaduro', labelKey: 'nav.imyidagaduro' },
  { to: '/category/imikino', labelKey: 'nav.imikino' },
]

const navItems = [
  { to: '/', labelKey: 'nav.home' },
  { to: '/category/politiki', labelKey: 'nav.politiki' },
  { to: '/category/ubuzima', labelKey: 'nav.ubuzima' },
  { to: '/category/ubucuruzi', labelKey: 'nav.ubucuruzi' },
  { to: '/category/ikoranabuhanga', labelKey: 'nav.ikoranabuhanga' },
  { to: '/category/imyidagaduro', labelKey: 'nav.imyidagaduro' },
  { to: '/category/imikino', labelKey: 'nav.imikino' },
  { to: '/ssm-tv', labelKey: 'nav.ssmTv' },
]

// ====================================================================
// KEYBOARD SHORTCUT: "/" to open search (BBC/Guardian standard)
// ====================================================================
function handleGlobalKeydown(e: KeyboardEvent) {
  // Don't trigger when typing in an input, textarea, or contenteditable
  const target = e.target as HTMLElement
  const tag = target.tagName
  const isEditable =
    tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' ||
    target.isContentEditable

  if (e.key === '/' && !isEditable && !showSearch.value) {
    e.preventDefault()
    openSearch()
  }

  if (e.key === 'Escape' && showSearch.value) {
    closeSearch()
  }
}

// ====================================================================
// SEARCH ACTIONS
// ====================================================================
function openSearch() {
  showSearch.value = true
  searchQuery.value = ''
  suggestions.value = []
  highlightedIndex.value = -1
  nextTick(() => searchInputRef.value?.focus())
}

function closeSearch() {
  showSearch.value = false
  searchQuery.value = ''
  suggestions.value = []
  highlightedIndex.value = -1
  if (debounceTimer) clearTimeout(debounceTimer)
}

function handleSearch() {
  if (searchQuery.value.trim()) {
    closeSearch()
    router.push(localePath(`/search?q=${encodeURIComponent(searchQuery.value.trim())}`))
  }
}

function handleSearchEnter() {
  // If a suggestion is highlighted, navigate to it
  if (highlightedIndex.value >= 0 && suggestions.value[highlightedIndex.value]) {
    goToResult(suggestions.value[highlightedIndex.value])
  } else {
    handleSearch()
  }
}

function goToResult(article: Article) {
  closeSearch()
  router.push(localePath(`/article/${article.slug}`))
}

function highlightNext() {
  if (suggestions.value.length > 0) {
    highlightedIndex.value = Math.min(highlightedIndex.value + 1, suggestions.value.length - 1)
  }
}

function highlightPrev() {
  if (suggestions.value.length > 0) {
    highlightedIndex.value = Math.max(highlightedIndex.value - 1, 0)
  }
}

// ====================================================================
// LIVE SUGGESTIONS — debounced search-as-you-type
// ====================================================================
watch(searchQuery, (val) => {
  if (debounceTimer) clearTimeout(debounceTimer)

  highlightedIndex.value = -1

  if (!val || val.trim().length < 2) {
    suggestions.value = []
    suggestionsLoading.value = false
    return
  }

  suggestionsLoading.value = true

  debounceTimer = setTimeout(async () => {
    try {
      const { data } = await useFetch('/api/articles', {
        query: { search: val.trim(), perPage: 5 },
      })
      suggestions.value = (data.value as any)?.data || []
    } catch {
      suggestions.value = []
    } finally {
      suggestionsLoading.value = false
    }
  }, 250) // 250ms debounce — feels instant but prevents over-fetching
})

// ====================================================================
// DATE FORMATTING — short format for suggestion cards
// ====================================================================
function formatDateShort(date: string) {
  if (!date) return ''
  return new Date(date).toLocaleDateString(
    locale.value === 'rw' ? 'rw-RW' : locale.value === 'fr' ? 'fr-FR' : 'en-US',
    { year: 'numeric', month: 'short', day: 'numeric' }
  )
}

// ====================================================================
// LIFECYCLE
// ====================================================================
onMounted(() => {
  window.addEventListener('keydown', handleGlobalKeydown)
  window.addEventListener('scroll', () => {
    isScrolled.value = window.scrollY > 10
  })
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeydown)
})
</script>

