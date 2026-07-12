<template>
  <div
    class="animate-pulse bg-neutral-200 rounded"
    :class="classes"
    :style="customStyle"
  />
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    variant?: 'text' | 'title' | 'image' | 'card' | 'circle' | 'avatar'
    width?: string
    height?: string
  }>(),
  { variant: 'text' }
)

const classes = computed(() => {
  switch (props.variant) {
    case 'title':
      return 'h-7 w-3/4'
    case 'image':
      return 'h-48 w-full'
    case 'card':
      return 'h-72 w-full'
    case 'circle':
      return 'h-12 w-12 rounded-full'
    case 'avatar':
      return 'h-10 w-10 rounded-full'
    default:
      return 'h-4 w-full'
  }
})

const customStyle = computed(() => {
  const style: Record<string, string> = {}
  if (props.width) style.width = props.width
  if (props.height) style.height = props.height
  return Object.keys(style).length > 0 ? style : undefined
})
</script>
