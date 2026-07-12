export interface ArticleTranslation {
  id: string
  article_id: string
  language_code: 'rw' | 'en' | 'fr'
  title: string
  excerpt: string | null
  content: string | null
}

export interface Article {
  id: string
  slug: string
  category_id: string | null
  category?: Category
  author_id: string | null
  author?: Profile
  featured_image: string | null
  featured_image_alt: string | null
  is_featured: boolean
  is_published: boolean
  is_video: boolean
  youtube_url: string | null
  published_at: string | null
  created_at: string
  updated_at: string
  view_count: number
  meta_title: string | null
  meta_description: string | null
  og_image: string | null
  // Populated from current locale translation
  title: string
  excerpt: string | null
  content: string | null
  translations?: ArticleTranslation[]
}

export interface CategoryTranslation {
  id: string
  category_id: string
  language_code: 'rw' | 'en' | 'fr'
  name: string
  description: string | null
}

export interface Category {
  id: string
  slug: string
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
  // Populated from current locale translation
  name: string
  description: string | null
  translations?: CategoryTranslation[]
}

export interface Profile {
  id: string
  email: string
  display_name: string
  avatar_url: string | null
  role: 'admin' | 'editor' | 'contributor'
  bio: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  totalPages: number
  perPage: number
}
