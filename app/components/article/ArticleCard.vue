<!-- =====================================================================
     BBC NEWS-STYLE ARTICLE CARD
     Clean, minimal news card matching BBC's listing aesthetic:
       - Image-first layout (16:10 aspect)
       - Colored section tag above headline
       - Bold black title (2 lines)
       - Gray excerpt (1-2 lines)
       - Muted timestamp row at bottom
       - Full card is a clickable link
       - Subtle shadow lift on hover
     ===================================================================== -->
<template>
  <!-- BUG FIX: Single NuxtLink as card wrapper eliminates nested <a> tags.
       Category badge uses @click.prevent.stop for independent navigation. -->
  <NuxtLink
    :to="localePath(`/article/${article.slug}`)"
    class="bbc-card group"
    :aria-label="article.title"
  >
    <!-- Thumbnail image — BBC cards lead with the image -->
    <div class="bbc-card-img-wrap">
      <img
        v-if="article.featured_image"
        :src="article.featured_image"
        :alt="article.featured_image_alt || article.title"
        class="bbc-card-img"
        loading="lazy"
      />
      <!-- Placeholder when no image exists — BBC uses a subtle gray gradient -->
      <div v-else class="bbc-card-img-placeholder">
        <span class="bbc-card-img-placeholder-text">SSM TV</span>
      </div>
    </div>

    <!-- Card text content -->
    <div class="bbc-card-body">
      <!-- Category / Section label — uses @click.prevent.stop to navigate
           to the category without triggering the parent article link -->
      <span
        v-if="article.category"
        class="bbc-card-section"
        role="link"
        tabindex="0"
        @click.prevent.stop="navigateTo(localePath(`/category/${article.category.slug}`))"
        @keydown.enter.prevent.stop="navigateTo(localePath(`/category/${article.category.slug}`))"
        @keydown.space.prevent.stop="navigateTo(localePath(`/category/${article.category.slug}`))"
      >
        {{ article.category.name }}
      </span>

      <!-- Title — bold, black, 2-line clamp -->
      <h3 class="bbc-card-title">
        {{ article.title }}
      </h3>

      <!-- Excerpt — gray summary blurb, 2 lines on desktop, 1 on mobile -->
      <p v-if="article.excerpt" class="bbc-card-excerpt">
        {{ article.excerpt }}
      </p>

      <!-- Meta row — timestamp + optional view count -->
      <div class="bbc-card-meta">
        <time
          v-if="article.published_at"
          :datetime="article.published_at"
          class="bbc-card-time"
        >
          {{ formatDateShort(article.published_at) }}
        </time>
        <span v-if="article.view_count > 0" class="bbc-card-views">
          {{ formatViewCount(article.view_count) }} {{ $t('article.views') }}
        </span>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Article } from '~/types/article'

defineProps<{
  article: Article
}>()

const localePath = useLocalePath()
const { locale } = useI18n()

/* ------------------------------------------------------------------
   Format date in short style: "15 Jul 2025"
   BBC uses short date format in listing cards to save space.
   ------------------------------------------------------------------ */
function formatDateShort(date: string) {
  return new Date(date).toLocaleDateString(
    locale.value === 'rw'
      ? 'rw-RW'
      : locale.value === 'fr'
        ? 'fr-FR'
        : 'en-US',
    { year: 'numeric', month: 'short', day: 'numeric' }
  )
}

/* ------------------------------------------------------------------
   Human-readable view count: 1.2K, 3.5M
   ------------------------------------------------------------------ */
function formatViewCount(count: number) {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
  return count.toString()
}
</script>

<style scoped>
/* ===================================================================
   BBC NEWS CARD — STYLES
   =================================================================== */

/* ---- Card wrapper — now a NuxtLink (renders as <a>), subtle lift on hover ---- */
.bbc-card {
  display: block;
  background: var(--bg-card);
  border-radius: 6px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition: box-shadow 0.2s ease;
}

.bbc-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

/* ---- Image area — 16:9 consistent with hero and article images ---- */
.bbc-card-img-wrap {
  display: block;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: var(--border-color);
}

.bbc-card-img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.bbc-card:hover .bbc-card-img {
  transform: scale(1.03);
}

/* Placeholder when article has no image */
.bbc-card-img-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.bbc-card-img-placeholder-text {
  font-size: 1.5rem;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.35);
  letter-spacing: 0.05em;
}

/* ---- Card body — text content below image ---- */
.bbc-card-body {
  padding: 16px 14px 14px 14px;
}

/* ---- Section / Category label ---- */
.bbc-card-section {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #16a34a;
  text-decoration: none;
  margin-bottom: 6px;
  cursor: pointer;
}

.bbc-card-section:hover {
  text-decoration: underline;
  text-underline-offset: 3px;
  text-decoration-thickness: 1.5px;
}

/* ---- Title — bold, black, 2-line clamp ---- */
.bbc-card-title {
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.35;
  color: var(--text-heading);
  margin: 0 0 6px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.bbc-card:hover .bbc-card-title {
  color: #16a34a;
}

/* ---- Excerpt — gray, 2-line clamp ---- */
.bbc-card-excerpt {
  font-size: 0.8125rem;
  line-height: 1.45;
  color: var(--text-muted);
  margin: 0 0 10px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ---- Meta row — timestamp, views ---- */
.bbc-card-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.75rem;
  color: var(--text-muted);
}

.bbc-card-time {
  font-style: normal;
}

/* ---- Desktop: slightly larger title ---- */
@media (min-width: 768px) {
  .bbc-card-title {
    font-size: 1.0625rem;
  }

  .bbc-card-excerpt {
    font-size: 0.875rem;
    -webkit-line-clamp: 2;
  }
}

/* ---- Dark mode ---- */
:root.dark .bbc-card {
  background: #1a1a1a;
}

:root.dark .bbc-card-title {
  color: #e5e7eb;
}

:root.dark .bbc-card:hover .bbc-card-title {
  color: #4ade80;
}

:root.dark .bbc-card-excerpt,
:root.dark .bbc-card-meta,
:root.dark .bbc-card-time {
  color: #9ca3af;
}

:root.dark .bbc-card-section {
  color: #4ade80;
}

:root.dark .bbc-card-img-wrap {
  background: #27272a;
}
</style>
