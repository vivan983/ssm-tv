import { defineStore } from 'pinia'

export interface Toast {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
  duration?: number
  dismissible?: boolean
}

interface UIState {
  sidebarOpen: boolean
  mobileNavOpen: boolean
  toasts: Toast[]
  breakingNews: string | null
  isScrolled: boolean
}

export const useUiStore = defineStore('ui', {
  state: (): UIState => ({
    sidebarOpen: false,
    mobileNavOpen: false,
    toasts: [],
    breakingNews: null,
    isScrolled: false,
  }),

  actions: {
    showToast(toast: Omit<Toast, 'id'>) {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
      const newToast: Toast = { id, ...toast }
      this.toasts.push(newToast)

      const duration = toast.duration || 4000
      if (duration > 0) {
        setTimeout(() => this.removeToast(id), duration)
      }
    },

    removeToast(id: string) {
      this.toasts = this.toasts.filter((t) => t.id !== id)
    },

    setScrolled(val: boolean) {
      this.isScrolled = val
    },
  },
})
