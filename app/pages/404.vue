<template>
  <div class="min-h-[60vh] flex items-center justify-center">
    <div class="text-center max-w-md">
      <div class="text-8xl font-black mb-4">
        <span class="text-brand-green">4</span><span class="text-brand-blue">0</span><span class="text-brand-red">4</span>
      </div>
      <h1 class="text-2xl font-bold text-neutral-900 mb-3">
        {{ $t('errors.notFound') }}
      </h1>
      <p class="text-neutral-600 mb-8">
        {{ $t('errors.notFoundDesc') }}
      </p>
      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <BaseButton @click="navigateTo(localePath('/'))">
          {{ $t('errors.goHome') }}
        </BaseButton>
        <BaseButton variant="outline" @click="router.back()">
          ← {{ $t('errors.goBack') }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseButton from '~/components/ui/BaseButton.vue'

const { t } = useI18n()
const localePath = useLocalePath()
const router = useRouter()

useHead({
  title: t('errors.notFound'),
})

definePageMeta({
  layout: 'default',
})
</script>
