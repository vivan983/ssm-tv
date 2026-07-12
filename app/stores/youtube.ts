/**
 * YouTube Video Store
 *
 * Holds fetched YouTube video data so the listing page and video detail page
 * can share video information without redundant API calls.
 */
import type { YouTubeVideo } from '~/types/video'

export const useYoutubeStore = defineStore('youtube', () => {
  const videos = ref<YouTubeVideo[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const currentPage = ref(1)
  const totalPages = ref(1)
  const total = ref(0)

  function getVideoById(videoId: string): YouTubeVideo | null {
    return videos.value.find((v) => v.videoId === videoId) || null
  }

  function setVideos(
    newVideos: YouTubeVideo[],
    page: number,
    pages: number,
    totalVids: number,
    append = false
  ) {
    if (append) {
      videos.value = [...videos.value, ...newVideos]
    } else {
      videos.value = newVideos
    }
    currentPage.value = page
    totalPages.value = pages
    total.value = totalVids
  }

  function clear() {
    videos.value = []
    currentPage.value = 1
    totalPages.value = 1
    total.value = 0
    error.value = null
  }

  return {
    videos,
    loading,
    error,
    currentPage,
    totalPages,
    total,
    getVideoById,
    setVideos,
    clear,
  }
})
