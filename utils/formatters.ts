export function formatDate(date: string | Date, locale = 'rw'): string {
  const d = new Date(date)
  return d.toLocaleDateString(locale === 'rw' ? 'rw-RW' : locale === 'fr' ? 'fr-FR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatDateShort(date: string | Date, locale = 'rw'): string {
  const d = new Date(date)
  return d.toLocaleDateString(locale === 'rw' ? 'rw-RW' : locale === 'fr' ? 'fr-FR' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function timeAgo(date: string | Date, locale = 'rw'): string {
  const now = new Date()
  const d = new Date(date)
  const seconds = Math.floor((now.getTime() - d.getTime()) / 1000)

  const rtf = new Intl.RelativeTimeFormat(locale === 'rw' ? 'rw' : locale, { numeric: 'auto' })

  if (seconds < 60) return rtf.format(-seconds, 'second')
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return rtf.format(-minutes, 'minute')
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return rtf.format(-hours, 'hour')
  const days = Math.floor(hours / 24)
  if (days < 30) return rtf.format(-days, 'day')
  const months = Math.floor(days / 30)
  if (months < 12) return rtf.format(-months, 'month')
  const years = Math.floor(months / 12)
  return rtf.format(-years, 'year')
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trimEnd() + '...'
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function estimateReadTime(content: string): number {
  const wordsPerMinute = 200
  const text = content.replace(/<[^>]*>/g, '') // Strip HTML
  const wordCount = text.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute))
}

export function formatViewCount(count: number): string {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
  return count.toString()
}

export function getYouTubeThumbnail(url: string): string {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  )
  if (match) {
    return `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg`
  }
  return ''
}

export function getYouTubeEmbedUrl(url: string): string {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  )
  if (match) {
    return `https://www.youtube.com/embed/${match[1]}`
  }
  return ''
}
