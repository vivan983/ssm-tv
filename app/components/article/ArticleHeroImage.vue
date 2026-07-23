<!-- =====================================================================
     ARTICLE HERO IMAGE CARD
     Reusable professional card-framed hero image for the single article
     detail page. Designed for modern African news media editorial aesthetic.

     Features:
       - White card wrapper with rounded corners, shadow, inner padding frame
       - Fixed 16:9 aspect ratio on all screen sizes
       - Semi-transparent black gradient overlay for readable overlay text
       - Green category pill badge + date positioned bottom-left
       - Hover zoom animation (disabled on touch screens)
       - Responsive padding, shadow, and corner radius per breakpoint
       - Lazy-loaded image for page performance
     ===================================================================== -->
<template>
  <div class="hero-card group">
    <!-- ================================================================ -->
    <!-- OUTER WHITE CARD — rounded-xl, shadow, smooth hover transition   -->
    <!-- ================================================================ -->
    <div class="hero-card-wrapper">
      <!-- ================================================================ -->
      <!-- INNER PADDING FRAME — responsive white border between card      -->
      <!-- edge and image. Creates a premium framed photography look.       -->
      <!-- ================================================================ -->
      <div class="hero-frame">
        <!-- ================================================================ -->
        <!-- IMAGE CONTAINER — 16:9 aspect ratio, overflow clipped          -->
        <!-- ================================================================ -->
        <div class="hero-media">
          <!-- Featured image — lazy loaded for page performance -->
          <img
            :src="imageUrl"
            :alt="imageAlt"
            class="hero-img"
            loading="lazy"
          />

          <!-- ================================================================ -->
          <!-- GRADIENT OVERLAY — semi-transparent black, bottom to top        -->
          <!-- Ensures white overlay text is readable against any image.        -->
          <!-- ================================================================ -->
          <div class="hero-overlay" />

          <!-- ================================================================ -->
          <!-- OVERLAY CONTENT — category badge + publish date, bottom-left    -->
          <!-- ================================================================ -->
          <div class="hero-overlay-content">
            <!-- Category pill badge — green background, white text -->
            <NuxtLink
              :to="localePath(`/category/${categorySlug}`)"
              class="hero-category-badge"
              @click.stop
            >
              {{ categoryDisplayName }}
            </NuxtLink>

            <!-- Publish date — white text below the category badge -->
            <time
              v-if="publishDate"
              :datetime="publishDate"
              class="hero-date"
            >
              {{ publishDate }}
            </time>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// =====================================================================
// ARTICLE HERO IMAGE CARD — SCRIPT
// =====================================================================

const localePath = useLocalePath()

// ---- Props ---- //
const props = defineProps<{
  /** Supabase public bucket image URL (required) */
  imageUrl: string
  /** Category slug for the badge link, e.g. "politiki", "ubuzima" (required) */
  categorySlug: string
  /** Pre-formatted localized publish date string (required) */
  publishDate: string
  /** Display name for the category badge. Falls back to capitalized slug. */
  categoryName?: string
  /** Accessible alt text for the image. Falls back to empty string. */
  imageAlt?: string
}>()

// ---- Computed ---- //

/** Category display name — uses provided name or formats the slug as fallback. */
const categoryDisplayName = computed(() => {
  if (props.categoryName) return props.categoryName
  // Capitalize the slug for fallback display
  return props.categorySlug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
})
</script>

<style scoped>
/* ===================================================================
   HERO CARD — OUTER CONTAINER
   Full-width on mobile, centered + constrained on tablet/desktop.
   =================================================================== */
.hero-card {
  width: 100%;
  margin-bottom: 8px;
}

/* Tablet: center the card and constrain to a readable width */
@media (min-width: 768px) {
  .hero-card {
    max-width: 640px;
    margin-left: auto;
    margin-right: auto;
  }
}

/* Desktop: slightly wider but still contained — never full-screen */
@media (min-width: 1024px) {
  .hero-card {
    max-width: 720px;
    margin-left: auto;
    margin-right: auto;
  }
}

/* ===================================================================
   CARD WRAPPER — white card with shadow + rounded corners
   Mobile:  small rounded corners, subtle shadow (almost flush)
   Tablet:  rounded-xl, medium shadow, visible card frame
   Desktop: rounded-xl, deeper shadow, premium editorial feel
   =================================================================== */
.hero-card-wrapper {
  background: #ffffff;
  border-radius: 0.5rem;  /* rounded-lg — subtle on mobile */
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(0, 0, 0, 0.03);
  transition: box-shadow 0.3s ease;
}

/* Tablet: visible card frame emerges */
@media (min-width: 768px) {
  .hero-card-wrapper {
    border-radius: 0.75rem;  /* rounded-xl */
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06), 0 2px 4px rgba(0, 0, 0, 0.04);
  }
}

/* Desktop: deeper editorial shadow */
@media (min-width: 1024px) {
  .hero-card-wrapper {
    border-radius: 0.75rem;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.07), 0 2px 8px rgba(0, 0, 0, 0.04);
  }
}

/* Hover: shadow deepens — disabled on touch devices */
@media (hover: hover) and (pointer: fine) {
  .hero-card-wrapper:hover {
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.10), 0 4px 12px rgba(0, 0, 0, 0.05);
  }
}

/* ===================================================================
   INNER PADDING FRAME — responsive white border between card and image
   Mobile:  4px (nearly full-width, subtle frame)
   Tablet:  12px (visible white frame)
   Desktop: 16px (clean framed look)
   =================================================================== */
.hero-frame {
  padding: 4px;
}

@media (min-width: 768px) {
  .hero-frame {
    padding: 12px;
  }
}

@media (min-width: 1024px) {
  .hero-frame {
    padding: 16px;
  }
}

/* ===================================================================
   IMAGE CONTAINER — fixed 16:9 aspect ratio, HD sharp, no distortion
   overflow: hidden clips the image to the container's rounded corners.
   =================================================================== */
.hero-media {
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: 0.375rem;  /* rounded-md — slightly smaller than the card */
  background: #e8e8e8;     /* subtle placeholder while image loads */
}

@media (min-width: 768px) {
  .hero-media {
    border-radius: 0.5rem;  /* rounded-lg on tablet+ */
  }
}

/* ===================================================================
   FEATURED IMAGE — HD quality, object-cover, zero distortion
   =================================================================== */
.hero-img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  image-rendering: auto;  /* browser-default: crisp, no pixelation */
  transition: transform 0.5s ease;
}

/* Hover zoom — subtle 1.02 scale, disabled on touch devices */
@media (hover: hover) and (pointer: fine) {
  .hero-card-wrapper:hover .hero-img {
    transform: scale(1.02);
  }
}

/* ===================================================================
   GRADIENT OVERLAY — darkens bottom portion for text readability
   =================================================================== */
.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.72) 0%,
    rgba(0, 0, 0, 0.38) 35%,
    rgba(0, 0, 0, 0.08) 65%,
    transparent 100%
  );
  pointer-events: none;
}

/* ===================================================================
   OVERLAY CONTENT — positioned bottom-left above the gradient
   =================================================================== */
.hero-overlay-content {
  position: absolute;
  bottom: 0;
  left: 0;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  pointer-events: none;
}

@media (min-width: 768px) {
  .hero-overlay-content {
    padding: 24px;
    gap: 8px;
  }
}

@media (min-width: 1024px) {
  .hero-overlay-content {
    padding: 28px;
    gap: 10px;
  }
}

/* ===================================================================
   CATEGORY PILL BADGE — brand green (#15803D), white text, rounded-full
   pointer-events: auto so it remains clickable within the overlay.
   =================================================================== */
.hero-category-badge {
  display: inline-block;
  background: #15803D;
  color: #ffffff;
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 4px 12px;
  border-radius: 9999px;  /* rounded-full */
  text-decoration: none;
  pointer-events: auto;
  transition: background 0.2s ease;
  line-height: 1.3;
}

@media (min-width: 768px) {
  .hero-category-badge {
    font-size: 0.75rem;
    padding: 5px 14px;
  }
}

@media (hover: hover) and (pointer: fine) {
  .hero-category-badge:hover {
    background: #166534;  /* darker green on hover */
  }
}

/* ===================================================================
   PUBLISH DATE — white text, readable against gradient
   =================================================================== */
.hero-date {
  font-size: 0.75rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.88);
  line-height: 1.3;
  pointer-events: auto;
}

@media (min-width: 768px) {
  .hero-date {
    font-size: 0.8125rem;
  }
}

@media (min-width: 1024px) {
  .hero-date {
    font-size: 0.875rem;
  }
}

/* ---- Dark mode ---- */
:root.dark .hero-card-wrapper {
  background: #1a1a1a;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.03);
}

:root.dark .hero-media {
  background: #27272a;
}
</style>
