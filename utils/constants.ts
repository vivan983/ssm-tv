export const SITE_NAME = 'SSM TV'
export const SITE_URL = process.env.SITE_URL || 'https://ssmtv.rw'
export const DEFAULT_LOCALE = 'rw'
export const LOCALES = ['rw', 'en', 'fr'] as const
export const DEFAULT_PER_PAGE = 12
export const DEFAULT_ADMIN_PER_PAGE = 20
export const MOST_READ_LIMIT = 5
export const RELATED_ARTICLES_LIMIT = 4
export const CATEGORY_PREVIEW_LIMIT = 4
export const MAX_IMAGE_SIZE_MB = 5
export const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
export const CONTACT_RATE_LIMIT = 3 // per hour
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const

export const SOCIAL_LINKS = {
  youtube: 'https://www.youtube.com/@THESTRUGGLESOFSINGLESMOTHERS',
  twitter: 'https://twitter.com/ssmtv',
  facebook: 'https://facebook.com/ssmtv',
  instagram: 'https://www.instagram.com/nolinda_belle?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
} as const

export const CONTACT_INFO = {
  email: 'Umubyeyidenise555@gmail.com',
  phone: '+250 788 000 000',
  location: 'Kigali, Rwanda',
} as const
