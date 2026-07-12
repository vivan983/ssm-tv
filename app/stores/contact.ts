import { defineStore } from 'pinia'

interface ContactState {
  submitting: boolean
  success: boolean
  error: string | null
}

export const useContactStore = defineStore('contact', {
  state: (): ContactState => ({
    submitting: false,
    success: false,
    error: null,
  }),

  actions: {
    async submit(formData: { name: string; email: string; subject?: string; message: string }) {
      this.submitting = true
      this.error = null
      this.success = false

      try {
        const { data, error } = await useFetch('/api/contact', {
          method: 'POST',
          body: formData,
        })

        if (error.value) {
          this.error = (error.value as any)?.message || 'Submission failed'
          return false
        }

        this.success = true
        return true
      } catch (e: any) {
        this.error = e.message || 'An unexpected error occurred'
        return false
      } finally {
        this.submitting = false
      }
    },

    reset() {
      this.submitting = false
      this.success = false
      this.error = null
    },
  },
})
