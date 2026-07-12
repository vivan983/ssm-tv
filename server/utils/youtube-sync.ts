/**
 * YouTube Video Sync Utility
 * Syncs fetched videos to Supabase DB for persistence.
 * DB sync is optional — failures are silently handled.
 */
import { useSupabaseServer } from './supabase-admin'

const YOUTUBE_HANDLE = 'THESTRUGGLESOFSINGLESMOTHERS'

function generateSlug(title: string, videoId: string): string {
  const slug = title
    .replace(/[^\w\s-]/g, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 200)
  return `${slug}-${videoId.substring(0, 8)}`
}

export async function syncVideosToDB(videos: {
  videoId: string
  title: string
  description: string
  publishedAt: string
}[]) {
  const rows = videos.map((v) => ({
    youtube_video_id: v.videoId,
    title: v.title,
    slug: generateSlug(v.title, v.videoId),
    thumbnail: `https://i.ytimg.com/vi/${v.videoId}/hqdefault.jpg`,
    video_url: `https://www.youtube.com/watch?v=${v.videoId}`,
    views: 0,
    comments_count: 0,
    description: v.description || '',
    duration: '',
    published_at: v.publishedAt || new Date().toISOString(),
  }))

  try {
    const supabase = useSupabaseServer()
    if (!supabase) return
    await supabase.from('youtube_videos').upsert(rows, {
      onConflict: 'youtube_video_id',
      ignoreDuplicates: false,
    })
  } catch {
    // DB sync is optional — continue without it
  }
}
