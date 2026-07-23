<!-- =====================================================================
     ARTICLE CONTENT (Prose / Body Text)
     Premium editorial typography for long-form news reading.
     ===================================================================== -->
<template>
  <div class="bbc-prose" v-html="sanitizedContent" />
</template>

<script setup lang="ts">
const props = defineProps<{
  content: string
}>()

const sanitizedContent = computed(() => {
  if (!props.content) return ''
  return props.content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/\son\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/\son\w+\s*=\s*[^\s>]+/gi, '')
})
</script>

<style scoped>
/* ===================================================================
   PROSE CONTAINER
   18px body on Inter. 1.75 line-height for relaxed reading rhythm.
   Dark gray #383838 — not pure black — reduces eye strain.
   =================================================================== */
.bbc-prose {
  font-family: 'Inter', 'Noto Sans', system-ui, -apple-system, sans-serif;
  font-size: 1.125rem;
  line-height: 1.75;
  color: var(--text-body);
  letter-spacing: 0.002em;
  word-wrap: break-word;
  overflow-wrap: break-word;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* ---- Paragraphs: generous 1.5em spacing ---- */
.bbc-prose p {
  margin: 0 0 1.5em 0;
  font-size: inherit;
  line-height: inherit;
  color: inherit;
}

.bbc-prose p:last-child {
  margin-bottom: 0;
}

/* Lead paragraph: slightly larger and darker to draw the reader in */
.bbc-prose > p:first-of-type {
  font-size: 1.1875rem;
  line-height: 1.7;
  color: #242424;
  margin-bottom: 1.75em;
}

/* ---- H2: primary subheading ---- */
.bbc-prose h2 {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.3;
  color: var(--text-heading);
  margin: 2.25em 0 0.5em 0;
  letter-spacing: -0.012em;
}

/* ---- H3: secondary subheading ---- */
.bbc-prose h3 {
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.4;
  color: var(--text-heading);
  margin: 1.75em 0 0.45em 0;
  letter-spacing: -0.008em;
}

/* ---- H4-H6 ---- */
.bbc-prose h4,
.bbc-prose h5,
.bbc-prose h6 {
  font-size: 1.0625rem;
  font-weight: 700;
  line-height: 1.5;
  color: var(--text-heading);
  margin: 1.5em 0 0.4em 0;
}

/* ---- Links: dark with green underline accent ---- */
.bbc-prose a {
  color: var(--text-heading);
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 4px;
  text-decoration-thickness: 1.5px;
  text-decoration-color: #16a34a;
  transition: color 0.2s ease, text-decoration-color 0.2s ease;
}

.bbc-prose a:hover {
  color: #16a34a;
  text-decoration-color: var(--text-heading);
}

/* ---- Bold / italic ---- */
.bbc-prose strong,
.bbc-prose b {
  font-weight: 700;
  color: #1a1a1a;
}

.bbc-prose em,
.bbc-prose i {
  font-style: italic;
}

/* ---- Lists ---- */
.bbc-prose ul,
.bbc-prose ol {
  margin: 0 0 1.5em 0;
  padding-left: 1.6em;
}

.bbc-prose ul { list-style-type: disc; }
.bbc-prose ol { list-style-type: decimal; }

.bbc-prose li {
  margin-bottom: 0.45em;
  padding-left: 0.15em;
}

.bbc-prose li::marker {
  color: #6b7280;
}

.bbc-prose li:last-child {
  margin-bottom: 0;
}

.bbc-prose li > ul,
.bbc-prose li > ol {
  margin-top: 0.45em;
  margin-bottom: 0;
}

/* ---- Blockquotes: green left border, subtle background ---- */
.bbc-prose blockquote {
  margin: 2em 0;
  padding: 1em 0 1em 1.5em;
  border-left: 4px solid #16a34a;
  background: #f9fafb;
  border-radius: 0 4px 4px 0;
  color: #4b5563;
  font-style: italic;
}

.bbc-prose blockquote p {
  margin: 0 0 0.6em 0;
  font-size: 1.0625rem;
  line-height: 1.7;
  color: inherit;
}

.bbc-prose blockquote p:last-child {
  margin-bottom: 0;
}

.bbc-prose blockquote cite {
  display: block;
  margin-top: 0.75em;
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 600;
  color: var(--text-heading);
}

/* ---- Images and figures: generous spacing ---- */
.bbc-prose figure {
  margin: 2em 0;
}

.bbc-prose img {
  display: block;
  max-width: 100%;
  height: auto;
  border-radius: 2px;
}

.bbc-prose figcaption {
  margin-top: 10px;
  font-size: 0.8125rem;
  line-height: 1.55;
  color: #6e6e73;
}

/* ---- Horizontal rules ---- */
.bbc-prose hr {
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 2.25em 0;
}

/* ---- Code ---- */
.bbc-prose code {
  font-family: 'SF Mono', 'Fira Code', 'Consolas', monospace;
  font-size: 0.9em;
  background: #f3f4f6;
  padding: 0.15em 0.45em;
  border-radius: 3px;
  color: var(--text-heading);
}

.bbc-prose pre {
  background: #f3f4f6;
  padding: 1.25em;
  border-radius: 4px;
  overflow-x: auto;
  margin: 1.5em 0;
  font-size: 0.925rem;
  line-height: 1.65;
}

.bbc-prose pre code {
  background: none;
  padding: 0;
  border-radius: 0;
}

/* ---- Tables ---- */
.bbc-prose table {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5em 0;
  font-size: 0.9375rem;
}

.bbc-prose th {
  text-align: left;
  font-weight: 700;
  padding: 10px 14px;
  border-bottom: 2px solid #d1d5db;
  color: var(--text-heading);
  background: #f9fafb;
}

.bbc-prose td {
  padding: 10px 14px;
  border-bottom: 1px solid #f3f4f6;
  color: var(--text-body);
}

/* ---- Embedded media ---- */
.bbc-prose iframe,
.bbc-prose video,
.bbc-prose audio,
.bbc-prose embed {
  display: block;
  max-width: 100%;
  margin: 1.75em 0;
  border-radius: 2px;
}

.bbc-prose iframe[src*="youtube"],
.bbc-prose iframe[src*="youtube-nocookie"] {
  aspect-ratio: 16 / 9;
  width: 100%;
  height: auto;
}

/* ---- Tablet (768px) ---- */
@media (max-width: 768px) {
  .bbc-prose {
    font-size: 1.0625rem;
    line-height: 1.7;
  }

  .bbc-prose > p:first-of-type {
    font-size: 1.125rem;
  }

  .bbc-prose h2 {
    font-size: 1.375rem;
    margin-top: 1.75em;
  }

  .bbc-prose h3 {
    font-size: 1.1875rem;
  }

  .bbc-prose blockquote {
    margin: 1.5em 0;
    padding: 0.85em 0 0.85em 1.25em;
  }
}

/* ---- Phone (480px) ---- */
@media (max-width: 480px) {
  .bbc-prose {
    font-size: 1rem;
    line-height: 1.65;
    letter-spacing: 0.001em;
  }

  .bbc-prose > p:first-of-type {
    font-size: 1.0625rem;
    line-height: 1.65;
    margin-bottom: 1.5em;
  }

  .bbc-prose p {
    margin-bottom: 1.25em;
  }

  .bbc-prose h2 {
    font-size: 1.25rem;
    margin: 1.5em 0 0.4em 0;
  }

  .bbc-prose h3 {
    font-size: 1.125rem;
    margin: 1.25em 0 0.35em 0;
  }

  .bbc-prose h4,
  .bbc-prose h5,
  .bbc-prose h6 {
    font-size: 1rem;
    margin: 1.125em 0 0.3em 0;
  }

  .bbc-prose figure {
    margin: 1.5em 0;
  }

  .bbc-prose blockquote {
    margin: 1.25em 0;
    padding: 0.75em 0 0.75em 1em;
  }

  .bbc-prose blockquote p {
    font-size: 1rem;
    line-height: 1.65;
  }

  .bbc-prose ul,
  .bbc-prose ol {
    padding-left: 1.4em;
  }

  .bbc-prose hr {
    margin: 1.75em 0;
  }
}

/* ---- Print ---- */
@media print {
  .bbc-prose {
    font-size: 11.5pt;
    line-height: 1.55;
    color: #000;
    letter-spacing: 0;
  }

  .bbc-prose > p:first-of-type {
    font-size: 11.5pt;
    color: #000;
  }

  .bbc-prose a {
    color: #000;
    text-decoration: underline;
    text-decoration-color: #000;
  }

  .bbc-prose blockquote {
    background: none;
    border-left-color: #000;
    color: #000;
  }

  .bbc-prose h2,
  .bbc-prose h3,
  .bbc-prose h4,
  .bbc-prose h5,
  .bbc-prose h6 {
    color: #000;
  }
}

/* ---- Dark mode ---- */
:root.dark .bbc-prose {
  color: #d1d5db;
}

:root.dark .bbc-prose h1,
:root.dark .bbc-prose h2,
:root.dark .bbc-prose h3,
:root.dark .bbc-prose h4,
:root.dark .bbc-prose h5,
:root.dark .bbc-prose h6 {
  color: #e5e7eb;
}

:root.dark .bbc-prose blockquote {
  background: #111111;
  border-left-color: #4ade80;
  color: #9ca3af;
}

:root.dark .bbc-prose a {
  color: #4ade80;
}

:root.dark .bbc-prose a:hover {
  color: #86efac;
}

:root.dark .bbc-prose .article-intro {
  color: #d1d5db;
}

:root.dark .bbc-prose figcaption {
  color: #9ca3af;
}
</style>
