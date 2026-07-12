<!-- =====================================================================
     BBC NEWS-STYLE HERO / LEAD STORY
     Large featured article at the top of the homepage.
     BBC lead story layout:
       - Full-width image with dark gradient overlay
       - Text overlaid on bottom of image
       - Category label, headline, excerpt, timestamp all on the image
       - On mobile: image is shorter, text wraps cleanly
     ===================================================================== -->
<template>
  <!-- LOADED: Lead story with overlay text -->
  <section v-if="article" class="bbc-hero group">
    <NuxtLink
      :to="localePath(`/article/${article.slug}`)"
      class="bbc-hero-link"
      :aria-label="article.title"
    >
      <!-- Hero background image -->
      <div class="bbc-hero-media">
        <img
          v-if="article.featured_image"
          :src="article.featured_image"
          :alt="article.featured_image_alt || article.title"
          class="bbc-hero-img"
          loading="eager"
        />
        <!-- Placeholder gradient when no image -->
        <div v-else class="bbc-hero-placeholder" />

        <!-- Dark gradient overlay for text readability -->
        <div class="bbc-hero-overlay" />
      </div>

      <!-- Text content overlaid at bottom -->
      <div class="bbc-hero-content">
        <!-- Category label -->
        <span v-if="article.category" class="bbc-hero-section">
          {{ article.category.name }}
        </span>

        <!-- Headline -->
        <h2 class="bbc-hero-headline">
          {{ article.title }}
        </h2>

        <!-- Excerpt — hidden on small mobile -->
        <p v-if="article.excerpt" class="bbc-hero-excerpt">
          {{ article.excerpt }}
        </p>

        <!-- Meta row: timestamp + author + views -->
        <div class="bbc-hero-meta">
          <time
            v-if="article.published_at"
            :datetime="article.published_at"
          >
            {{ formatDate(article.published_at) }}
          </time>
          <span v-if="article.author" class="bbc-hero-byline">
            {{ $t('article.by') }} {{ article.author.display_name }}
          </span>
          <span v-if="article.view_count > 0">
            {{ formatViewCount(article.view_count) }} {{ $t('article.views') }}
          </span>
        </div>
      </div>
    </NuxtLink>
  </section>

  <!-- LOADING: Full-width skeleton matching hero proportions -->
  <section v-else-if="loading" class="bbc-hero">
    <div class="bbc-hero-media">
      <div class="bbc-hero-skeleton" />
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Article } from '~/types/article'

defineProps<{
  article?: Article | null
  loading?: boolean
}>()

const localePath = useLocalePath()
const { locale } = useI18n()

/* ------------------------------------------------------------------
   Long date format for hero: "15 July 2025"
   BBC hero stories use the full month name for gravitas.
   ------------------------------------------------------------------ */
function formatDate(date: string) {
  return new Date(date).toLocaleDateString(
    locale.value === 'rw'
      ? 'rw-RW'
      : locale.value === 'fr'
        ? 'fr-FR'
        : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  )
}

function formatViewCount(count: number) {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
  return count.toString()
}
</script>

<style scoped>
/* ===================================================================
   BBC LEAD STORY HERO — STYLES
   Large immersive hero with text overlay, matching BBC's lead story
   treatment on their homepage. Rich image, dark gradient, white text.
   =================================================================== */

/* ---- Hero section container ---- */
.bbc-hero {
  margin-bottom: 48px;
}

.bbc-hero-link {
  display: block;
  position: relative;
  text-decoration: none;
  color: inherit;
}

/* ---- Media area — 16:9 on desktop, taller on mobile ---- */
.bbc-hero-media {
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: #1a1a1a;
}

@media (max-width: 600px) {
  .bbc-hero-media {
    aspect-ratio: 4 / 3;
  }
}

.bbc-hero-img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.bbc-hero:hover .bbc-hero-img {
  transform: scale(1.02);
}

/* Placeholder when no image */
.bbc-hero-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #16a34a 100%);
}

/* ---- Gradient overlay — darkens the bottom for text readability ---- */
.bbc-hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.75) 0%,
    rgba(0, 0, 0, 0.35) 40%,
    rgba(0, 0, 0, 0.05) 70%,
    transparent 100%
  );
}

/* ---- Text content overlaid at bottom ---- */
.bbc-hero-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 24px 20px;
  color: #fff;
}

@media (min-width: 768px) {
  .bbc-hero-content {
    padding: 32px 28px;
  }
}

/* ---- Category / Section label on hero ---- */
.bbc-hero-section {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #fff;
  background: #16a34a;
  padding: 3px 10px;
  margin-bottom: 10px;
}

/* ---- Hero headline — large white text, scales with viewport ---- */
.bbc-hero-headline {
  font-size: 1.5rem;
  font-weight: 800;
  line-height: 1.2;
  color: #fff;
  margin: 0 0 8px 0;
  max-width: 750px;
}

@media (min-width: 600px) {
  .bbc-hero-headline {
    font-size: 2rem;
  }
}

@media (min-width: 900px) {
  .bbc-hero-headline {
    font-size: 2.5rem;
  }
}

/* ---- Excerpt — visible on tablet+ only ---- */
.bbc-hero-excerpt {
  font-size: 0.9375rem;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.85);
  margin: 0 0 10px 0;
  max-width: 600px;
  display: none;
}

@media (min-width: 600px) {
  .bbc-hero-excerpt {
    display: block;
  }
}

/* ---- Meta row — timestamp, author, views ---- */
.bbc-hero-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.7);
}

.bbc-hero-byline {
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
}

/* ---- Loading skeleton ---- */
.bbc-hero-skeleton {
  width: 100%;
  height: 100%;
  background: #2d2d2d;
  animation: bbc-pulse 1.8s ease-in-out infinite;
}

@keyframes bbc-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>
