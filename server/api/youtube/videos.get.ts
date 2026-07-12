/**
 * YouTube Videos API
 *
 * Dual-mode: prefers YouTube Data API v3 (if YOUTUBE_API_KEY is set),
 * otherwise falls back to the public RSS feed (no key needed).
 *
 * Both modes resolve the @THESTRUGGLESOFSINGLESMOTHERS handle → channel ID,
 * fetch videos, and cache results server-side for 30 minutes.
 *
 * --- YouTube Data API v3 (with key) ---
 *   - channels.list + playlistItems.list
 *   - More reliable, official endpoint
 *   - Uses ~96 quota units/day out of 10,000 free tier
 *
 * --- RSS feed (no key) ---
 *   - Scrapes channel page HTML for channel ID, then parses XML feed
 *   - youtube.com/feeds/videos.xml?channel_id=...
 *   - Zero cost, no setup required
 *
 * Required env var (optional): YOUTUBE_API_KEY
 *   If set → uses API v3
 *   If missing/placeholder → uses free RSS feed
 */

import { syncVideosToDB } from '../../utils/youtube-sync'

const YOUTUBE_HANDLE = 'THESTRUGGLESOFSINGLESMOTHERS'
const CACHE_TTL_MS = 30 * 60 * 1000 // 30 minutes

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface YouTubeVideoEntry {
  videoId: string
  title: string
  description: string
  thumbnailUrl: string
  publishedAt: string
  channelTitle: string
  url: string
}

interface CacheEntry {
  videos: YouTubeVideoEntry[]
  channelId: string
  fetchedAt: number
  method: 'api' | 'rss'
}

// ---------------------------------------------------------------------------
// In-memory cache
// ---------------------------------------------------------------------------

let cache: CacheEntry | null = null

function isCacheValid(): boolean {
  if (!cache) return false
  return Date.now() - cache.fetchedAt < CACHE_TTL_MS
}

// ===========================================================================
//  MODE A — YouTube Data API v3 (requires YOUTUBE_API_KEY)
// ===========================================================================

async function resolveChannelViaAPI(apiKey: string): Promise<{
  channelId: string
  uploadsPlaylistId: string
}> {
  const url = new URL('https://www.googleapis.com/youtube/v3/channels')
  url.searchParams.set('part', 'id,contentDetails')
  url.searchParams.set('forHandle', `@${YOUTUBE_HANDLE}`)
  url.searchParams.set('key', apiKey)

  const response = await $fetch<any>(url.toString())

  const channel = response?.items?.[0]
  if (!channel) {
    throw new Error(
      `Could not find YouTube channel "@${YOUTUBE_HANDLE}". ` +
        'Check that the handle is correct and the API key has YouTube Data API v3 enabled.'
    )
  }

  return {
    channelId: channel.id,
    uploadsPlaylistId: channel.contentDetails?.relatedPlaylists?.uploads || '',
  }
}

async function fetchVideosViaAPI(
  playlistId: string,
  apiKey: string,
  maxVideos: number
): Promise<YouTubeVideoEntry[]> {
  const videos: YouTubeVideoEntry[] = []
  let pageToken: string | undefined

  while (videos.length < maxVideos) {
    const url = new URL('https://www.googleapis.com/youtube/v3/playlistItems')
    url.searchParams.set('part', 'snippet,contentDetails')
    url.searchParams.set('playlistId', playlistId)
    url.searchParams.set('maxResults', '50')
    url.searchParams.set('key', apiKey)
    if (pageToken) url.searchParams.set('pageToken', pageToken)

    const response = await $fetch<any>(url.toString())

    for (const item of response?.items || []) {
      const snippet = item.snippet || {}
      const resourceId = snippet.resourceId || {}
      const videoId: string =
        resourceId.videoId || item.contentDetails?.videoId || ''
      if (!videoId) continue

      const thumbs = snippet.thumbnails || {}
      const bestThumb =
        thumbs.maxres?.url ||
        thumbs.standard?.url ||
        thumbs.high?.url ||
        thumbs.medium?.url ||
        thumbs.default?.url ||
        `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`

      videos.push({
        videoId,
        title: snippet.title || '',
        description: snippet.description || '',
        thumbnailUrl: bestThumb,
        publishedAt: snippet.publishedAt || '',
        channelTitle: snippet.channelTitle || '',
        url: `https://www.youtube.com/watch?v=${videoId}`,
      })
    }

    pageToken = response?.nextPageToken
    if (!pageToken || (response?.items || []).length === 0) break
  }

  return videos
}

// ===========================================================================
//  MODE B — Public RSS feed (no API key needed)
// ===========================================================================

/**
 * Resolve a YouTube @handle to its channel ID by scraping the channel page.
 * Cached in memory for the server process lifetime.
 */
let rssCachedChannelId: string | null = null

async function resolveChannelViaRSS(): Promise<string> {
  if (rssCachedChannelId) return rssCachedChannelId

  const html = await $fetch<string>(
    `https://www.youtube.com/@${YOUTUBE_HANDLE}`,
    {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; SSMTV/1.0; +https://ssmtv.rw)',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    }
  )

  // Try multiple patterns to extract the channel ID
  const patterns = [
    /"channelId"\s*:\s*"(UC[A-Za-z0-9_-]{22})"/,
    /"externalId"\s*:\s*"(UC[A-Za-z0-9_-]{22})"/,
    /<meta\s+itemprop="channelId"\s+content="(UC[A-Za-z0-9_-]{22})"/i,
  ]

  for (const pattern of patterns) {
    const match = html.match(pattern)
    if (match) {
      rssCachedChannelId = match[1]
      return match[1]
    }
  }

  throw new Error(
    'Could not resolve channel ID from page HTML. The handle may have changed or YouTube may have updated their page format.'
  )
}

function parseRSSFeed(xml: string): YouTubeVideoEntry[] {
  const entries: YouTubeVideoEntry[] = []
  const blocks = xml.split(/<entry[^>]*>/).slice(1)

  for (const block of blocks) {
    const end = block.indexOf('</entry>')
    if (end === -1) continue
    const entryXml = block.substring(0, end)

    try {
      const videoId =
        entryXml.match(/<yt:videoId[^>]*>([^<]+)<\/yt:videoId>/)?.[1] ||
        entryXml.match(/<id[^>]*>yt:video:([^<]+)<\/id>/)?.[1] ||
        ''
      if (!videoId) continue

      const decode = (s: string) =>
        s
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")

      const title = decode(
        entryXml.match(/<title[^>]*>([^<]+)<\/title>/)?.[1] || ''
      )
      const publishedAt =
        entryXml.match(/<published[^>]*>([^<]+)<\/published>/)?.[1] || ''
      const channelTitle = decode(
        entryXml.match(/<name[^>]*>([^<]+)<\/name>/)?.[1] || 'SSM TV'
      )
      const description = decode(
        entryXml
          .match(
            /<media:description[^>]*>([\s\S]*?)<\/media:description>/
          )?.[1]
          ?.trim() || ''
      )

      // Highest-quality thumbnail
      const thumbMatches = [
        ...entryXml.matchAll(
          /<media:thumbnail[^>]*url="([^"]+)"[^>]*\/?>/g
        ),
      ]
      let thumbnailUrl = ''
      let maxHeight = 0
      for (const m of thumbMatches) {
        const h = parseInt(m[0].match(/height="(\d+)"/)?.[1] || '0')
        if (h > maxHeight) {
          maxHeight = h
          thumbnailUrl = m[1]
        }
      }
      if (!thumbnailUrl) {
        thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
      }

      entries.push({
        videoId,
        title,
        description,
        thumbnailUrl,
        publishedAt,
        channelTitle,
        url: `https://www.youtube.com/watch?v=${videoId}`,
      })
    } catch {
      continue
    }
  }

  return entries
}

// ===========================================================================
//  Main handler — GET /api/youtube/videos?maxResults=12&page=1
// ===========================================================================

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const maxResults = Math.min(parseInt(query.maxResults as string) || 12, 50)
  const page = Math.max(parseInt(query.page as string) || 1, 1)
  const maxFetch = 50
  const search = (query.search as string) || ''

  // Helper: case-insensitive title filter
  function filterVideos(videos: YouTubeVideoEntry[]): YouTubeVideoEntry[] {
    if (!search) return videos
    const q = search.toLowerCase()
    return videos.filter(
      (v) =>
        v.title.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q)
    )
  }

  // Helper: paginate filtered results
  function paginateResults(videos: YouTubeVideoEntry[]) {
    const filtered = filterVideos(videos)
    const paged = filtered.slice(
      (page - 1) * maxResults,
      (page - 1) * maxResults + maxResults
    )
    return {
      videos: paged,
      total: filtered.length,
      page,
      totalPages: Math.ceil(filtered.length / maxResults),
    }
  }

  // ----- Serve from cache if fresh -----------------------------------------
  if (isCacheValid()) {
    return {
      ...paginateResults(cache!.videos),
      channelId: cache!.channelId,
      method: cache!.method,
      cached: true,
    }
  }

  // ----- Determine which mode to use ----------------------------------------
  const config = useRuntimeConfig()
  const apiKey = (config.youtubeApiKey as string) || ''
  const hasApiKey =
    apiKey && apiKey !== 'your-youtube-api-key' && apiKey.length > 10

  // ----- Fetch fresh data ---------------------------------------------------
  try {
    let videos: YouTubeVideoEntry[]
    let channelId: string
    let method: 'api' | 'rss'

    if (hasApiKey) {
      // Mode A — YouTube Data API v3
      const { channelId: cid, uploadsPlaylistId } =
        await resolveChannelViaAPI(apiKey)
      channelId = cid
      videos = await fetchVideosViaAPI(uploadsPlaylistId, apiKey, maxFetch)
      method = 'api'
    } else {
      // Mode B — Public RSS feed (no key required)
      channelId = await resolveChannelViaRSS()
      const xml = await $fetch<string>(
        `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`,
        {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (compatible; SSMTV/1.0; +https://ssmtv.rw)',
          },
        }
      )
      videos = parseRSSFeed(xml).slice(0, maxFetch)
      method = 'rss'
    }

    // Update cache
    cache = { videos, channelId, fetchedAt: Date.now(), method }

    // Background sync to database (fire-and-forget, non-blocking)
    syncVideosToDB(videos).catch(() => {})

    // Return requested page (with optional search filter)
    return {
      ...paginateResults(videos),
      channelId,
      method,
      cached: false,
    }
  } catch (error: any) {
    // ----- Fall back to stale cache on error --------------------------------
    if (cache) {
      console.warn(
        `[YouTube API] Fetch failed (${cache.method}), serving stale cache ` +
          `(${Math.round((Date.now() - cache.fetchedAt) / 60000)} min old):`,
        error.message
      )

      const paged = filterVideos(cache.videos).slice(
        (page - 1) * maxResults,
        (page - 1) * maxResults + maxResults
      )

      return {
        videos: paged,
        total: filterVideos(cache.videos).length,
        page,
        totalPages: Math.ceil(filterVideos(cache.videos).length / maxResults),
        channelId: cache.channelId,
        method: cache.method,
        cached: true,
        stale: true,
      }
    }

    // No cache at all
    console.error('[YouTube API] Fatal error:', error.message)
    throw createError({
      statusCode: 502,
      statusMessage: 'Failed to fetch YouTube videos',
      message:
        error.message ||
        'Could not retrieve videos from YouTube. Please try again later.',
    })
  }
})
