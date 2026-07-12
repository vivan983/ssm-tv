<template>
  <!-- =====================================================================
       BBC NEWS-STYLE ARTICLE DETAIL PAGE
       Layout (top → bottom):
         1. Section label / category badge
         2. Large bold headline
         3. Meta row: timestamp + author byline (left) | share buttons (right)
         4. Full-width featured hero image
         5. Small gray image caption
         6. Body paragraph text blocks in readable news prose
         7. Bottom share row + related articles grid
       ===================================================================== -->
  <div>
    <!-- ================================================================ -->
    <!-- LOADING STATE — skeleton placeholders matching BBC proportions   -->
    <!-- ================================================================ -->
    <div v-if="loading" class="bbc-article">
      <div class="bbc-body">
        <BaseSkeleton variant="title" class="h-6 w-24 mb-5" />
        <BaseSkeleton variant="title" class="h-10 mb-3" />
        <BaseSkeleton variant="title" class="h-10 w-3/4 mb-6" />
        <BaseSkeleton variant="text" class="mb-2" />
        <BaseSkeleton variant="text" class="w-1/3 mb-8" />
        <BaseSkeleton variant="card" class="aspect-[16/9] rounded-none mb-3" />
        <BaseSkeleton variant="text" class="w-2/3 mb-8" />
        <BaseSkeleton variant="text" class="mb-2" v-for="i in 5" :key="i" />
      </div>
    </div>

    <!-- ================================================================ -->
    <!-- ERROR STATE                                                        -->
    <!-- ================================================================ -->
    <BaseErrorState
      v-else-if="error"
      :message="error"
      @retry="refresh"
      class="py-16"
    />

    <!-- ================================================================ -->
    <!-- NOT FOUND                                                          -->
    <!-- ================================================================ -->
    <BaseEmptyState
      v-else-if="!article"
      :title="$t('errors.notFound')"
      :message="$t('errors.notFoundDesc')"
      :action-label="$t('errors.goHome')"
      @action="navigateTo(localePath('/'))"
      class="py-16"
    />

    <!-- ================================================================ -->
    <!-- ARTICLE LOADED — BBC NEWS LAYOUT                                  -->
    <!-- ================================================================ -->
    <article v-else class="bbc-article" itemscope itemtype="https://schema.org/NewsArticle">
      <!-- ---------------------------------------------------------------- -->
      <!-- SECTION 1: Category / Section label above headline               -->
      <!-- BBC uses small colored section tags like "News" "Sport" etc.     -->
      <!-- before the main headline to orient the reader.                   -->
      <!-- ---------------------------------------------------------------- -->
      <div class="bbc-body">
        <NuxtLink
          v-if="article.category"
          :to="localePath(`/category/${article.category.slug}`)"
          class="bbc-section-label"
        >
          {{ article.category.name }}
        </NuxtLink>
      </div>

      <!-- ---------------------------------------------------------------- -->
      <!-- SECTION 2: LARGE BOLD HEADLINE                                    -->
      <!-- BBC headlines are the dominant element — very large, very bold,   -->
      <!-- set in a strong sans-serif. They grab attention immediately.      -->
      <!-- ---------------------------------------------------------------- -->
      <div class="bbc-body">
        <h1 class="bbc-headline" itemprop="headline">
          {{ article.title }}
        </h1>
      </div>

      <!-- ---------------------------------------------------------------- -->
      <!-- SECTION 3: META ROW — timestamp + author | share icons           -->
      <!-- BBC places publish date and reporter name in a subtle row         -->
      <!-- beneath the headline, with share/bookmark icons on the right.     -->
      <!-- ---------------------------------------------------------------- -->
      <div class="bbc-body">
        <div class="bbc-meta-row">
          <!-- LEFT: timestamp + author byline -->
          <div class="bbc-meta-left">
            <!-- Publish date with small clock icon -->
            <span v-if="article.published_at" class="bbc-meta-item">
              <svg class="bbc-meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <time :datetime="article.published_at" itemprop="datePublished">
                {{ formatDate(article.published_at) }}
              </time>
            </span>
            <!-- Separator dot -->
            <span v-if="article.published_at && article.author" class="bbc-meta-sep" aria-hidden="true">•</span>
            <!-- Author byline -->
            <span v-if="article.author" class="bbc-meta-item bbc-byline" itemprop="author" itemscope itemtype="https://schema.org/Person">
              <span itemprop="name">{{ $t('article.by') }} {{ article.author.display_name }}</span>
            </span>
          </div>
          <!-- RIGHT: share / save icon buttons -->
          <div class="bbc-meta-right">
            <ArticleShare
              :url="currentUrl"
              :title="article.title"
            />
          </div>
        </div>
      </div>

      <!-- ---------------------------------------------------------------- -->
      <!-- SECTION 4: FEATURED HERO IMAGE CARD                                -->
      <!-- Reusable ArticleHeroImage component replaces raw <img> tag.        -->
      <!-- Provides: white card frame, 16:9 aspect ratio, gradient overlay,   -->
      <!-- category pill badge + publish date bottom-left, hover zoom,        -->
      <!-- lazy loading, responsive padding/shadow per breakpoint.            -->
      <!-- ---------------------------------------------------------------- -->
      <ArticleHeroImage
        v-if="article.featured_image"
        :image-url="article.featured_image"
        :category-slug="article.category?.slug ?? ''"
        :category-name="article.category?.name"
        :publish-date="article.published_at ? formatDate(article.published_at) : ''"
        :image-alt="article.featured_image_alt || article.title"
      />

      <!-- ---------------------------------------------------------------- -->
      <!-- SECTION 5: IMAGE CAPTION                                         -->
      <!-- BBC captions sit directly under the photo, small gray text,      -->
      <!-- often with a copyright/credit line appended.                     -->
      <!-- ---------------------------------------------------------------- -->
      <p v-if="article.featured_image_alt" class="bbc-caption">
        {{ article.featured_image_alt }}
        <span v-if="article.author" class="bbc-caption-credit">
          — {{ article.author.display_name }}
        </span>
      </p>

      <!-- ---------------------------------------------------------------- -->
      <!-- SECTION 6: ARTICLE BODY TEXT                                      -->
      <!-- BBC body copy: clean left-aligned paragraphs, ~18px font,         -->
      <!-- generous line-height (~1.7), proper paragraph spacing.           -->
      <!-- Text color is a dark gray (#383838) not pure black — easier on   -->
      <!-- the eyes for long-form reading.                                   -->
      <!-- ---------------------------------------------------------------- -->
      <div v-if="article.content" class="bbc-body bbc-body-text">
        <ArticleContent :content="article.content" />
      </div>

      <!-- AD: In-Article -->
      <AdPlacement placement="in_article" :limit="1" />

      <!-- ---------------------------------------------------------------- -->
      <!-- SECTION 7: BOTTOM SHARE ROW + DIVIDER                            -->
      <!-- BBC often repeats share buttons at the foot of articles with a   -->
      <!-- thin horizontal rule above, signaling the end of the piece.      -->
      <!-- ---------------------------------------------------------------- -->
      <div class="bbc-body">
        <hr class="bbc-divider" />
        <div class="bbc-bottom-share">
          <span class="bbc-share-label">{{ $t('article.share') }}:</span>
          <ArticleShare
            :url="currentUrl"
            :title="article.title"
          />
        </div>
      </div>

      <!-- ---------------------------------------------------------------- -->
      <!-- SECTION 8: RELATED ARTICLES                                      -->
      <!-- BBC places a "Related Stories" or "More on this topic" grid at   -->
      <!-- the bottom of articles, separated by a clear section heading.    -->
      <!-- ---------------------------------------------------------------- -->
      <ArticleRelated
        v-if="article.category_id"
        :category-id="article.category_id"
        :current-article-id="article.id"
        class="bbc-body"
      />
    </article>
  </div>
</template>

<script setup lang="ts">
// =====================================================================
// BBC NEWS-STYLE ARTICLE DETAIL PAGE — SCRIPT
// =====================================================================
// This page renders a single news article using BBC's proven layout
// pattern. The SCSS styles below replicate BBC's typographic scale,
// spacing rhythm, and color palette exactly.
// =====================================================================
import ArticleShare from '~/components/article/ArticleShare.vue'
import ArticleContent from '~/components/article/ArticleContent.vue'
import ArticleRelated from '~/components/article/ArticleRelated.vue'
import ArticleHeroImage from '~/components/article/ArticleHeroImage.vue'
import BaseSkeleton from '~/components/ui/BaseSkeleton.vue'
import BaseErrorState from '~/components/ui/BaseErrorState.vue'
import BaseEmptyState from '~/components/ui/BaseEmptyState.vue'
import AdPlacement from '~/components/ads/AdPlacement.vue'
import { useArticlesStore } from '~/stores/articles'

const route = useRoute()
const localePath = useLocalePath()
const store = useArticlesStore()

const slug = computed(() => route.params.slug as string)
const article = computed(() => store.currentArticle)
const loading = computed(() => store.currentArticleLoading)
const error = computed(() => store.currentArticleError)

// Canonical URL for sharing
const currentUrl = computed(
  () => `https://ssmtv.rw${route.fullPath}`
)

onMounted(() => {
  store.fetchArticle(slug.value)
})

function refresh() {
  store.fetchArticle(slug.value)
}

// -------------------------------------------------------------------
// UTILITY: Date formatting with locale awareness
// BBC format: "15 July 2025" or localized equivalent
// -------------------------------------------------------------------
const { locale } = useI18n()
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

// =====================================================================
// SEO: Meta tags + JSON-LD structured data for Google News
// =====================================================================
useHead(() => {
  if (!article.value) return {}
  return {
    title: article.value.meta_title || article.value.title,
    meta: [
      {
        name: 'description',
        content:
          article.value.meta_description || article.value.excerpt || '',
      },
      {
        property: 'og:title',
        content: article.value.meta_title || article.value.title,
      },
      {
        property: 'og:description',
        content:
          article.value.meta_description || article.value.excerpt || '',
      },
      {
        property: 'og:image',
        content:
          article.value.og_image || article.value.featured_image || '',
      },
      { property: 'og:url', content: currentUrl.value },
      { property: 'og:type', content: 'article' },
      {
        property: 'article:published_time',
        content: article.value.published_at,
      },
      {
        property: 'article:author',
        content: article.value.author?.display_name,
      },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    script: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'NewsArticle',
          headline: article.value.title,
          description: article.value.excerpt,
          image: article.value.featured_image,
          datePublished: article.value.published_at,
          dateModified: article.value.updated_at,
          author: {
            '@type': 'Person',
            name: article.value.author?.display_name,
          },
          publisher: {
            '@type': 'Organization',
            name: 'SSM TV',
            logo: {
              '@type': 'ImageObject',
              url: 'https://ssmtv.rw/logo-icon.svg',
            },
          },
        }),
      },
    ],
  }
})

definePageMeta({
  layout: 'default',
})
</script>

<!-- =====================================================================
     BBC NEWS-STYLE CSS
     These styles replicate BBC's article design system:
       - Color palette: #141414 headlines, #383838 body, #545658 meta
       - Typographic scale: 2.25rem headlines, 1.125rem body, 0.875rem meta
       - Spacing: 48px between major sections, 24px minor
       - Max-width: ~650px for text columns, image spans wider
     Uses plain CSS (no preprocessor) — compatible with Tailwind project.
     ===================================================================== -->
<style scoped>
/* ===================================================================
   BBC COLOR CUSTOM PROPERTIES
   Defined on the article wrapper for scoped isolation.
   =================================================================== */
.bbc-article {
  --bbc-headline: #141414;
  --bbc-body: #383838;
  --bbc-meta: #545658;
  --bbc-caption: #6e6e73;
  --bbc-border: #dfdfdf;
  --bbc-bg: #ffffff;

  background: var(--bbc-bg);
  padding: 40px 0 0 0;
}

/* ===================================================================
   BBC BODY — width-constrained text column
   =================================================================== */
.bbc-body {
  max-width: 650px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 16px;
  padding-right: 16px;
}

/* ===================================================================
   SECTION LABEL — small uppercase colored label above headline
   =================================================================== */
.bbc-section-label {
  display: inline-block;
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #16a34a;
  text-decoration: none;
  margin-bottom: 24px;
}

.bbc-section-label:hover {
  text-decoration: underline;
  text-underline-offset: 5px;
  text-decoration-thickness: 2px;
}

/* ===================================================================
   HEADLINE — large bold, 32px mobile → 40px desktop
   =================================================================== */
.bbc-headline {
  font-family: 'Inter', 'Noto Sans', system-ui, -apple-system, sans-serif;
  font-size: 2rem;
  font-weight: 800;
  line-height: 1.12;
  color: var(--bbc-headline);
  margin: 0 0 24px 0;
  letter-spacing: -0.018em;
  text-wrap: balance;
}

@media (min-width: 600px) {
  .bbc-headline {
    font-size: 2.25rem;
    margin-bottom: 28px;
  }
}

@media (min-width: 900px) {
  .bbc-headline {
    font-size: 2.75rem;
    letter-spacing: -0.02em;
    margin-bottom: 32px;
  }
}

/* ===================================================================
   META ROW — timestamp + author (left) | share icons (right)
   =================================================================== */
.bbc-meta-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  padding-bottom: 20px;
  margin-bottom: 32px;
  border-bottom: 1px solid var(--bbc-border);
}

.bbc-meta-left {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 2px;
  font-size: 0.875rem;
  color: var(--bbc-meta);
}

.bbc-meta-item {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.bbc-byline {
  font-weight: 600;
  color: var(--bbc-headline);
}

.bbc-meta-icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  color: var(--bbc-meta);
}

.bbc-meta-sep {
  color: var(--bbc-meta);
  margin: 0 6px;
}

.bbc-meta-right {
  display: flex;
  align-items: center;
  margin-left: auto;
}

/* ===================================================================
   IMAGE CAPTION — small gray text under the photo
   Styled to sit below the ArticleHeroImage card, matching BBC's
   caption placement with the article text column width.
   =================================================================== */
.bbc-caption {
  max-width: 650px;
  margin: 12px auto 36px auto;
  padding-left: 16px;
  padding-right: 16px;
  font-size: 0.8125rem;
  line-height: 1.55;
  color: var(--bbc-caption);
}

.bbc-caption-credit {
  color: var(--bbc-meta);
  font-style: italic;
}

/* ===================================================================
   BODY TEXT WRAPPER
   =================================================================== */
.bbc-body-text {
  padding-top: 12px;
  padding-bottom: 40px;
}

/* ===================================================================
   DIVIDER + BOTTOM SHARE ROW
   =================================================================== */
.bbc-divider {
  border: none;
  border-top: 1px solid var(--bbc-border);
  margin: 0 0 20px 0;
}

.bbc-bottom-share {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 48px;
}

.bbc-share-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--bbc-meta);
}
</style>
