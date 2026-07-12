<template>
  <div class="about-page">
    <!-- Page heading — unified editorial pattern -->
    <div class="about-heading">
      <h1 class="about-title">{{ $t('about.title') }}</h1>
    </div>

    <!-- Page introduction -->
    <p class="about-intro">
      {{ $t('about.description') }}
    </p>

    <!-- Mission -->
    <section class="about-section">
      <h2 class="about-section-title">{{ $t('about.mission') }}</h2>
      <p class="about-section-text">{{ $t('about.missionText') }}</p>
    </section>

    <!-- Vision -->
    <section class="about-section">
      <h2 class="about-section-title">{{ $t('about.vision') }}</h2>
      <p class="about-section-text">{{ $t('about.visionText') }}</p>
    </section>

    <!-- Team -->
    <section class="about-section">
      <h2 class="about-section-title">{{ $t('about.team') }}</h2>
      <p class="about-section-text">{{ $t('about.teamText') }}</p>
    </section>

    <!-- Stats -->
    <div class="about-stats">
      <div class="about-stat">
        <p class="about-stat-number">500+</p>
        <p class="about-stat-label">{{ $t('about.statArticles') }}</p>
      </div>
      <div class="about-stat">
        <p class="about-stat-number">50K+</p>
        <p class="about-stat-label">{{ $t('about.statFollowers') }}</p>
      </div>
      <div class="about-stat">
        <p class="about-stat-number">3</p>
        <p class="about-stat-label">{{ $t('about.statLanguages') }}</p>
      </div>
      <div class="about-stat">
        <p class="about-stat-number">24/7</p>
        <p class="about-stat-label">{{ $t('about.statNews') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()

useHead({
  title: t('seo.about.title'),
  meta: [
    { name: 'description', content: t('seo.about.description') },
    { property: 'og:title', content: t('seo.about.title') },
    { property: 'og:description', content: t('seo.about.description') },
  ],
})

definePageMeta({
  layout: 'default',
})
</script>

<style scoped>
/* ---- Page container ---- */
.about-page {
  max-width: 768px;
  margin: 0 auto;
  padding: 40px 16px 64px 16px;
}

@media (min-width: 768px) {
  .about-page {
    padding-left: 24px;
    padding-right: 24px;
  }
}

/* ---- Heading — unified editorial pattern ---- */
.about-heading {
  margin-bottom: 24px;
  padding-top: 16px;
  padding-bottom: 14px;
  border-top: 3px solid #16a34a;
  border-bottom: 2px solid #141414;
}

.about-title {
  font-size: 1.5rem;
  font-weight: 800;
  line-height: 1.2;
  color: #141414;
  margin: 0;
  letter-spacing: -0.012em;
}

@media (min-width: 768px) {
  .about-title {
    font-size: 1.75rem;
  }
}

/* ---- Page intro ---- */
.about-intro {
  font-size: 1.0625rem;
  line-height: 1.7;
  color: #383838;
  margin: 0 0 36px 0;
  max-width: 650px;
}

/* ---- Content sections ---- */
.about-section {
  margin-bottom: 28px;
}

.about-section-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #141414;
  margin: 0 0 8px 0;
}

.about-section-text {
  font-size: 0.9375rem;
  line-height: 1.65;
  color: #545658;
  margin: 0;
}

/* ---- Stats grid ---- */
.about-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-top: 40px;
  padding-top: 28px;
  border-top: 1px solid #e5e7eb;
}

@media (min-width: 640px) {
  .about-stats {
    grid-template-columns: repeat(4, 1fr);
  }
}

.about-stat {
  background: #f9fafb;
  border-radius: 6px;
  padding: 20px 16px;
  text-align: center;
}

.about-stat-number {
  font-size: 1.75rem;
  font-weight: 800;
  color: #16a34a;
  margin: 0 0 4px 0;
  line-height: 1.2;
}

.about-stat-label {
  font-size: 0.8125rem;
  color: #545658;
  margin: 0;
}
</style>
