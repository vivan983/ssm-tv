<template>
  <TransitionGroup
    tag="div"
    class="fixed bottom-6 right-6 z-toast flex flex-col gap-2 max-w-sm"
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0 translate-y-4 scale-95"
    enter-to-class="opacity-100 translate-y-0 scale-100"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-4"
  >
    <div
      v-for="toast in toasts"
      :key="toast.id"
      class="flex items-start gap-3 p-4 rounded-lg shadow-lg border"
      :class="toastClasses(toast.type)"
      role="alert"
    >
      <!-- Icon -->
      <svg v-if="toast.type === 'success'" class="h-5 w-5 flex-shrink-0 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <svg v-else-if="toast.type === 'error'" class="h-5 w-5 flex-shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <svg v-else class="h-5 w-5 flex-shrink-0 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>

      <p class="text-sm flex-1">{{ toast.message }}</p>

      <button
        v-if="toast.dismissible !== false"
        class="flex-shrink-0 text-neutral-400 hover:text-neutral-600 transition-colors"
        @click="removeToast(toast.id)"
      >
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </TransitionGroup>
</template>

<script setup lang="ts">
import { useUiStore } from '~/stores/ui'
import type { Toast } from '~/stores/ui'

const uiStore = useUiStore()

const toasts = computed(() => uiStore.toasts)

function toastClasses(type: Toast['type']) {
  switch (type) {
    case 'success':
      return 'bg-green-50 border-green-200 text-green-800'
    case 'error':
      return 'bg-red-50 border-red-200 text-red-800'
    case 'warning':
      return 'bg-yellow-50 border-yellow-200 text-yellow-800'
    default:
      return 'bg-blue-50 border-blue-200 text-blue-800'
  }
}

function removeToast(id: string) {
  uiStore.removeToast(id)
}

// Auto-dismiss toasts
watch(
  () => toasts.value.length,
  () => {
    toasts.value.forEach((t) => {
      if (t.duration !== 0) {
        setTimeout(() => removeToast(t.id), t.duration || 4000)
      }
    })
  }
)
</script>
