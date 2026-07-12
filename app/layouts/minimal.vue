<template>
  <div class="min-h-screen bg-neutral-50 flex flex-col">
    <main class="flex-1 flex items-center justify-center p-4">
      <slot />
    </main>
    <BaseToast />
  </div>
</template>

<script setup lang="ts">
import BaseToast from '~/components/ui/BaseToast.vue'
</script>
