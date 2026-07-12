<template>
  <div class="flex flex-col items-center justify-center py-16 text-center">
    <div class="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
    </div>
    <h3 class="text-base font-semibold text-neutral-700 mb-1">{{ title }}</h3>
    <p class="text-sm text-neutral-500 max-w-xs">{{ message }}</p>
    <BaseButton v-if="actionLabel" variant="outline" size="sm" class="mt-4" @click="$emit('action')">
      {{ actionLabel }}
    </BaseButton>
  </div>
</template>

<script setup lang="ts">
import BaseButton from './BaseButton.vue'

defineProps<{
  title?: string
  message?: string
  actionLabel?: string
}>()

defineEmits<{ action: [] }>()
</script>
