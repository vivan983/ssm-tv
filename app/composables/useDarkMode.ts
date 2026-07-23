// ======================================================================
// Dark Mode Composable — class-based (Tailwind darkMode: 'class')
// Persists preference to localStorage, respects system preference on
// first visit, toggled by a button in the header.
// ======================================================================

const DARK_MODE_KEY = 'ssm_dark_mode'

// Global reactive state so it's shared across components
const isDark = ref(false)

export function useDarkMode() {
  // Initialise on first call only
  if (typeof window !== 'undefined' && !localStorage.getItem(DARK_MODE_KEY)) {
    const stored = localStorage.getItem(DARK_MODE_KEY)
    if (stored !== null) {
      isDark.value = stored === 'true'
    } else {
      // Respect system preference on first visit
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
  } else if (typeof window !== 'undefined') {
    isDark.value = localStorage.getItem(DARK_MODE_KEY) === 'true'
  }

  // Keep <html> class in sync
  watch(isDark, (val) => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', val)
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(DARK_MODE_KEY, String(val))
    }
  }, { immediate: true })

  function toggle() {
    isDark.value = !isDark.value
  }

  return {
    isDark: computed(() => isDark.value),
    toggle,
  }
}
