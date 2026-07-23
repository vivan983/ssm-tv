<template>
  <!-- Backdrop -->
  <Transition
    enter-active-class="transition-opacity duration-200"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-150"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="open" class="fixed inset-0 z-50 bg-black/40 lg:hidden" @click="$emit('close')" />
  </Transition>

  <!-- Drawer panel — slides in from right -->
  <Transition
    enter-active-class="transition-transform duration-250 ease-out"
    enter-from-class="translate-x-full"
    enter-to-class="translate-x-0"
    leave-active-class="transition-transform duration-200 ease-in"
    leave-from-class="translate-x-0"
    leave-to-class="translate-x-full"
  >
    <div v-if="open" class="fixed top-16 right-3 z-50 w-52 bg-white dark:bg-neutral-800 rounded-xl shadow-xl border border-neutral-200 dark:border-neutral-700 lg:hidden overflow-hidden">
      <nav class="py-1.5">
          <NuxtLink
            :to="localePath('/')"
            class="px-3 py-1.5 text-[0.8125rem] font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
            @click="$emit('close')"
          >{{ $t('nav.home') }}</NuxtLink>

          <button
            class="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
            @click="categoriesOpen = !categoriesOpen"
          >
            {{ $t('nav.categories') }}
            <svg class="h-3.5 w-3.5 text-neutral-400 transition-transform duration-200" :class="{ '-rotate-180': categoriesOpen }" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>

          <div class="grid transition-all duration-200 ease-out" :class="categoriesOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'">
            <div class="overflow-hidden">
              <NuxtLink
                v-for="cat in categories"
                :key="cat.to"
                :to="localePath(cat.to)"
                class="block py-1.5 pl-8 text-xs text-neutral-500 dark:text-neutral-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                @click="$emit('close')"
              >{{ $t(cat.labelKey) }}</NuxtLink>
            </div>
          </div>

          <NuxtLink
            :to="localePath('/ssm-tv')"
            class="px-3 py-1.5 text-[0.8125rem] font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
            @click="$emit('close')"
          >{{ $t('nav.ssmTv') }}</NuxtLink>
      </nav>
    </div>
  </Transition>
</template>

<script setup lang="ts">
defineProps<{ open: boolean }>()
defineEmits<{ close: [] }>()
const localePath = useLocalePath()
const categoriesOpen = ref(false)

const categories = [
  { to: '/category/politiki', labelKey: 'nav.politiki' },
  { to: '/category/ubuzima', labelKey: 'nav.ubuzima' },
  { to: '/category/ubucuruzi', labelKey: 'nav.ubucuruzi' },
  { to: '/category/ikoranabuhanga', labelKey: 'nav.ikoranabuhanga' },
  { to: '/category/imyidagaduro', labelKey: 'nav.imyidagaduro' },
  { to: '/category/imikino', labelKey: 'nav.imikino' },
]
</script>
