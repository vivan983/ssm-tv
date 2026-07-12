<template>
  <div v-if="visibleAds.length > 0" class="ad-placement" :class="`ad-placement--${placement}`">
    <p class="ad-label">{{ $t('ads.sponsored') || 'Kwamamaza' }}</p>

    <div v-for="ad in visibleAds" :key="ad.id" class="ad-unit">
      <a
        v-if="ad.destination_url"
        :href="ad.destination_url"
        target="_blank"
        rel="noopener sponsored nofollow"
        class="ad-link"
        @click="trackClick(ad)"
      >
        <img v-if="ad.desktop_image" :src="ad.desktop_image" :alt="ad.name" class="ad-img ad-img--desktop" loading="lazy" />
        <img v-if="ad.mobile_image" :src="ad.mobile_image" :alt="ad.name" class="ad-img ad-img--mobile" loading="lazy" />
        <img v-else-if="ad.desktop_image" :src="ad.desktop_image" :alt="ad.name" class="ad-img ad-img--mobile" loading="lazy" />
        <div v-if="!ad.desktop_image && !ad.mobile_image" class="ad-fallback">
          <span class="ad-fallback-name">{{ ad.name }}</span>
          <span class="ad-fallback-by">{{ ad.advertiser }}</span>
        </div>
      </a>
      <div v-else class="ad-static">
        <img v-if="ad.desktop_image" :src="ad.desktop_image" :alt="ad.name" class="ad-img ad-img--desktop" loading="lazy" />
        <div v-if="!ad.desktop_image" class="ad-fallback">
          <span class="ad-fallback-name">{{ ad.name }}</span>
          <span class="ad-fallback-by">{{ ad.advertiser }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Ad {
  id: string; name: string; advertiser: string
  desktop_image: string | null; mobile_image: string | null
  destination_url: string | null; placement: string
}

const props = withDefaults(defineProps<{
  placement: 'homepage_banner' | 'sidebar' | 'in_article' | 'footer_sponsor'
  limit?: number
}>(), { limit: 3 })

const visibleAds = ref<Ad[]>([])

onMounted(async () => {
  try {
    const { data } = await useFetch('/api/ads', {
      query: { placement: props.placement, limit: props.limit },
    })
    visibleAds.value = ((data.value as any)?.data || []) as Ad[]
    visibleAds.value.forEach(ad => {
      $fetch(`/api/ads/${ad.id}/impression`, { method: 'POST' }).catch(() => {})
    })
  } catch {}
})

function trackClick(ad: Ad) {
  $fetch(`/api/ads/${ad.id}/click`, { method: 'POST' }).catch(() => {})
}
</script>

<style scoped>
.ad-placement { margin: 0 auto; }

.ad-label {
  font-size: 0.6875rem; font-weight: 600; text-transform: uppercase;
  letter-spacing: 0.08em; color: #9ca3af; margin: 0 0 8px 0; text-align: center;
}

.ad-unit { margin-bottom: 16px; }
.ad-unit:last-child { margin-bottom: 0; }

.ad-link {
  display: block; text-decoration: none; border-radius: 6px;
  overflow: hidden; transition: box-shadow 0.2s ease;
}
.ad-link:hover { box-shadow: 0 2px 12px rgba(0,0,0,0.1); }
.ad-static { border-radius: 6px; overflow: hidden; }

.ad-img { display: block; width: 100%; height: auto; object-fit: cover; }
.ad-img--desktop { display: block; }
.ad-img--mobile { display: none; }
@media (max-width: 640px) {
  .ad-img--desktop { display: none; }
  .ad-img--mobile { display: block; }
}

/* Text fallback when no image */
.ad-fallback {
  padding: 28px 20px; text-align: center;
  background: linear-gradient(135deg, #f0fdf4, #dcfce7);
  border: 1px dashed #bbf7d0; border-radius: 6px;
}
.ad-fallback-name { display: block; font-size: 0.9375rem; font-weight: 800; color: #15803d; }
.ad-fallback-by { display: block; font-size: 0.75rem; color: #6b7280; margin-top: 4px; }

/* Placement variants */
.ad-placement--homepage_banner { max-width: 1280px; padding: 0 16px 32px 16px; }
@media (min-width: 768px) { .ad-placement--homepage_banner { padding: 0 24px 40px 24px; } }

.ad-placement--sidebar { margin-bottom: 24px; }

.ad-placement--in_article {
  max-width: 650px; margin: 36px auto; padding: 20px 0;
  border-top: 1px solid #e5e7eb; border-bottom: 1px solid #e5e7eb;
}

.ad-placement--footer_sponsor { max-width: 1280px; margin: 0 auto; padding: 24px 16px 32px 16px; text-align: center; }
.ad-placement--footer_sponsor .ad-unit { display: inline-block; margin: 0 16px 12px 16px; vertical-align: middle; }
.ad-placement--footer_sponsor .ad-img { max-height: 48px; width: auto; opacity: 0.7; transition: opacity 0.2s ease; filter: grayscale(0.5); border-radius: 2px; }
.ad-placement--footer_sponsor .ad-link:hover .ad-img,
.ad-placement--footer_sponsor .ad-static:hover .ad-img { opacity: 1; filter: grayscale(0); }
</style>
