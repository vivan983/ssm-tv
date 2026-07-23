<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const { locale } = useI18n()

useHead({
  htmlAttrs: {
    lang: () => locale.value,
  },
})
</script>

<style>
/* =====================================================================
   DARK MODE — non-scoped global styles injected from app.vue
   ===================================================================== */
:root {
  --text-heading: #141414;
  --text-body: #383838;
  --text-muted: #545658;
  --text-subtle: #9ca3af;
  --bg-card: #ffffff;
  --bg-page: #f3f4f6;
  --border-color: #e5e7eb;
  --bg-card-alt: #f9fafb;
}

:root.dark {
  --text-heading: #ffffff;
  --text-body: #ffffff;
  --text-muted: #e5e7eb;
  --text-subtle: #d1d5db;
  --bg-card: #1a1a1a;
  --bg-page: #0a0a0a;
  --border-color: #27272a;
  --bg-card-alt: #111111;
}

html.dark body {
  background-color: #0a0a0a;
  color: #ffffff;
}

html.dark .bg-white { background-color: #1a1a1a !important; }
html.dark .bg-neutral-50,
html.dark .bg-neutral-100 { background-color: #1a1a1a !important; }
html.dark .text-neutral-900,
html.dark .text-neutral-800,
html.dark .text-neutral-700,
html.dark .text-neutral-600 { color: #ffffff !important; }
html.dark .text-neutral-500 { color: #d1d5db !important; }
html.dark .border-neutral-200,
html.dark .border-neutral-100 { border-color: #27272a !important; }

/* Article detail page — override scoped BBC variables */
html.dark .bbc-article {
  --bbc-headline: #ffffff !important;
  --bbc-body: #e5e7eb !important;
  --bbc-meta: #d1d5db !important;
  --bbc-caption: #9ca3af !important;
  --bbc-border: #27272a !important;
  --bbc-bg: #0a0a0a !important;
}

/* Active/highlighted nav — visible in dark mode */
html.dark .text-green-700 { color: #4ade80 !important; }
html.dark .bg-green-50 { background-color: #0d2818 !important; }
html.dark .bg-green-100 { background-color: #0d2818 !important; }
html.dark .hover\:bg-green-50:hover { background-color: #0d2818 !important; }
html.dark .hover\:text-green-700:hover { color: #4ade80 !important; }

/* Contact page — all white boxes dark */
html.dark .contact-info-card,
html.dark .contact-form-wrap,
html.dark .contact-sidebar-card,
html.dark .contact-faq-item { background: #1a1a1a !important; border-color: #27272a !important; }
html.dark .contact-social-btn {
  background: #1a1a1a !important;
  border-color: #27272a !important;
  color: #d1d5db !important;
}
html.dark .contact-social-btn:hover { border-color: transparent !important; }
html.dark .contact-sidebar-card--accent { background: #0d2818 !important; border-color: #166534 !important; }
html.dark .contact-faq-q { background: #1a1a1a !important; color: #e5e7eb !important; }
html.dark .contact-faq-q:hover { background: #27272a !important; }
html.dark .contact-advertise { background: #0d2818 !important; border-color: #166534 !important; }
</style>
