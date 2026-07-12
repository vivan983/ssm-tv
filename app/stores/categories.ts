import { defineStore } from 'pinia'
import type { Category } from '~/types/article'

interface CategoriesState {
  items: Category[]
  loading: boolean
  error: string | null
  currentCategory: Category | null
}

export const useCategoriesStore = defineStore('categories', {
  state: (): CategoriesState => ({
    items: [],
    loading: false,
    error: null,
    currentCategory: null,
  }),

  actions: {
    async fetchAll() {
      this.loading = true
      this.error = null
      try {
        const { data } = await useFetch('/api/categories')
        this.items = (data.value as any)?.data || []
      } catch (e: any) {
        this.error = e.message
      } finally {
        this.loading = false
      }
    },

    async fetchBySlug(slug: string) {
      this.loading = true
      this.error = null
      try {
        const { data } = await useFetch(`/api/categories/${slug}`)
        const response = data.value as any
        this.currentCategory = response?.data || response || null
      } catch (e: any) {
        this.error = e.message
      } finally {
        this.loading = false
      }
    },
  },
})
