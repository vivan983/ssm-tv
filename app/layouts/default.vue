<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader />
    <BreakingNewsBar />
    <main class="flex-1">
      <slot />
    </main>
    <Footer />
    <ScrollToTop />
    <BaseToast />
  </div>
</template>

<script setup lang="ts">
import AppHeader from '~/components/layout/AppHeader.vue'
import Footer from '~/components/layout/Footer.vue'
import BreakingNewsBar from '~/components/layout/BreakingNewsBar.vue'
import ScrollToTop from '~/components/layout/ScrollToTop.vue'
import BaseToast from '~/components/ui/BaseToast.vue'
</script>
