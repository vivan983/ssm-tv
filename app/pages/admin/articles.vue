<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <BaseButton @click="goToCreate">
        + Andika Ingingo
      </BaseButton>
    </div>

    <!-- Filters -->
    <div class="flex gap-3 mb-6">
      <select
        v-model="filter"
        class="px-3 py-2 border border-neutral-300 rounded-lg text-sm bg-white"
      >
        <option value="all">Zose</option>
        <option value="published">Zasohotse</option>
        <option value="draft">Umushinga</option>
      </select>
    </div>

    <!-- Loading skeleton for initial data load -->
    <!-- BUG FIX #2b: Added loading state so user sees feedback while data loads.
         Previously there was no loading indicator — if the fetch failed silently,
         the page showed "No articles" even when articles existed. -->
    <div v-if="loading" class="card p-8 space-y-4">
      <BaseSkeleton variant="title" />
      <BaseSkeleton variant="text" />
      <BaseSkeleton variant="text" />
      <BaseSkeleton variant="card" class="h-12" />
    </div>

    <!-- Error state for failed data load -->
    <!-- BUG FIX #2c: Added error state with retry button. Previously errors were
         silently swallowed by catch {}, leaving the user with a blank "no articles"
         state and no way to know what went wrong. -->
    <div v-else-if="loadError" class="card p-8 text-center">
      <p class="text-red-600 mb-3">{{ loadError }}</p>
      <BaseButton variant="outline" size="sm" @click="fetchArticles">
        Ongera ugerageze
      </BaseButton>
    </div>

    <!-- Articles table -->
    <!-- BUG FIX #2d: Only show table once loading is done and no error occurred -->
    <div v-else class="card">
      <div class="overflow-x-auto">
        <table class="w-full text-sm" v-if="articles.length > 0">
          <thead>
            <tr class="border-b border-neutral-200 text-neutral-500">
              <th class="text-left px-5 py-3 font-medium">Umutwe</th>
              <th class="text-left px-5 py-3 font-medium hidden md:table-cell">Icyiciro</th>
              <th class="text-left px-5 py-3 font-medium hidden sm:table-cell">Imiterere</th>
              <th class="text-left px-5 py-3 font-medium hidden lg:table-cell">Itariki</th>
              <th class="text-right px-5 py-3 font-medium">Ibikorwa</th>
            </tr>
          </thead>
          <tbody>
            <!-- BUG FIX #2e: Added :key with article.id to ensure each row is uniquely
                 identified by Vue's virtual DOM. This prevents DOM-reuse bugs where
                 clicking a button on row B accidentally targets row A's data. -->
            <tr
              v-for="article in filteredArticles"
              :key="article.id"
              class="border-b border-neutral-100 hover:bg-neutral-50"
            >
              <td class="px-5 py-3">
                <!-- BUG FIX #2f: The title link now uses goToEdit(article.id) instead
                     of inline navigateTo. This ensures the article.id is correctly
                     bound to each row's edit action and avoids template-literal
                     resolution issues with the auto-imported navigateTo. -->
                <button
                  class="text-neutral-900 hover:text-green-700 font-medium line-clamp-1 text-left hover:underline"
                  @click="goToEdit(article.id)"
                >
                  {{ article.title }}
                </button>
              </td>
              <td class="px-5 py-3 text-neutral-600 hidden md:table-cell">
                {{ article.category?.name?.toUpperCase() || '—' }}
              </td>
              <td class="px-5 py-3 hidden sm:table-cell">
                <span
                  class="dash-badge"
                  :class="article.is_published ? 'dash-badge--published' : 'dash-badge--draft'"
                >
                  {{ article.is_published ? 'Zasohotse' : 'Umushinga' }}
                </span>
              </td>
              <td class="px-5 py-3 text-neutral-500 hidden lg:table-cell">
                {{ article.published_at ? formatDate(article.published_at) : '-' }}
              </td>
              <td class="px-5 py-3 text-right">
                <div class="flex items-center justify-end gap-2">
                  <!-- HINDURA BUTTON (Edit/Update) -->
                  <!-- BUG FIX #2g: Replaced inline navigateTo with goToEdit(article.id).
                       The previous code @click="navigateTo('/admin/edit/${article.id}')"
                       could fail because navigateTo auto-import resolution in Vue
                       templates is not guaranteed. Using a script-level wrapper
                       function guarantees the navigation always fires.
                       Also added :disabled to prevent double-clicks. -->
                  <button
                    class="px-2.5 py-1 text-xs rounded-md border border-neutral-300 hover:bg-neutral-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    :disabled="deletingId === article.id"
                    @click="goToEdit(article.id)"
                  >
                    Hindura
                  </button>

                  <!-- SIBA BUTTON (Delete) -->
                  <!-- BUG FIX #2h: The delete button now shows a loading spinner
                       while deletion is in progress (via deletingId). Previously
                       there was no visual feedback, so users might click multiple
                       times, triggering multiple delete requests. -->
                  <button
                    class="px-2.5 py-1 text-xs rounded-md border border-red-300 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    :disabled="deletingId === article.id"
                    @click="confirmDelete(article)"
                  >
                    <!-- BUG FIX #2i: Show spinner when this specific article is
                         being deleted, giving clear per-row feedback. -->
                    <span v-if="deletingId === article.id" class="inline-flex items-center gap-1">
                      <svg class="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      ...
                    </span>
                    <span v-else>Siba</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-else class="px-5 py-12 text-center text-neutral-500">
          <p class="text-lg mb-2">Nta ngingo zihari</p>
          <BaseButton variant="outline" size="sm" @click="goToCreate">
            Andika Ingingo
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- SIBA CONFIRMATION MODAL (Delete) -->
    <!-- BUG FIX #2j: The BaseModal previously had a defineProps bug inside computed()
         (fixed in BaseModal.vue) that could crash it entirely.
         Now that the prop bug is resolved, the modal should open and close correctly.
         Added loading state to the delete button inside the modal. -->
    <BaseModal
      :open="deleteModalOpen"
      :title="'Siba'"
      @close="closeDeleteModal"
    >
      <p class="text-sm text-neutral-600 mb-4">
        Uremeza gusiba iyi ngingo? Iki gikorwa ntigisubirwaho.
      </p>
      <!-- BUG FIX #2k: Show the article title being deleted so user knows exactly
           which article they're about to remove. -->
      <p
        v-if="articleToDelete"
        class="text-sm font-semibold text-neutral-900 mb-2 line-clamp-2"
      >
        "{{ articleToDelete.title }}"
      </p>
      <template #footer>
        <BaseButton variant="ghost" :disabled="deleting" @click="closeDeleteModal">
          Reka
        </BaseButton>
        <!-- BUG FIX #2l: Delete button shows loading state while request is in
             flight, preventing double-submission. -->
        <BaseButton variant="danger" :loading="deleting" @click="handleDelete">
          {{ deleting ? 'Birabikwa...' : 'Siba' }}
        </BaseButton>
      </template>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
// =====================================================================
// INGINGO (Articles) ADMIN PAGE — COMPLETE BUG-FIX REWRITE
// =====================================================================
// All bugs are documented inline with "BUG FIX #" markers.
// Summary of fixes:
//   #2a-g: Hindura (Edit) button  — now uses explicit goToEdit() wrapper
//   #2h-l: Siba (Delete) button   — now has loading states, error toasts,
//                                    per-row spinner, and proper modal handling
//   #2m-n: Data loading           — loading/error states instead of silent catches
//   #2o-p: Toast notifications    — success/error feedback via UiStore
//   #2q:   Admin API endpoint     — fetches ALL articles including drafts
// =====================================================================

import type { Article } from '~/types/article'
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseModal from '~/components/ui/BaseModal.vue'
import BaseSkeleton from '~/components/ui/BaseSkeleton.vue'

const router = useRouter()

// BUG FIX #2m: Added loading and error state refs. Previously the page had
// no loading indicator — if the fetch hung or failed silently (catch {}),
// the user saw "No articles" with no clue what was wrong.
const loading = ref(true)
const loadError = ref('')

definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth'],
})

const filter = ref('all')
const articles = ref<Article[]>([])
const deleteModalOpen = ref(false)
const articleToDelete = ref<Article | null>(null)

// BUG FIX #2n: Added deleting state and per-row deletingId to prevent
// double-clicks and give visual feedback during delete operations.
const deleting = ref(false)
const deletingId = ref<string | null>(null)

// ===================================================================
// COMPUTED: Filter articles based on selected filter dropdown
// ===================================================================
const filteredArticles = computed(() => {
  if (filter.value === 'all') return articles.value
  if (filter.value === 'published')
    return articles.value.filter((a) => a.is_published)
  return articles.value.filter((a) => !a.is_published)
})

// ===================================================================
// DATA FETCHING: Load all articles from admin API endpoint
// ===================================================================
// BUG FIX #2o: Now uses /api/admin/articles endpoint which returns ALL
// articles (published + drafts). Previously used /api/articles which
// hardcodes .eq('is_published', true) — so drafts were invisible in the
// admin panel, making the "Draft" filter always show 0 results.
async function fetchArticles() {
  loading.value = true
  loadError.value = ''
  try {
    // BUG FIX: Use useAdminFetch so the JWT token is sent in the
    // Authorization header. Previously used useFetch which relied on
    // cookies only — this now works with the dual-strategy server auth
    // (header + cookie), but useAdminFetch is more explicit and robust.
    const result = await useAdminFetch('/api/admin/articles?perPage=100')
    articles.value = (result as any)?.data || []
  } catch (e: any) {
    loadError.value = e?.data?.message || e?.message || 'Ntibyashobotse gukura ingingo. Gerageza kongera.'
    console.error('[Ingingo] Failed to fetch articles:', e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchArticles()
})

// ===================================================================
// HINDURA (EDIT) FUNCTIONALITY
// ===================================================================
// BUG FIX #2q: Explicit wrapper function for navigation. Previously the
// template used @click="navigateTo('/admin/edit/${article.id}')" which
// could fail because:
//   1. navigateTo auto-import resolution in Vue templates is unreliable
//   2. Template literal string interpolation inside @click can break
//      Vue's expression parser in edge cases
//   3. No way to add error handling or analytics
// Now we use the router directly for guaranteed navigation.
function goToCreate() {
  router.push('/admin/create')
}

function goToEdit(id: string) {
  // BUG FIX #2r: Validate the article ID before navigating.
  // If somehow the ID is missing/undefined (e.g., broken data),
  // we show a toast instead of navigating to /admin/edit/undefined
  if (!id) {
    showToast('error', "Ntibishoboka guhindura: ID y'ingingo ntibonetse.")
    return
  }
  router.push(`/admin/edit/${id}`)
}

// ===================================================================
// SIBA (DELETE) FUNCTIONALITY
// ===================================================================
// BUG FIX #2s: confirmDelete now validates the article exists and has
// a valid ID before opening the modal. Previously it would open the modal
// even with null/undefined article data.
function confirmDelete(article: Article) {
  if (!article || !article.id) {
    showToast('error', "Ntibishoboka gusiba: amakuru y'ingingo ntaboneka.")
    return
  }
  articleToDelete.value = article
  deleteModalOpen.value = true
}

// BUG FIX #2t: closeDeleteModal resets all delete-related state.
// Previously deleteModalOpen.value = false was called both in the
// cancel click and in the @close handler, causing potential race
// conditions. Now we have a single dedicated closer function.
function closeDeleteModal() {
  // Don't close if a delete is in progress (prevents accidental close during API call)
  if (deleting.value) return
  deleteModalOpen.value = false
  articleToDelete.value = null
}

// BUG FIX #2u: Complete rewrite of handleDelete with:
//   - Input validation (article exists, has ID)
//   - Loading state (disables button, shows spinner)
//   - Error handling with toast notification
//   - Success toast with article title
//   - Optimistic UI update is safe because we only filter on success
//   - Per-row spinner via deletingId
async function handleDelete() {
  // Guard: article must be selected
  if (!articleToDelete.value || !articleToDelete.value.id) {
    showToast('error', "Nta ngingo yatoranyijwe kugira ngo isibwe.")
    return
  }

  const targetArticle = articleToDelete.value
  deleting.value = true
  deletingId.value = targetArticle.id

  try {
    // BUG FIX #2v: Send DELETE request to admin API endpoint.
    // We use useAdminFetch which automatically attaches the Supabase
    // session JWT token so the server can verify the user's identity.
    // Throws on non-2xx responses, caught by the catch block below.
    await useAdminFetch(`/api/admin/articles/${targetArticle.id}`, {
      method: 'DELETE',
    })

    // BUG FIX #2w: Only remove from local state AFTER successful server
    // deletion. The old code had filter() in the try block after $fetch,
    // which was correct, but it ran even if $fetch threw (wait, no — if
    // $fetch throws, execution jumps to catch, skipping the filter).
    // This is now explicit: success → remove from list → show toast.
    articles.value = articles.value.filter(
      (a) => a.id !== targetArticle.id
    )

    // BUG FIX #2x: Show success toast so the user KNOWS the deletion worked.
    // Previously: nothing happened visually except the row disappeared,
    // which was confusing — was it deleted or did the page just glitch?
    showToast('success', `"${targetArticle.title}" yasibwe.`)

    // Close modal and reset state
    deleteModalOpen.value = false
    articleToDelete.value = null
  } catch (e: any) {
    // BUG FIX #2y: Extract meaningful error message from the API response.
    // $fetch throws an error object with .data containing the server response.
    // Previously: catch {} — empty, so failures were INVISIBLE.
    // The article stayed in the list, modal closed, user was confused.
    const message =
      e?.data?.message ||
      e?.data?.statusMessage ||
      e?.message ||
      "Ntibyashobotse gusiba ingingo. Ongera ugerageze."

    showToast('error', message)
    console.error('[Ingingo] Delete failed:', e)

    // Keep the modal open on error so the user can retry
  } finally {
    // BUG FIX #2z: Always reset loading states, even on error.
    // This ensures the buttons become clickable again after a failed attempt.
    deleting.value = false
    deletingId.value = null
  }
}

// ===================================================================
// TOAST NOTIFICATIONS
// ===================================================================
// BUG FIX #2aa: Centralized toast helper using the UiStore.
// Previously there were NO toast notifications anywhere on this page.
// Every user action (edit, delete, error) now gives visible feedback.
function showToast(type: 'success' | 'error' | 'info' | 'warning', message: string) {
  const uiStore = useUiStore()
  uiStore.showToast({ type, message })
}

// ===================================================================
// UTILITY: Date formatting with locale support
// ===================================================================
function formatDate(date: string) {
  return new Date(date).toLocaleDateString('rw-RW', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
}
</script>

<style scoped>
/* ---- Shared admin badge styles ---- */
.dash-badge {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 2px 10px;
  border-radius: 9999px;
}

.dash-badge--published {
  background: #f0fdf4;
  color: #15803d;
}

.dash-badge--draft {
  background: #f3f4f6;
  color: #6b7280;
}
</style>
