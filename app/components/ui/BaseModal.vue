<template>
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
        v-if="open"
        class="fixed inset-0 z-modal flex items-center justify-center p-4 bg-black/50"
        @click.self="closeOnOverlay && $emit('close')"
      >
        <Transition
          enter-active-class="transition ease-out duration-200"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition ease-in duration-150"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div v-if="open" class="bg-white rounded-lg shadow-xl w-full max-h-[90vh] flex flex-col" :class="sizeClasses">
            <div class="flex items-center justify-between px-6 py-4 border-b border-neutral-200 flex-shrink-0">
              <h3 class="text-lg font-semibold text-neutral-900">{{ title }}</h3>
              <button
                class="p-1.5 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
                @click="$emit('close')"
              >
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div class="px-6 py-4 overflow-y-auto flex-1">
              <slot />
            </div>
            <div v-if="$slots.footer" class="px-6 py-4 border-t border-neutral-200 flex justify-end gap-3 flex-shrink-0">
              <slot name="footer" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
// BUG FIX #1: defineProps() was being called a SECOND time inside the computed() below.
// In Vue 3 <script setup>, defineProps() is a compiler macro hoisted to the top.
// Calling it again inside computed() can cause runtime errors, breaking the entire
// component and any parent that uses it (including the admin Ingingo page).
// Fix: Store props in a variable and reference it inside computed().
const props = withDefaults(
  defineProps<{
    open: boolean
    title?: string
    size?: 'sm' | 'md' | 'lg' | 'xl'
    closeOnOverlay?: boolean
  }>(),
  { size: 'md', closeOnOverlay: true }
)

defineEmits<{ close: [] }>()

// BUG FIX #1 (continued): Now correctly references the props variable instead of
// calling defineProps() again, which previously broke this component entirely.
const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'max-w-sm'
    case 'lg':
      return 'max-w-lg'
    case 'xl':
      return 'max-w-xl'
    default:
      return 'max-w-md'
  }
})
</script>
