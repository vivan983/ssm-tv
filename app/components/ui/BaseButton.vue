<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
      sizeClasses,
      variantClasses,
      fullWidth ? 'w-full' : '',
      disabled || loading ? 'opacity-50 cursor-not-allowed' : '',
    ]"
  >
    <LoadingSpinner v-if="loading" :size="spinnerSize" />
    <slot v-else name="icon-before" />
    <slot />
    <slot name="icon-after" />
  </button>
</template>

<script setup lang="ts">
import LoadingSpinner from './LoadingSpinner.vue'

const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
    loading?: boolean
    fullWidth?: boolean
  }>(),
  {
    variant: 'primary',
    size: 'md',
    type: 'button',
    disabled: false,
    loading: false,
    fullWidth: false,
  }
)

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'px-3 py-1.5 text-sm rounded-md'
    case 'lg':
      return 'px-6 py-3 text-base rounded-md'
    default:
      return 'px-4 py-2.5 text-sm rounded-md'
  }
})

const spinnerSize = computed(() => (props.size === 'sm' ? 'sm' : 'md'))

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'secondary':
      return 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
    case 'outline':
      return 'border-2 border-green-600 text-green-600 hover:bg-green-50 focus:ring-green-500'
    case 'ghost':
      return 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 focus:ring-neutral-500'
    case 'danger':
      return 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
    default:
      return 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
  }
})
</script>
