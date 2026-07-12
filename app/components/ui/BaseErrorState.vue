<template>
  <div class="flex flex-col items-center justify-center py-16 text-center">
    <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    </div>
    <h3 class="text-base font-semibold text-neutral-700 mb-1">{{ title || $t('errors.serverError') }}</h3>
    <p class="text-sm text-neutral-500 max-w-xs mb-4">{{ message }}</p>
    <BaseButton variant="outline" size="sm" @click="$emit('retry')">
      {{ $t('errors.retry') }}
    </BaseButton>
  </div>
</template>

<script setup lang="ts">
import BaseButton from './BaseButton.vue'

defineProps<{
  title?: string
  message?: string
}>()

defineEmits<{ retry: [] }>()
</script>
