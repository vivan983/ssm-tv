<template>
  <span
    class="inline-flex items-center gap-1 rounded-full text-xs font-semibold transition-colors"
    :class="classes"
  >
    <slot />
  </span>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    variant?: 'green' | 'blue' | 'red' | 'neutral' | 'outline'
    size?: 'sm' | 'md'
  }>(),
  { variant: 'green', size: 'sm' }
)

const classes = computed(() => {
  const sizeClasses = props.size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
  const variantClasses = {
    green: 'bg-green-100 text-green-700',
    blue: 'bg-blue-100 text-blue-700',
    red: 'bg-red-100 text-red-700',
    neutral: 'bg-neutral-100 text-neutral-600',
    outline: 'border border-neutral-300 text-neutral-600 bg-transparent',
  }
  return `${sizeClasses} ${variantClasses[props.variant]}`
})
</script>
