import { defineStore } from 'pinia'
import type { Article, PaginatedResponse } from '~/types/article'

interface ArticlesState {
  featured: Article | null
  featuredLoading: boolean
  latest: Article[]
  latestLoading: boolean
  latestError: string | null
  latestPage: number
  latestTotalPages: number
  currentArticle: Article | null
  currentArticleLoading: boolean
  currentArticleError: string | null
  categoryArticles: Article[]
  categoryArticlesLoading: boolean
  categoryArticlesError: string | null
  categoryArticlesPage: number
  categoryArticlesTotalPages: number
  categoryMeta: { name?: string; description?: string } | null
  mostRead: Article[]
  mostReadLoading: boolean
  mostReadError: string | null
  relatedArticles: Article[]
  relatedLoading: boolean
  searchResults: Article[]
  searchLoading: boolean
  searchError: string | null
}

export const useArticlesStore = defineStore('articles', {
  state: (): ArticlesState => ({
    featured: null,
    featuredLoading: false,
    latest: [],
    latestLoading: false,
    latestError: null,
    latestPage: 1,
    latestTotalPages: 1,
    currentArticle: null,
    currentArticleLoading: false,
    currentArticleError: null,
    categoryArticles: [],
    categoryArticlesLoading: false,
    categoryArticlesError: null,
    categoryArticlesPage: 1,
    categoryArticlesTotalPages: 1,
    categoryMeta: null,
    mostRead: [],
    mostReadLoading: false,
    mostReadError: null,
    relatedArticles: [],
    relatedLoading: false,
    searchResults: [],
    searchLoading: false,
    searchError: null,
  }),

  actions: {
    async fetchFeatured() {
      this.featuredLoading = true
      try {
        // BUG FIX: Use $fetch instead of useFetch for client-side-only fetch.
        // useFetch is designed for SSR data fetching; $fetch is lighter for
        // store actions called from onMounted. The server endpoint now uses
        // useSupabaseAdmin() so RLS on profiles no longer blocks the author join.
        const result = await $fetch('/api/articles/featured')
        this.featured = (result as any)?.data || null
      } catch {
        this.featured = null
      } finally {
        this.featuredLoading = false
      }
    },

    async fetchLatest(page = 1, perPage = 12) {
      this.latestLoading = true
      this.latestError = null
      try {
        const { data } = await useFetch('/api/articles', {
          query: { page, perPage },
        })
        const response = data.value as unknown as PaginatedResponse<Article>
        if (response) {
          this.latest = response.data
          this.latestPage = response.page
          this.latestTotalPages = response.totalPages
        }
      } catch (e: any) {
        this.latestError = e.message
      } finally {
        this.latestLoading = false
      }
    },

    // BUG FIX: Switched from useFetch to $fetch. useFetch is a Nuxt SSR
    // composable that relies on component-level setup() context for request
    // deduplication. When called from a Pinia store action (triggered by
    // onMounted), useFetch can return stale or empty payloads from the SSR
    // hydration cache instead of fresh data. $fetch has no such magic.
    // Also now stores category metadata so the page doesn't need a second call.
    async fetchByCategory(slug: string, page = 1, perPage = 12) {
      this.categoryArticlesLoading = true
      this.categoryArticlesError = null
      try {
        const response = await this.fetchCategoryArticles(slug, page, perPage)
        if (response?.articles) {
          this.categoryArticles = response.articles
          this.categoryArticlesPage = response.page || page
          this.categoryArticlesTotalPages = response.totalPages || 1
        }
        // Store category metadata so the page doesn't need a separate API call
        if (response?.data) {
          this.categoryMeta = response.data
        }
      } catch (e: any) {
        this.categoryArticlesError = e.message
      } finally {
        this.categoryArticlesLoading = false
      }
    },

    // OPTIONAL: Pure fetch function that returns the raw API response.
    // Designed to be wrapped by useAsyncData in a page's <script setup> for
    // SSR-compatible data fetching with unique cache keys.
    // Usage from a page:
    //   const { data, pending } = useAsyncData(
    //     () => `category-${slug.value}`,
    //     () => store.fetchCategoryArticles(slug.value)
    //   )
    async fetchCategoryArticles(slug: string, page = 1, perPage = 12) {
      return await $fetch(`/api/categories/${slug}`, {
        query: { page, perPage },
      }) as {
        data: { name?: string; description?: string; slug: string }
        articles: any[]
        total: number
        page: number
        totalPages: number
      }
    },

    async fetchArticle(slug: string) {
      this.currentArticleLoading = true
      this.currentArticleError = null
      try {
        const { data } = await useFetch(`/api/articles/${slug}`)
        this.currentArticle = (data.value as any)?.data || null
      } catch (e: any) {
        this.currentArticleError = e.message
      } finally {
        this.currentArticleLoading = false
      }
    },

    async fetchMostRead(limit = 5) {
      this.mostReadLoading = true
      this.mostReadError = null
      try {
        const result = await $fetch('/api/articles/most-read', {
          query: { limit },
        })
        this.mostRead = (result as any)?.data || []
      } catch (e: any) {
        this.mostReadError = e?.message || 'Failed to load most read'
        this.mostRead = []
      } finally {
        this.mostReadLoading = false
      }
    },

    async fetchRelated(categoryId: string, currentArticleId: string, limit = 4) {
      this.relatedLoading = true
      try {
        const { data } = await useFetch('/api/articles', {
          query: { category: categoryId, perPage: limit },
        })
        const articles = (data.value as any)?.data || []
        this.relatedArticles = articles.filter((a: Article) => a.id !== currentArticleId).slice(0, limit)
      } catch {
        // Silently fail
      } finally {
        this.relatedLoading = false
      }
    },

    async search(query: string) {
      this.searchLoading = true
      this.searchError = null
      try {
        const { data } = await useFetch('/api/articles', {
          query: { search: query, perPage: 20 },
        })
        this.searchResults = (data.value as any)?.data || []
      } catch (e: any) {
        this.searchError = e.message
      } finally {
        this.searchLoading = false
      }
    },
  },
})
