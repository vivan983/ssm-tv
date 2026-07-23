<template>
  <!-- ======================================================================
       Footer — Dark green brand footer, 3-column professional layout
       SSM TV branded · Semantic HTML5 · WCAG AA · Nuxt 3 i18n · Tailwind CSS
       ====================================================================== -->
  <footer
    role="contentinfo"
    aria-label="Site footer"
    class="bg-[#0a1a10] text-white"
  >
    <div class="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-14">

      <!-- ================================================================ -->
      <!-- MAIN GRID — 3 columns on desktop, stacked on mobile               -->
      <!-- ================================================================ -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">

        <!-- ============================================================== -->
        <!-- COLUMN 1 — Logo + About + Copyright                             -->
        <!-- ============================================================== -->
        <div class="flex flex-col">
          <!-- Logo -->
          <NuxtLink
            :to="localePath('/')"
            class="inline-block mb-4"
            aria-label="SSM TV — Home"
          >
            <img
              src="/logo.png"
              alt="SSM TV"
              width="160"
              height="64"
              loading="lazy"
              class="h-24 lg:h-28 w-auto brightness-0 invert"
            />
          </NuxtLink>

          <!-- About text -->
          <p class="text-sm text-neutral-300 leading-relaxed mb-3 max-w-xs">
            {{ $t('footer.about') }}
          </p>
          <p class="text-xs text-neutral-400 leading-relaxed max-w-xs">
            {{ editorialText }}
          </p>
        </div>

        <!-- ============================================================== -->
        <!-- COLUMN 2 — Quick Links + Contact Info                           -->
        <!-- ============================================================== -->
        <div class="flex flex-col">
          <h3 class="text-xs font-bold uppercase tracking-widest text-green-400 mb-4">
            {{ $t('footer.quickLinks') }}
          </h3>

          <!-- Legal links -->
          <nav aria-label="Legal and compliance links" class="mb-6">
            <ul class="flex flex-col gap-2.5">
              <li v-for="item in legalLinks" :key="item.to">
                <NuxtLink
                  :to="localePath(item.to)"
                  class="text-sm text-neutral-300 hover:text-green-400 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400 rounded-sm"
                >
                  {{ item.labelKey === 'footer.cookies' ? cookiesLabel : $t(item.labelKey) }}
                </NuxtLink>
              </li>
            </ul>
          </nav>

          <!-- Contact info -->
          <div class="mt-auto space-y-1.5">
            <p class="text-xs text-neutral-400">
              <span class="text-neutral-300 font-medium">{{ $t('footer.contactInfo') }}</span>
            </p>
            <a
              href="mailto:Umubyeyidenise555@gmail.com"
              class="text-xs text-neutral-400 hover:text-green-400 transition-colors block"
            >
              Umubyeyidenise555@gmail.com
            </a>
            <a
              href="tel:0781909250"
              class="text-xs text-neutral-400 hover:text-green-400 transition-colors block"
            >
              078 190 9250
            </a>
            <p class="text-xs text-neutral-500">Kigali, Rwanda</p>
          </div>
        </div>

        <!-- ============================================================== -->
        <!-- COLUMN 3 — Follow Us + Social icons                            -->
        <!-- ============================================================== -->
        <div class="flex flex-col">
          <h3 class="text-xs font-bold uppercase tracking-widest text-green-400 mb-4">
            {{ $t('footer.followUs') }}
          </h3>

          <!-- Social icon grid -->
          <div
            class="flex flex-wrap gap-3"
            role="list"
            aria-label="Social media links"
          >
            <!-- YouTube -->
            <a
              href="https://www.youtube.com/@THESTRUGGLESOFSINGLESMOTHERS"
              target="_blank"
              rel="noopener noreferrer"
              class="w-10 h-10 rounded-lg bg-white/10 hover:bg-red-600 flex items-center justify-center transition-all duration-200 text-neutral-300 hover:text-white hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400"
              aria-label="SSM TV on YouTube"
              role="listitem"
              title="YouTube"
            >
              <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>

            <!-- Instagram -->
            <a
              href="https://www.instagram.com/nolinda_belle?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
              class="w-10 h-10 rounded-lg bg-white/10 hover:bg-pink-600 flex items-center justify-center transition-all duration-200 text-neutral-300 hover:text-white hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400"
              aria-label="SSM TV on Instagram"
              role="listitem"
              title="Instagram"
            >
              <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 01-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 017.8 2m.2 2A3.6 3.6 0 004.4 8v8a3.6 3.6 0 003.6 3.6h8a3.6 3.6 0 003.6-3.6V8A3.6 3.6 0 0016 4.4H8m9.65 1.5a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5M12 7a5 5 0 110 10 5 5 0 010-10m0 2a3 3 0 100 6 3 3 0 000-6z"/>
              </svg>
            </a>

            <!-- TikTok -->
            <a
              href="https://www.tiktok.com/@umubyeyidenise126?_r=1&_t=ZS-97zYWg7KUrf"
              target="_blank"
              rel="noopener noreferrer"
              class="w-10 h-10 rounded-lg bg-white/10 hover:bg-neutral-900 flex items-center justify-center transition-all duration-200 text-neutral-300 hover:text-white hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400"
              aria-label="SSM TV on TikTok"
              role="listitem"
              title="TikTok"
            >
              <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
              </svg>
            </a>

            <!-- WhatsApp -->
            <a
              href="https://wa.me/250726268780"
              target="_blank"
              rel="noopener noreferrer"
              class="w-10 h-10 rounded-lg bg-white/10 hover:bg-green-600 flex items-center justify-center transition-all duration-200 text-neutral-300 hover:text-white hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400"
              aria-label="SSM TV on WhatsApp"
              role="listitem"
              title="WhatsApp"
            >
              <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>

            <!-- Phone call button -->
            <a
              href="tel:0781909250"
              class="w-10 h-10 rounded-lg bg-white/10 hover:bg-green-700 flex items-center justify-center transition-all duration-200 text-neutral-300 hover:text-white hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400"
              aria-label="Call SSM TV"
              title="Call SSM TV"
              role="listitem"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      <!-- ================================================================ -->
      <!-- BOTTOM ROW — Copyright                                            -->
      <!-- ================================================================ -->
      <div class="mt-10 md:mt-12 pt-6 border-t border-white/10">
        <small class="text-xs text-neutral-500 leading-relaxed">
          &copy; {{ currentYear }} SSM TV | {{ copyrightText }}
        </small>
      </div>

    </div>
  </footer>
</template>

<script setup lang="ts">
// ======================================================================
// Footer — Dark green brand footer, 3-column professional layout
// SSM TV branded · No language selector
//
// i18n keys used:
//   footer.about                 ✓   Column 1 site description
//   footer.editorial             ⚠   Column 1 editorial note (has fallback)
//   footer.quickLinks            ✓   Column 2 heading
//   footer.contactInfo           ✓   Column 2 contact heading
//   nav.about                    ✓   Legal link
//   footer.terms                 ✓   Legal link
//   footer.privacy               ✓   Legal link
//   footer.cookies               ⚠   Legal link (has fallback)
//   nav.contact                  ✓   Legal link
//   footer.followUs              ✓   Column 3 heading
//   footer.copyrightText         ⚠   Copyright row (has fallback)
// ======================================================================

const localePath = useLocalePath()
const { t } = useI18n()

const currentYear = computed(() => new Date().getFullYear())

const cookiesLabel = computed(() => {
  const translated = t('footer.cookies')
  return translated === 'footer.cookies' ? 'Cookies' : translated
})

const editorialText = computed(() => {
  const translated = t('footer.editorial')
  return translated === 'footer.editorial' ? 'Inkuru zacu zisesengurwa n\'itsinda ry\'abanyamakuru babigize umwuga. Ibitekerezo byatanzwe mu nkuru ni iby\'abanditsi bazanditse.' : translated
})

const copyrightText = computed(() => {
  const translated = t('footer.copyrightText')
  return translated === 'footer.copyrightText' ? 'All rights reserved.' : translated
})

const legalLinks = [
  { to: '/about',    labelKey: 'nav.about' },
  { to: '/terms',    labelKey: 'footer.terms' },
  { to: '/privacy',  labelKey: 'footer.privacy' },
  { to: '/cookies',  labelKey: 'footer.cookies' },
  { to: '/contact',  labelKey: 'nav.contact' },
]
</script>
