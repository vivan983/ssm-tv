// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  // BUG FIX: Disable DevTools in production to prevent exposing
  // component state and runtime config to end users.
  devtools: { enabled: process.env.NODE_ENV !== 'production' },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n',
    '@nuxtjs/supabase',
    '@pinia/nuxt',
  ],

  i18n: {
    locales: [
      { code: 'rw', iso: 'rw-RW', file: 'rw.json', name: 'Kinyarwanda' },
      { code: 'en', iso: 'en-US', file: 'en.json', name: 'English' },
      { code: 'fr', iso: 'fr-FR', file: 'fr.json', name: 'Français' },
    ],
    lazy: true,
    // langDir is relative to the i18n/ directory (where i18n.config.ts lives),
    // so 'locales' → 'i18n/locales/'. This is the canonical locale directory.
    langDir: 'locales',
    defaultLocale: 'rw',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'ssm_locale',
      alwaysRedirect: false,
    },
  },

  supabase: {
    // Publishable (anon) key hardcoded directly — NEVER use sb_secret_ key here.
    // The secret key causes "Forbidden use of secret API key in browser" errors
    // because Nuxt injects this key into client-side bundles for browser auth.
    url: 'https://lmmecjuybkfwxzzmfpnw.supabase.co',
    key: 'sb_publishable_dbwffn1F8PycyoHDNF9Y2Q_g6Y5mfte',
    redirect: false,
    redirectOptions: {
      login: '/admin/login',
      callback: '/admin',
      exclude: ['/', '/en/**', '/fr/**', '/about/**', '/contact/**', '/terms/**', '/privacy/**', '/cookies/**', '/ssm-tv/**', '/article/**', '/category/**', '/search/**'],
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'rw' },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      titleTemplate: '%s | SSM TV',
      meta: [
        { name: 'theme-color', content: '#15803D' },
        { name: 'description', content: 'SSM TV - Amakuru, Ibizamini, n\'Ibindi' },
        { property: 'og:site_name', content: 'SSM TV' },
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'rw_RW' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      link: [
        // Official SSM TV brand favicon — multiple sizes for desktop & mobile
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
        // Fonts
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap' },
      ],
    },
  },

  nitro: {
    prerender: {
      routes: ['/'],
    },
    // BUG FIX: Add security headers. Previously the site had no CSP,
    // X-Frame-Options, X-Content-Type-Options, HSTS, or Referrer-Policy.
    routeRules: {
      '/**': {
        headers: {
          'X-Frame-Options': 'DENY',
          'X-Content-Type-Options': 'nosniff',
          'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
          'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
        },
      },
      '/admin/**': {
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      },
      '/api/**': {
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      },
    },
  },

  runtimeConfig: {
    // Server-side only — never exposed to the client
    youtubeApiKey: process.env.YOUTUBE_API_KEY || '',
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY,
      siteUrl: process.env.SITE_URL || 'https://ssmtv.rw',
    },
  },

  // Sitemap handled via custom server/routes/sitemap.xml.ts
})
