<template>
  <div class="relative w-full overflow-hidden rounded-lg bg-black">
    <!-- Thumbnail / poster state -->
    <div
      v-if="!playing"
      class="relative aspect-video cursor-pointer group"
      @click="play"
      role="button"
      :aria-label="`Play: ${title}`"
      tabindex="0"
      @keydown.enter="play"
      @keydown.space.prevent="play"
    >
      <img
        :src="thumbnailUrl"
        :alt="title"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />
      <!-- Play button overlay -->
      <div
        class="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors"
      >
        <div
          class="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center shadow-2xl group-hover:bg-red-700 group-hover:scale-110 transition-all duration-200"
        >
          <svg class="h-7 w-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Embedded player -->
    <div v-else class="aspect-video">
      <iframe
        ref="iframeRef"
        :src="embedUrl"
        class="w-full h-full"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        :title="title"
        loading="lazy"
      ></iframe>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  videoId: string
  title: string
  thumbnailUrl: string
}>()

const emit = defineEmits<{
  play: []
  stop: []
}>()

const playing = ref(false)
const iframeRef = ref<HTMLIFrameElement>()

const { public: { siteUrl } } = useRuntimeConfig()

const embedUrl = computed(() => {
  const origin = encodeURIComponent(siteUrl || 'https://ssmtv.rw')
  return `https://www.youtube.com/embed/${props.videoId}?autoplay=1&rel=0&origin=${origin}`
})

function play() {
  playing.value = true
  emit('play')
}

function stop() {
  playing.value = false
  emit('stop')
}

// When parent calls closePlayer → remounts with new key
// The component starts fresh with playing=false (thumbnail state)
// No action needed here — Vue remount resets the ref

// When the parent swaps the videoId externally (e.g. clicking a grid card),
// auto-play the new video in the featured slot.
watch(
  () => props.videoId,
  (newId, oldId) => {
    if (newId && newId !== oldId) {
      playing.value = true
      emit('play')
    }
  }
)

defineExpose({ playing, play, stop })
</script>
