import { useSupabaseServer } from '../utils/supabase-admin'

export default defineEventHandler(async (event) => {
  const supabase = useSupabaseServer()
  const siteUrl = process.env.SITE_URL || 'https://ssmtv.rw'

  // Fetch all published article slugs
  const { data: articles } = await supabase
    .from('articles')
    .select('slug, updated_at')
    .eq('is_published', true)
    .order('published_at', { ascending: false })

  // Fetch all active category slugs
  const { data: categories } = await supabase
    .from('categories')
    .select('slug')
    .eq('is_active', true)

  const urls: Array<{ loc: string; lastmod: string; changefreq: string; priority: string }> = []

  // Static pages per locale
  const locales = [
    { code: '', default: true },
    { code: '/en', default: false },
    { code: '/fr', default: false },
  ]

  const staticPages = ['', '/ssm-tv', '/about', '/contact', '/terms', '/privacy', '/cookies']

  for (const locale of locales) {
    for (const page of staticPages) {
      urls.push({
        loc: `${siteUrl}${locale.code}${page}`,
        lastmod: new Date().toISOString(),
        changefreq: 'daily',
        priority: page === '' ? '1.0' : '0.8',
      })
    }
  }

  // Category pages
  for (const cat of categories || []) {
    for (const locale of locales) {
      urls.push({
        loc: `${siteUrl}${locale.code}/category/${cat.slug}`,
        lastmod: new Date().toISOString(),
        changefreq: 'daily',
        priority: '0.8',
      })
    }
  }

  // Article pages
  for (const article of articles || []) {
    for (const locale of locales) {
      urls.push({
        loc: `${siteUrl}${locale.code}/article/${article.slug}`,
        lastmod: article.updated_at || new Date().toISOString(),
        changefreq: 'weekly',
        priority: '0.9',
      })
    }
  }

  // Build XML
  const escapeXml = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls
  .map(
    (u) => `  <url>
    <loc>${escapeXml(u.loc)}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`

  event.node.res.setHeader('Content-Type', 'application/xml; charset=utf-8')
  return xml
})
