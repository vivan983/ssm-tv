<template>
  <div class="relative" ref="dropdownRef">
    <button
      class="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold uppercase text-neutral-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
      @click="open = !open"
      :aria-label="$t('nav.menu')"
    >
      <span>{{ currentLocale.toUpperCase() }}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-3.5 w-3.5 transition-transform"
        :class="{ 'rotate-180': open }"
        fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <Transition
      enter-active-class="transition ease-out duration-150"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-100"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="open"
        class="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-neutral-200 py-1 z-50"
      >
        <button
          v-for="locale in locales"
          :key="locale.code"
          @click="switchLocale(locale.code); open = false"
          class="w-full text-left px-4 py-2.5 text-sm hover:bg-green-50 transition-colors flex items-center justify-between"
          :class="{ 'text-green-700 font-semibold bg-green-50/50': currentLocale === locale.code, 'text-neutral-700': currentLocale !== locale.code }"
        >
          <span>{{ locale.name }}</span>
          <svg
            v-if="currentLocale === locale.code"
            xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const { locale, locales: i18nLocales } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const router = useRouter()

const open = ref(false)
const dropdownRef = ref<HTMLElement>()

const currentLocale = computed(() => locale.value)

const locales = computed(() =>
  (i18nLocales.value as Array<{ code: string; name?: string }>).map((l) => ({
    code: l.code,
    name: l.name || l.code.toUpperCase(),
  }))
)

function switchLocale(code: string) {
  router.push(switchLocalePath(code))
}

// Close dropdown on outside click
onMounted(() => {
  document.addEventListener('click', (e) => {
    if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
      open.value = false
    }
  })
})
</script>
