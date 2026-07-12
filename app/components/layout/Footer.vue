<template>
  <!-- ======================================================================
       Footer — BBC News-style 5-tier horizontal minimal footer
       SSM TV branded · Semantic HTML5 · WCAG AA · Nuxt 3 i18n · Tailwind CSS
       No language selector · Contact numbers hidden (icon-only buttons)
       ====================================================================== -->
  <footer
    role="contentinfo"
    aria-label="Site footer"
    class="bg-white text-neutral-900"
  >
    <div class="max-w-7xl mx-auto px-4 md:px-6 border-t border-black">

      <!-- ================================================================ -->
      <!-- TIER 0 — SSM TV Logo (top-left, BBC logo position equivalent)     -->
      <!-- ================================================================ -->
      <div class="pt-4 pb-1.5">
        <NuxtLink
          :to="localePath('/')"
          class="inline-block"
          aria-label="SSM TV — Home"
        >
          <img
            src="/logo-ssm.png"
            alt="SSM TV"
            width="160"
            height="64"
            loading="lazy"
            class="h-12 lg:h-14 w-auto"
          />
        </NuxtLink>
      </div>

      <!-- divider -->
      <hr class="border-0 border-t border-neutral-200" />

      <!-- ================================================================ -->
      <!-- TIER 1 — Main Category Navigation Row                            -->
      <!-- Desktop: single horizontal inline row, evenly-spaced links        -->
      <!-- Mobile (< 768px): vertical stacked list                           -->
      <!-- ================================================================ -->
      <nav
        aria-label="Footer main news categories"
        class="py-3"
      >
        <ul
          class="flex flex-col md:flex-row md:flex-wrap md:items-center gap-y-2.5 gap-x-6"
        >
          <li v-for="item in categoryLinks" :key="item.to">
            <NuxtLink
              :to="localePath(item.to)"
              class="text-sm font-medium text-neutral-800 hover:text-green-700 hover:underline decoration-green-700 underline-offset-[0.35em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-600 rounded-sm"
            >
              {{ $t(item.labelKey) }}
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <!-- divider -->
      <hr class="border-0 border-t border-neutral-200" />

      <!-- ================================================================ -->
      <!-- TIER 2 — Utility Row                                              -->
      <!-- Single horizontal block: "Follow Us" label + social icon bar      -->
      <!-- + phone call button (icon-only)                                -->
      <!-- Desktop: flex row · Mobile: stacked vertical with gaps            -->
      <!-- ================================================================ -->
      <div
        class="py-3 flex flex-col sm:flex-row sm:items-center gap-4"
      >
        <!-- "Follow Us" i18n label -->
        <span class="text-sm font-medium text-neutral-800 whitespace-nowrap">
          {{ $t('footer.followUs') }}
        </span>

        <!-- Social icon bar -->
        <div
          class="flex items-center gap-2.5"
          role="list"
          aria-label="Social media links"
        >
          <!-- YouTube -->
          <a
            href="https://www.youtube.com/@THESTRUGGLESOFSINGLESMOTHERS"
            target="_blank"
            rel="noopener noreferrer"
            class="w-8 h-8 rounded-full bg-neutral-100 hover:bg-red-600 hover:text-white flex items-center justify-center transition-colors text-neutral-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
            aria-label="SSM TV on YouTube"
            role="listitem"
          >
            <svg class="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </a>

          <!-- Instagram -->
          <a
            href="https://www.instagram.com/nolinda_belle?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
            target="_blank"
            rel="noopener noreferrer"
            class="w-8 h-8 rounded-full bg-neutral-100 hover:bg-pink-600 hover:text-white flex items-center justify-center transition-colors text-neutral-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
            aria-label="SSM TV on Instagram"
            role="listitem"
          >
            <svg class="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 01-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 017.8 2m.2 2A3.6 3.6 0 004.4 8v8a3.6 3.6 0 003.6 3.6h8a3.6 3.6 0 003.6-3.6V8A3.6 3.6 0 0016 4.4H8m9.65 1.5a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5M12 7a5 5 0 110 10 5 5 0 010-10m0 2a3 3 0 100 6 3 3 0 000-6z"/>
            </svg>
          </a>

          <!-- WhatsApp (social circle) -->
          <a
            href="https://wa.me/250726268780"
            target="_blank"
            rel="noopener noreferrer"
            class="w-8 h-8 rounded-full bg-neutral-100 hover:bg-green-600 hover:text-white flex items-center justify-center transition-colors text-neutral-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
            aria-label="SSM TV on WhatsApp"
            role="listitem"
          >
            <svg class="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </a>

        </div>

        <!-- Separator between social icons and contact buttons -->
        <span class="hidden sm:block w-px h-5 bg-neutral-300" aria-hidden="true" />

        <!-- Voice call icon-only button (number hidden, only in href) -->
        <a
          href="tel:0781909250"
          class="w-8 h-8 rounded-full bg-neutral-100 hover:bg-green-700 hover:text-white flex items-center justify-center transition-colors text-neutral-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
          aria-label="Call SSM TV"
          title="Call SSM TV"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
          </svg>
        </a>
      </div>

      <!-- divider -->
      <hr class="border-0 border-t border-neutral-200" />

      <!-- ================================================================ -->
      <!-- TIER 3 — Legal & Compliance Hyperlink Row                         -->
      <!-- Desktop: inline horizontal list · Mobile: vertical stacked         -->
      <!-- ================================================================ -->
      <div class="py-3">
        <nav aria-label="Legal and compliance links">
          <ul
            class="flex flex-col md:flex-row md:flex-wrap gap-y-2 gap-x-6"
          >
            <li v-for="item in legalLinks" :key="item.to">
              <NuxtLink
                :to="localePath(item.to)"
                class="text-xs text-neutral-600 hover:text-green-700 hover:underline decoration-green-700 underline-offset-[0.35em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 rounded-sm"
              >
                {{ item.labelKey === 'footer.cookies' ? cookiesLabel : $t(item.labelKey) }}
              </NuxtLink>
            </li>
          </ul>
        </nav>
      </div>

      <!-- divider -->
      <hr class="border-0 border-t border-neutral-200" />

      <!-- ================================================================ -->
      <!-- TIER 4 — Copyright Disclaimer Row (absolute bottom of footer)     -->
      <!-- ================================================================ -->
      <div class="py-3">
        <small class="text-xs text-neutral-500 leading-relaxed">
          &copy; {{ currentYear }} SSM TV | {{ copyrightText }}
        </small>
      </div>

    </div>
  </footer>
</template>

<script setup lang="ts">
// ======================================================================
// Footer — BBC News-style 5-tier horizontal minimal footer
// SSM TV branded · No language selector · Contact numbers hidden
//
// i18n keys used (all exist in locale files except as noted):
//   nav.politiki – nav.ssmTv    ✓   Tier 1 category links
//   footer.followUs              ✓   Tier 2 "Follow Us" label
//   nav.about                    ✓   Tier 3 legal link
//   footer.terms                 ✓   Tier 3 legal link
//   footer.privacy               ✓   Tier 3 legal link
//   footer.cookies               ⚠   Tier 3 legal link (has fallback)
//   nav.contact                  ✓   Tier 3 legal link
//   footer.copyrightText         ⚠   Tier 4 copyright (has fallback)
// ======================================================================

const localePath = useLocalePath()
const { t, te } = useI18n()

// ----------------------------------------------------------------------
// Dynamic copyright year — auto-updates every January 1st
// ----------------------------------------------------------------------
const currentYear = computed(() => new Date().getFullYear())

// ----------------------------------------------------------------------
// i18n fallback helpers
// Keys footer.cookies and footer.copyrightText are not yet in the locale
// JSON files. These computed values use te() to check for existence and
// fall back to English. Once the keys are added to
// i18n/locales/{rw,en,fr}.json they resolve automatically.
// ----------------------------------------------------------------------
const cookiesLabel = computed(() =>
  te('footer.cookies') ? t('footer.cookies') : 'Cookies'
)

const copyrightText = computed(() =>
  te('footer.copyrightText')
    ? t('footer.copyrightText')
    : 'All rights reserved.'
)

// ----------------------------------------------------------------------
// TIER 1 — SSM TV core category navigation
// Slugs match the project's /category/[slug].vue dynamic route
// All labelKey values exist in i18n/locales under the "nav" namespace
// ----------------------------------------------------------------------
const categoryLinks = [
  { to: '/category/politiki',        labelKey: 'nav.politiki' },
  { to: '/category/ubuzima',         labelKey: 'nav.ubuzima' },
  { to: '/category/ubucuruzi',       labelKey: 'nav.ubucuruzi' },
  { to: '/category/ikoranabuhanga',  labelKey: 'nav.ikoranabuhanga' },
  { to: '/category/imyidagaduro',    labelKey: 'nav.imyidagaduro' },
  { to: '/category/imikino',         labelKey: 'nav.imikino' },
  { to: '/ssm-tv',                   labelKey: 'nav.ssmTv' },
]

// ----------------------------------------------------------------------
// TIER 3 — Legal & compliance links
// footer.terms and footer.privacy exist in locale files.
// footer.cookies uses the computed fallback above.
// ----------------------------------------------------------------------
const legalLinks = [
  { to: '/about',    labelKey: 'nav.about' },
  { to: '/contact',  labelKey: 'nav.contact' },
]
</script>
