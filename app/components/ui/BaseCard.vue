<template>
  <div
    class="bg-white rounded-lg border border-neutral-200 shadow-card transition-all duration-200"
    :class="[
      paddingClasses,
      hover ? 'hover:shadow-card-hover hover:border-neutral-300' : '',
      clickable ? 'cursor-pointer' : '',
    ]"
  >
    <div v-if="$slots.header" class="border-b border-neutral-100 px-4 py-3">
      <slot name="header" />
    </div>
    <slot />
    <div v-if="$slots.footer" class="border-t border-neutral-100 px-4 py-3">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
// BUG FIX: Store props in a variable instead of calling defineProps()
// again inside computed(). In Vue 3 <script setup>, defineProps() is a
// compiler macro hoisted to the top — calling it a second time at runtime
// inside computed() causes undefined behavior and component crashes.
const props = withDefaults(
  defineProps<{
    padding?: 'none' | 'sm' | 'md' | 'lg'
    hover?: boolean
    clickable?: boolean
  }>(),
  {
    padding: 'md',
    hover: false,
    clickable: false,
  }
)

const paddingClasses = computed(() => {
  switch (props.padding) {
    case 'none':
      return ''
    case 'sm':
      return 'p-3'
    case 'lg':
      return 'p-6'
    default:
      return 'p-4'
  }
})
</script>
