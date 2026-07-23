<!-- =====================================================================
     BBC NEWS-STYLE SHARE BUTTONS
     Clean gray circular icons with hover states.
     BBC uses minimal, unobtrusive share icons — no text labels,
     just recognizable icon silhouettes. Default gray, color on hover.
     ===================================================================== -->
<template>
  <div class="bbc-shares">
    <!-- Facebook -->
    <button
      class="bbc-share-btn"
      @click="share(sharePlatforms[0])"
      :aria-label="sharePlatforms[0].name"
      title="Share on Facebook"
    >
      <svg class="bbc-share-svg" viewBox="0 0 24 24" fill="currentColor">
        <path :d="sharePlatforms[0].icon" />
      </svg>
    </button>

    <!-- Twitter / X -->
    <button
      class="bbc-share-btn"
      @click="share(sharePlatforms[1])"
      :aria-label="sharePlatforms[1].name"
      title="Share on X (Twitter)"
    >
      <svg class="bbc-share-svg" viewBox="0 0 24 24" fill="currentColor">
        <path :d="sharePlatforms[1].icon" />
      </svg>
    </button>

    <!-- WhatsApp -->
    <button
      class="bbc-share-btn"
      @click="share(sharePlatforms[2])"
      :aria-label="sharePlatforms[2].name"
      title="Share on WhatsApp"
    >
      <svg class="bbc-share-svg" viewBox="0 0 24 24" fill="currentColor">
        <path :d="sharePlatforms[2].icon" />
      </svg>
    </button>

    <!-- Copy link -->
    <button
      class="bbc-share-btn bbc-share-copy"
      @click="copyLink"
      aria-label="Copy link"
      title="Copy link to clipboard"
    >
      <!-- Link chain icon -->
      <svg
        v-if="!copied"
        class="bbc-share-svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
        />
      </svg>
      <!-- Checkmark when copied -->
      <svg
        v-else
        class="bbc-share-svg bbc-share-copied"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
// =====================================================================
// BBC-STYLE SHARE BUTTONS — SCRIPT
// Each button opens a platform-specific share popup (or copies the
// article URL to clipboard). Icons are inline SVG paths for zero
// external dependencies and instant rendering.
// =====================================================================
const props = defineProps<{
  url?: string
  title?: string
}>()

const copied = ref(false)

// Resolve the share URL — use prop if provided, fallback to window.location
const shareUrl = computed(
  () => props.url || (typeof window !== 'undefined' ? window.location.href : '')
)
const shareTitle = computed(() => props.title || '')

// Share platform definitions with inline SVG icon paths.
// These are the three key platforms BBC prominently supports.
const sharePlatforms = [
  {
    name: 'Facebook',
    icon: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z',
    getUrl: () =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl.value)}`,
  },
  {
    name: 'Twitter',
    icon: 'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z',
    getUrl: () =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl.value)}&text=${encodeURIComponent(shareTitle.value)}`,
  },
  {
    name: 'WhatsApp',
    icon: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z',
    getUrl: () =>
      `https://wa.me/?text=${encodeURIComponent(shareTitle.value + ' ' + shareUrl.value)}`,
  },
]

// -------------------------------------------------------------------
// Open platform share URL in a centered popup window (BBC-style).
// The popup is 600×400, centered on screen for desktop users.
// -------------------------------------------------------------------
function share(platform: (typeof sharePlatforms)[number]) {
  const left = Math.round((window.screen.width - 600) / 2)
  const top = Math.round((window.screen.height - 400) / 2)
  window.open(
    platform.getUrl(),
    '_blank',
    `width=600,height=400,left=${left},top=${top}`
  )
}

// -------------------------------------------------------------------
// Copy article URL to clipboard with fallback for older browsers.
// Shows a brief checkmark animation on success (2s).
// -------------------------------------------------------------------
async function copyLink() {
  try {
    await navigator.clipboard.writeText(shareUrl.value)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch {
    // Fallback for older browsers / non-HTTPS origins
    const input = document.createElement('input')
    input.value = shareUrl.value
    document.body.appendChild(input)
    input.select()
    document.execCommand('copy')
    document.body.removeChild(input)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  }
}
</script>

<!-- =====================================================================
     BBC NEWS-STYLE SHARE BUTTON STYLES
     Clean circular buttons, 36×36px, gray default → color on hover.
     BBC's share icons are understated — they blend into the meta row
     rather than competing with the headline.
     ===================================================================== -->
<style scoped>
/* ===================================================================
   BBC-STYLE SHARE BUTTONS
   Clean circular buttons, 36x36px, gray default, color on hover.
   =================================================================== */

/* Container — horizontal row with 6px gaps */
.bbc-shares {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

/* Individual share button — 36px circle, subtle gray */
.bbc-share-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid #d1d5db;
  background: #f9fafb;
  color: #6b7280;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
  padding: 0;
}

.bbc-share-btn:hover {
  background: #e5e7eb;
  color: var(--text-heading);
  border-color: #9ca3af;
}

.bbc-share-btn:active {
  background: #d1d5db;
  transform: scale(0.95);
}

/* SVG icon inside each button */
.bbc-share-svg {
  width: 16px;
  height: 16px;
  display: block;
}

/* Green checkmark when link is copied */
.bbc-share-copied {
  color: #16a34a;
}
</style>
