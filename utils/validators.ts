import { z } from 'zod'

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  email: z.string().email('Invalid email address'),
  subject: z.string().max(300, 'Subject is too long').optional().or(z.literal('')),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message is too long'),
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const articleTranslationSchema = z.object({
  language_code: z.enum(['rw', 'en', 'fr']),
  title: z.string().min(1, 'Title is required').max(300, 'Title is too long'),
  excerpt: z.string().max(500, 'Excerpt is too long').optional().nullable(),
  content: z.string().optional().nullable(),
})

export const articleCreateSchema = z.object({
  slug: z
    .string()
    .min(3, 'Slug must be at least 3 characters')
    .max(200)
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens only'),
  category_id: z.string().uuid('Invalid category').optional().nullable(),
  featured_image: z.string().url().optional().nullable().or(z.literal('')),
  featured_image_alt: z.string().max(200).optional().nullable().or(z.literal('')),
  is_featured: z.boolean().default(false),
  is_published: z.boolean().default(false),
  is_video: z.boolean().default(false),
  youtube_url: z.string().url().optional().nullable().or(z.literal('')),
  published_at: z.string().optional().nullable(),
  meta_title: z.string().max(200).optional().nullable().or(z.literal('')),
  meta_description: z.string().max(500).optional().nullable().or(z.literal('')),
  og_image: z.string().url().optional().nullable().or(z.literal('')),
  translations: z
    .array(articleTranslationSchema)
    .min(1, 'At least one translation is required'),
})

export const categoryCreateSchema = z.object({
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .max(100)
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens only'),
  display_order: z.number().int().default(0),
  is_active: z.boolean().default(true),
  translations: z
    .array(
      z.object({
        language_code: z.enum(['rw', 'en', 'fr']),
        name: z.string().min(1, 'Name is required').max(200),
        description: z.string().max(500).optional().nullable(),
      })
    )
    .min(1, 'At least one translation is required'),
})

export type ContactFormInput = z.infer<typeof contactFormSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type ArticleCreateInput = z.infer<typeof articleCreateSchema>
export type CategoryCreateInput = z.infer<typeof categoryCreateSchema>
