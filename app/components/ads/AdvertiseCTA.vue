<!-- =====================================================================
     ADVERTISE CTA — Premium "Advertise With Us" Promotional Card
     Converts visitors into advertising clients. Displays on the
     homepage sidebar and can be placed anywhere via the component.

     Design principles:
       - Professional & trustworthy — not a tacky ad
       - Clear value proposition for businesses
       - Responsive: reflows elegantly on all devices
       - Accessible: keyboard-navigable, screen-reader friendly
       - Configurable: all text via i18n, no hardcoded values
     ===================================================================== -->
<template>
  <div class="advertise-cta group" role="region" aria-labelledby="advertise-heading">
    <!-- ================================================================ -->
    <!-- ILLUSTRATION — professional growth graphic, inline SVG            -->
    <!-- ================================================================ -->
    <div class="advertise-illustration" aria-hidden="true">
      <!-- Background circle -->
      <div class="advertise-illustration-bg" />
      <!-- Animated chart bars -->
      <div class="advertise-chart">
        <div class="advertise-bar advertise-bar--1" />
        <div class="advertise-bar advertise-bar--2" />
        <div class="advertise-bar advertise-bar--3" />
        <div class="advertise-bar advertise-bar--4" />
      </div>
      <!-- Trend line -->
      <svg class="advertise-trend" viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M10 70 L55 45 L85 50 L115 25 L145 30 L175 8 L190 5"
          stroke="#16A34A"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
          class="advertise-trend-line"
        />
        <circle cx="190" cy="5" r="5" fill="#16A34A" class="advertise-trend-dot" />
        <circle cx="175" cy="8" r="0" fill="#16A34A" opacity="0" />
      </svg>
      <!-- Stats icon -->
      <div class="advertise-stats-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="advertise-stats-svg">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      </div>
    </div>

    <!-- ================================================================ -->
    <!-- CONTENT                                                            -->
    <!-- ================================================================ -->
    <div class="advertise-content">
      <!-- Headline -->
      <h3 id="advertise-heading" class="advertise-headline">
        {{ $t('advertise.headline') || 'Kwamamaza kuri SSM TV' }}
      </h3>

      <!-- Sub-headline -->
      <p class="advertise-subheadline">
        {{ $t('advertise.subheadline') || 'Kwinjiza ubucuruzi bwawe mu itangazamakuru rya Digitali' }}
      </p>

      <!-- Description -->
      <p class="advertise-description">
        {{ $t('advertise.description') || 'Shyira ubucuruzi bwawe imbere y\'abakurikira amakuru ya SSM TV.' }}
      </p>

      <!-- Benefits — three icons + text -->
      <ul class="advertise-benefits" aria-label="Benefits">
        <li class="advertise-benefit-item">
          <svg class="advertise-benefit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span>{{ $t('advertise.benefit1') || 'Kugera ku basomyi ibihumbi' }}</span>
        </li>
        <li class="advertise-benefit-item">
          <svg class="advertise-benefit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
          </svg>
          <span>{{ $t('advertise.benefit2') || 'Kumenyekanisha ubucuruzi bwawe' }}</span>
        </li>
        <li class="advertise-benefit-item">
          <svg class="advertise-benefit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
          </svg>
          <span>{{ $t('advertise.benefit3') || 'Gukura mu kigero gishya' }}</span>
        </li>
      </ul>

      <!-- ================================================================ -->
      <!-- CALL-TO-ACTION BUTTONS                                             -->
      <!-- ================================================================ -->
      <div class="advertise-actions">
        <a
          :href="contactUrl"
          class="advertise-btn advertise-btn--primary"
        >
          <svg class="advertise-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          {{ $t('advertise.ctaContact') || 'Twandikire' }}
        </a>
        <NuxtLink
          :to="localePath('/contact')"
          class="advertise-btn advertise-btn--secondary"
        >
          {{ $t('advertise.ctaStart') || 'Tangira Kwamamaza' }}
          <svg class="advertise-btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </NuxtLink>
      </div>

      <!-- Trust note -->
      <p class="advertise-trust">
        <svg class="advertise-trust-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        Ibyo wanditse bizagera ku bayobozi bacu mu kinyabupfura.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const localePath = useLocalePath()
const contactUrl = computed(() => localePath('/contact'))
</script>

<style scoped>
/* ===================================================================
   ADVERTISE CTA — PREMIUM PROMOTIONAL CARD
   Modern, trustworthy, designed to convert readers into advertisers.
   =================================================================== */

.advertise-cta {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  overflow: hidden;
  transition: box-shadow 0.3s ease;
}
.advertise-cta:hover {
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.04);
}

/* ===================================================================
   ILLUSTRATION AREA
   =================================================================== */
.advertise-illustration {
  position: relative;
  height: 120px;
  background: linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 40%, #ECFDF5 100%);
  overflow: hidden;
}

.advertise-illustration-bg {
  position: absolute;
  top: -40px;
  right: -20px;
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: rgba(22, 163, 74, 0.06);
}

/* ---- Chart bars ---- */
.advertise-chart {
  position: absolute;
  bottom: 16px;
  left: 20px;
  display: flex;
  align-items: flex-end;
  gap: 6px;
  height: 60px;
}

.advertise-bar {
  width: 12px;
  border-radius: 3px 3px 0 0;
  background: rgba(22, 163, 74, 0.2);
  transition: height 0.4s ease;
}

.advertise-bar--1 { height: 30px; }
.advertise-bar--2 { height: 45px; }
.advertise-bar--3 { height: 22px; }
.advertise-bar--4 { height: 55px; background: rgba(22, 163, 74, 0.35); }

/* ---- Trend line ---- */
.advertise-trend {
  position: absolute;
  bottom: 8px;
  right: 12px;
  width: 140px;
  height: 60px;
}

.advertise-trend-line {
  stroke-dasharray: 300;
  stroke-dashoffset: 300;
  animation: drawTrend 2s ease-out forwards;
}

.advertise-trend-dot {
  transform-origin: center;
  animation: pulseDot 2s ease-in-out infinite;
}

@keyframes drawTrend {
  to { stroke-dashoffset: 0; }
}

@keyframes pulseDot {
  0%, 100% { r: 5; opacity: 1; }
  50% { r: 8; opacity: 0.6; }
}

/* ---- Stats icon ---- */
.advertise-stats-icon {
  position: absolute;
  top: 16px;
  left: 20px;
  width: 36px;
  height: 36px;
  background: #fff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.advertise-stats-svg {
  width: 18px;
  height: 18px;
  color: #16A34A;
}

/* ===================================================================
   CONTENT AREA
   =================================================================== */
.advertise-content {
  padding: 20px 20px 22px 20px;
}

/* ---- Headline ---- */
.advertise-headline {
  font-size: 1.125rem;
  font-weight: 800;
  line-height: 1.25;
  color: #141414;
  margin: 0 0 4px 0;
  letter-spacing: -0.012em;
}

/* ---- Sub-headline ---- */
.advertise-subheadline {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #16A34A;
  margin: 0 0 12px 0;
  line-height: 1.4;
}

/* ---- Description ---- */
.advertise-description {
  font-size: 0.8125rem;
  line-height: 1.55;
  color: #545658;
  margin: 0 0 14px 0;
}

/* ===================================================================
   BENEFITS LIST
   =================================================================== */
.advertise-benefits {
  list-style: none;
  margin: 0 0 18px 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.advertise-benefit-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #374151;
}

.advertise-benefit-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  color: #16A34A;
}

/* ===================================================================
   CALL-TO-ACTION BUTTONS
   =================================================================== */
.advertise-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.advertise-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 16px;
  font-size: 0.8125rem;
  font-weight: 700;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
  text-align: center;
}

.advertise-btn--primary {
  background: #16A34A;
  color: #fff;
}
.advertise-btn--primary:hover {
  background: #15803D;
  box-shadow: 0 2px 8px rgba(22, 163, 74, 0.3);
  transform: translateY(-1px);
}

.advertise-btn--secondary {
  background: #F0FDF4;
  color: #16A34A;
  border: 1.5px solid #BBF7D0;
}
.advertise-btn--secondary:hover {
  background: #DCFCE7;
  border-color: #86EFAC;
  transform: translateY(-1px);
}

.advertise-btn-icon {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
}

.advertise-btn-arrow {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  transition: transform 0.2s ease;
}
.advertise-btn--secondary:hover .advertise-btn-arrow {
  transform: translateX(2px);
}

/* ===================================================================
   TRUST NOTE
   =================================================================== */
.advertise-trust {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.6875rem;
  color: #9CA3AF;
  margin: 0;
  line-height: 1.4;
}

.advertise-trust-icon {
  width: 12px;
  height: 12px;
  flex-shrink: 0;
  color: #9CA3AF;
}

/* ===================================================================
   RESPONSIVE
   =================================================================== */
@media (max-width: 640px) {
  .advertise-illustration {
    height: 100px;
  }
  .advertise-content {
    padding: 16px;
  }
  .advertise-headline {
    font-size: 1rem;
  }
}

/* ===================================================================
   REDUCED MOTION
   =================================================================== */
@media (prefers-reduced-motion: reduce) {
  .advertise-trend-line {
    animation: none;
    stroke-dashoffset: 0;
  }
  .advertise-trend-dot {
    animation: none;
  }
}
</style>
