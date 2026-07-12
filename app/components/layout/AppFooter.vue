<template>
  <footer class="bg-[#0B1622] text-white mt-auto">
    <div class="container-main py-14">
      <div class="flex flex-col md:flex-row items-center md:items-start gap-16 md:gap-24 lg:gap-32">

        <!-- ============================================================ -->
        <!-- Left block: Logo + Social icons (stacked vertically)        -->
        <!-- ============================================================ -->
        <div class="flex flex-col items-center md:items-start flex-shrink-0">
          <!-- Logo — BUG FIX: use localePath to preserve language context -->
          <NuxtLink :to="localePath('/')" class="block" aria-label="SSM TV">
            <img
              src="/logo-ssm.png"
              alt="SSM TV"
              width="200"
              height="80"
              loading="lazy"
              class="h-16 lg:h-20 w-auto"
            />
          </NuxtLink>

          <!-- Social icons — horizontal row -->
          <div class="flex gap-3 -mt-1.5">
            <!-- YouTube -->
            <a
              href="https://www.youtube.com/@THESTRUGGLESOFSINGLESMOTHERS"
              target="_blank"
              rel="noopener noreferrer"
              class="w-9 h-9 rounded-full bg-white/10 hover:bg-red-600 flex items-center justify-center transition-colors"
              aria-label="YouTube"
              title="YouTube"
            >
              <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>

            <!-- Instagram -->
            <a
              href="https://www.instagram.com/nolinda_belle?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
              class="w-9 h-9 rounded-full bg-white/10 hover:bg-pink-600 flex items-center justify-center transition-colors"
              aria-label="Instagram"
              title="Instagram"
            >
              <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 01-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 017.8 2m.2 2A3.6 3.6 0 004.4 8v8a3.6 3.6 0 003.6 3.6h8a3.6 3.6 0 003.6-3.6V8A3.6 3.6 0 0016 4.4H8m9.65 1.5a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5M12 7a5 5 0 110 10 5 5 0 010-10m0 2a3 3 0 100 6 3 3 0 000-6z"/>
              </svg>
            </a>

            <!-- Phone -->
            <a
              href="tel:0781909250"
              class="w-9 h-9 rounded-full bg-white/10 hover:bg-green-600 flex items-center justify-center transition-colors"
              aria-label="Phone"
              title="Phone"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
            </a>
          </div>
        </div>

        <!-- ============================================================ -->
        <!-- Center block: Vertical nav menu                             -->
        <!-- ============================================================ -->
        <div class="flex-1 flex justify-center">
          <nav aria-label="Footer navigation">
            <ul class="divide-y divide-white/10">
              <!-- BUG FIX: Use NuxtLink + localePath instead of plain <a> tags.
                   Previously footer links used <a :href="item.to"> which bypassed
                   locale prefixing, causing full page reloads and language reset. -->
              <li v-for="item in footerLinks" :key="item.to">
                <NuxtLink
                  :to="localePath(item.to)"
                  class="block py-3.5 px-2 text-sm font-bold text-white hover:text-neutral-300 transition-colors tracking-wider uppercase"
                >
                  {{ $t(item.labelKey) }}
                </NuxtLink>
              </li>
            </ul>
          </nav>
        </div>

      </div>

      <!-- ============================================================ -->
      <!-- AD: Footer Sponsors                                          -->
      <!-- ============================================================ -->
      <div class="mt-14 pt-6 border-t border-white/10">
        <AdPlacement placement="footer_sponsor" :limit="6" />
      </div>

      <!-- ============================================================ -->
      <!-- Copyright line                                               -->
      <!-- ============================================================ -->
      <div class="pt-6 text-center">
        <p class="text-xs text-neutral-500">
          &copy; {{ new Date().getFullYear() }} SSM TV. {{ $t('footer.copyright') }}
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// BUG FIX: Added useLocalePath for i18n-aware navigation in footer links
const localePath = useLocalePath()

// Footer nav items — i18n key resolved via $t() in template
const footerLinks = [
  { to: '/', labelKey: 'nav.home' },
  { to: '/category/politiki', labelKey: 'nav.politiki' },
  { to: '/category/ubuzima', labelKey: 'nav.ubuzima' },
  { to: '/category/ubucuruzi', labelKey: 'nav.ubucuruzi' },
  { to: '/category/ikoranabuhanga', labelKey: 'nav.ikoranabuhanga' },
  { to: '/category/imyidagaduro', labelKey: 'nav.imyidagaduro' },
  { to: '/category/imikino', labelKey: 'nav.imikino' },
  { to: '/ssm-tv', labelKey: 'nav.ssmTv' },
  { to: '/about', labelKey: 'nav.about' },
  { to: '/contact', labelKey: 'nav.contact' },
]
</script>
