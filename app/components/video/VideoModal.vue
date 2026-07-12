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
        class="fixed inset-0 z-modal flex items-center justify-center p-4 bg-black/80"
        @click.self="close"
        @keydown.escape="close"
      >
        <!-- Modal panel -->
        <Transition
          enter-active-class="transition ease-out duration-200"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition ease-in duration-150"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="open"
            class="relative w-full max-w-4xl bg-black rounded-xl overflow-hidden shadow-2xl"
          >
            <!-- Close button -->
            <button
              class="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
              @click="close"
              aria-label="Close video"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <!-- Video player -->
            <div class="aspect-video">
              <iframe
                :src="embedUrl"
                class="w-full h-full"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
                :title="title"
              ></iframe>
            </div>

            <!-- Info bar -->
            <div class="bg-white px-5 py-4">
              <h3 class="text-base lg:text-lg font-bold text-neutral-900">
                {{ title }}
              </h3>
              <p v-if="channelTitle" class="text-sm text-neutral-500 mt-0.5">
                {{ channelTitle }}
              </p>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
  open: boolean
  videoId: string
  title: string
  channelTitle?: string
}>()

const emit = defineEmits<{
  close: []
}>()

const { public: { siteUrl } } = useRuntimeConfig()

const embedUrl = computed(() => {
  const origin = encodeURIComponent(siteUrl || 'https://ssmtv.rw')
  return `https://www.youtube.com/embed/${props.videoId}?autoplay=1&rel=0&origin=${origin}`
})

function close() {
  emit('close')
}

// Lock body scroll when modal is open
watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }
)

onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>
