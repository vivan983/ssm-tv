export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginationParams {
  page?: number
  perPage?: number
}

export interface ArticleQueryParams extends PaginationParams {
  category?: string
  featured?: boolean
  search?: string
  status?: 'draft' | 'published' | 'all'
}
