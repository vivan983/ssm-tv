<template>
  <nav v-if="totalPages > 1" class="flex items-center justify-center gap-1" aria-label="Pagination">
    <!-- Previous -->
    <button
      :disabled="currentPage <= 1"
      class="px-3 py-2 text-sm rounded-lg border border-neutral-300 text-neutral-600 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      @click="$emit('change', currentPage - 1)"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
    </button>

    <!-- Pages -->
    <button
      v-for="page in visiblePages"
      :key="page"
      :disabled="page === '...'"
      class="min-w-[2.25rem] h-9 text-sm rounded-lg transition-colors"
      :class="
        page === currentPage
          ? 'bg-green-600 text-white font-semibold'
          : page === '...'
            ? 'text-neutral-400 cursor-default'
            : 'border border-neutral-300 text-neutral-600 hover:bg-neutral-50'
      "
      @click="page !== '...' && $emit('change', (page as number))"
    >
      {{ page }}
    </button>

    <!-- Next -->
    <button
      :disabled="currentPage >= totalPages"
      class="px-3 py-2 text-sm rounded-lg border border-neutral-300 text-neutral-600 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      @click="$emit('change', currentPage + 1)"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </nav>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    currentPage: number
    totalPages: number
    maxVisible?: number
  }>(),
  { maxVisible: 7 }
)

defineEmits<{ change: [page: number] }>()

const visiblePages = computed(() => {
  const pages: (number | string)[] = []
  const half = Math.floor(props.maxVisible / 2)
  let start = Math.max(1, props.currentPage - half)
  const end = Math.min(props.totalPages, start + props.maxVisible - 1)

  if (end - start + 1 < props.maxVisible) {
    start = Math.max(1, end - props.maxVisible + 1)
  }

  if (start > 1) {
    pages.push(1)
    if (start > 2) pages.push('...')
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  if (end < props.totalPages) {
    if (end < props.totalPages - 1) pages.push('...')
    pages.push(props.totalPages)
  }

  return pages
})
</script>
