<template>
  <aside class="space-y-6">
    <!-- Most Read -->
    <div class="card p-4">
      <h3 class="text-lg font-bold text-neutral-900 mb-4 pb-3 border-b border-neutral-200">
        {{ $t('home.mostRead') }}
      </h3>
      <MostReadList :limit="5" />
    </div>

    <!-- Social Follow -->
    <div class="card p-4">
      <h3 class="text-lg font-bold text-neutral-900 mb-4 pb-3 border-b border-neutral-200">
        {{ $t('footer.followUs') }}
      </h3>
      <div class="grid grid-cols-2 gap-2">
        <a
          v-for="social in socials"
          :key="social.name"
          :href="social.url"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
          :class="social.bgClass"
        >
          <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path :d="social.iconPath" />
          </svg>
          <span>{{ social.name }}</span>
        </a>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import MostReadList from '~/components/article/MostReadList.vue'

const socials = [
  {
    name: 'YouTube',
    url: 'https://www.youtube.com/@THESTRUGGLESOFSINGLESMOTHERS',
    bgClass: 'bg-red-50 text-red-600 hover:bg-red-100',
    iconPath: 'M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  },
  {
    name: 'Twitter',
    url: 'https://twitter.com/ssmtv',
    bgClass: 'bg-blue-50 text-blue-500 hover:bg-blue-100',
    iconPath: 'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z',
  },
  {
    name: 'Facebook',
    url: 'https://facebook.com/ssmtv',
    bgClass: 'bg-blue-50 text-blue-700 hover:bg-blue-100',
    iconPath: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z',
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/nolinda_belle?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
    bgClass: 'bg-pink-50 text-pink-600 hover:bg-pink-100',
    iconPath: 'M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 01-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 017.8 2m.2 2A3.6 3.6 0 004.4 8v8a3.6 3.6 0 003.6 3.6h8a3.6 3.6 0 003.6-3.6V8A3.6 3.6 0 0016 4.4H8m9.65 1.5a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5M12 7a5 5 0 110 10 5 5 0 010-10m0 2a3 3 0 100 6 3 3 0 000-6z',
  },
]
</script>
