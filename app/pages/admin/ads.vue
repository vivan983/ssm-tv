<!-- =====================================================================
     ADMIN — ADVERTISEMENTS MANAGEMENT
     Full CRUD for ad campaigns with scheduling, analytics, and preview.
     ===================================================================== -->
<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-lg font-bold text-neutral-900">Kwamamaza</h2>
        <p class="text-sm text-neutral-500 mt-0.5">Shyiraho kandi ugenzure ibyamamaza byawe</p>
      </div>
      <BaseButton @click="openCreate">
        + Kwamamaza Gushya
      </BaseButton>
    </div>

    <!-- Stats cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <div class="card p-4">
        <p class="text-xs text-neutral-500 uppercase tracking-wide mb-1">Zikora</p>
        <p class="text-2xl font-extrabold text-green-600">{{ activeCount }}</p>
      </div>
      <div class="card p-4">
        <p class="text-xs text-neutral-500 uppercase tracking-wide mb-1">Gukanda Kwose</p>
        <p class="text-2xl font-extrabold text-blue-600">{{ totalClicks }}</p>
      </div>
      <div class="card p-4">
        <p class="text-xs text-neutral-500 uppercase tracking-wide mb-1">Kugaragarira Kwose</p>
        <p class="text-2xl font-extrabold text-neutral-700">{{ totalImpressions }}</p>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="card p-8 space-y-4">
      <BaseSkeleton variant="title" />
      <BaseSkeleton variant="text" />
      <BaseSkeleton variant="card" class="h-12" />
    </div>

    <!-- Error -->
    <div v-else-if="loadError" class="card p-8 text-center">
      <p class="text-red-600 mb-3">{{ loadError }}</p>
      <BaseButton variant="outline" size="sm" @click="fetchAds">Ongera ugerageze</BaseButton>
    </div>

    <!-- Ads table -->
    <div v-else class="card">
      <div class="overflow-x-auto">
        <table v-if="ads.length > 0" class="w-full text-sm">
          <thead>
            <tr class="border-b border-neutral-200 text-neutral-500">
              <th class="text-left px-5 py-3 font-medium text-xs uppercase tracking-wider">Kwamamaza</th>
              <th class="text-left px-5 py-3 font-medium text-xs uppercase tracking-wider hidden md:table-cell">Ahantu</th>
              <th class="text-left px-5 py-3 font-medium text-xs uppercase tracking-wider hidden sm:table-cell">Imiterere</th>
              <th class="text-left px-5 py-3 font-medium text-xs uppercase tracking-wider hidden lg:table-cell">Gukanda</th>
              <th class="text-left px-5 py-3 font-medium text-xs uppercase tracking-wider hidden lg:table-cell">Igaragarira</th>
              <th class="text-right px-5 py-3 font-medium text-xs uppercase tracking-wider">Ibikorwa</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="ad in ads"
              :key="ad.id"
              class="border-b border-neutral-100 hover:bg-neutral-50 transition-colors"
            >
              <!-- Name + advertiser -->
              <td class="px-5 py-3">
                <p class="font-semibold text-neutral-800">{{ ad.name }}</p>
                <p class="text-xs text-neutral-500">{{ ad.advertiser }}</p>
              </td>
              <!-- Placement -->
              <td class="px-5 py-3 hidden md:table-cell">
                <span class="text-xs font-semibold text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded">
                  {{ placementLabel(ad.placement) }}
                </span>
              </td>
              <!-- Status -->
              <td class="px-5 py-3 hidden sm:table-cell">
                <span class="dash-badge" :class="statusClass(ad)">
                  {{ statusText(ad) }}
                </span>
              </td>
              <!-- Clicks -->
              <td class="px-5 py-3 hidden lg:table-cell text-neutral-600 font-mono text-xs">
                {{ formatNumber(ad.click_count) }}
              </td>
              <!-- Impressions -->
              <td class="px-5 py-3 hidden lg:table-cell text-neutral-600 font-mono text-xs">
                {{ formatNumber(ad.impression_count) }}
              </td>
              <!-- Actions -->
              <td class="px-5 py-3 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button
                    class="px-2.5 py-1 text-xs rounded-md border border-neutral-300 hover:bg-neutral-100 transition-colors"
                    @click="openEdit(ad)"
                  >Hindura</button>
                  <button
                    class="px-2.5 py-1 text-xs rounded-md border border-red-300 text-red-600 hover:bg-red-50 transition-colors"
                    @click="confirmDelete(ad)"
                  >Siba</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-else class="px-5 py-12 text-center text-neutral-500">
          <svg class="h-10 w-10 text-neutral-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
          </svg>
          <p class="text-sm">Nta byamamaza bihari</p>
          <BaseButton variant="outline" size="sm" class="mt-3" @click="openCreate">
            + Kwamamaza Gushya
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- ================================================================ -->
    <!-- CREATE / EDIT MODAL                                               -->
    <!-- ================================================================ -->
    <BaseModal
      :open="formOpen"
      :title="editingAd ? 'Hindura Kwamamaza' : 'Kwamamaza Gushya'"
      size="lg"
      @close="closeForm"
    >
      <div class="space-y-5">
        <!-- Name -->
        <BaseInput
          v-model="form.name"
          label="Izina ry'ikimamaza"
          placeholder="Urugero: Ikiganiro gishya kuri YouTube"
          required
        />

        <!-- Advertiser -->
        <BaseInput
          v-model="form.advertiser"
          label="Uwamamaza"
          placeholder="Izina ry'uwamamaza cyangwa isosiyete"
          required
        />

        <!-- Destination URL -->
        <BaseInput
          v-model="form.destination_url"
          label="URL ngo babashe kuyikanda"
          placeholder="https://..."
        />

        <!-- Placement -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <BaseSelect
            v-model="form.placement"
            label="Ahantu"
            :options="placementOptions"
            required
          />
          <BaseInput
            v-model.number="form.priority"
            label="Icyiciro (Priority)"
            type="number"
            placeholder="0"
            hint="Umubare munini ugaragara mbere"
          />
        </div>

        <!-- Desktop image -->
        <div>
          <label class="block text-sm font-medium text-neutral-700 mb-1.5">
            Ifoto ya Desktop
          </label>
          <div
            class="border-2 border-dashed border-neutral-300 rounded-lg p-4 text-center hover:border-green-400 transition-colors cursor-pointer"
            @click="triggerDesktopUpload"
          >
            <div v-if="form.desktop_image" class="relative">
              <img :src="form.desktop_image" alt="Desktop ad" class="max-h-32 mx-auto rounded" />
              <button class="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center" @click.stop="form.desktop_image = ''">&times;</button>
            </div>
            <div v-else class="text-neutral-500 py-4">
              <p class="text-sm font-medium">Kanda gushyira ifoto ya Desktop</p>
              <p class="text-xs mt-0.5">PNG, JPG. 728&times;90 byiza.</p>
            </div>
            <input ref="desktopFileInput" type="file" accept="image/*" class="hidden" @change="handleDesktopUpload" />
          </div>
        </div>

        <!-- Mobile image -->
        <div>
          <label class="block text-sm font-medium text-neutral-700 mb-1.5">
            Ifoto ya Mobile (ubushake)
          </label>
          <div
            class="border-2 border-dashed border-neutral-300 rounded-lg p-4 text-center hover:border-green-400 transition-colors cursor-pointer"
            @click="triggerMobileUpload"
          >
            <div v-if="form.mobile_image" class="relative">
              <img :src="form.mobile_image" alt="Mobile ad" class="max-h-32 mx-auto rounded" />
              <button class="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center" @click.stop="form.mobile_image = ''">&times;</button>
            </div>
            <div v-else class="text-neutral-500 py-4">
              <p class="text-sm font-medium">Kanda gushyira ifoto ya Mobile</p>
              <p class="text-xs mt-0.5">PNG, JPG. 320&times;100 byiza.</p>
            </div>
            <input ref="mobileFileInput" type="file" accept="image/*" class="hidden" @change="handleMobileUpload" />
          </div>
        </div>

        <!-- Dates -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <BaseInput
            v-model="form.starts_at"
            label="Itariki yo gutangira (ubushake)"
            type="datetime-local"
          />
          <BaseInput
            v-model="form.expires_at"
            label="Itariki yo kurangira (ubushake)"
            type="datetime-local"
          />
        </div>

        <!-- Active toggle -->
        <label class="flex items-center gap-3">
          <input v-model="form.is_active" type="checkbox" class="w-4 h-4 rounded border-neutral-300 text-green-600 focus:ring-green-500" />
          <span class="text-sm font-medium text-neutral-700">Gikora</span>
        </label>

        <!-- Error -->
        <div v-if="formError" class="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-700">{{ formError }}</p>
        </div>
      </div>

      <template #footer>
        <BaseButton variant="ghost" @click="closeForm">Reka</BaseButton>
        <BaseButton :loading="saving" @click="handleSave">
          {{ saving ? 'Birabikwa...' : 'Bika' }}
        </BaseButton>
      </template>
    </BaseModal>

    <!-- ================================================================ -->
    <!-- DELETE CONFIRMATION MODAL                                         -->
    <!-- ================================================================ -->
    <BaseModal
      :open="deleteModalOpen"
      title="Siba Kwamamaza"
      @close="deleteModalOpen = false"
    >
      <p class="text-sm text-neutral-600 mb-2">
        Uremeza gusiba iki kimamaza? Iki gikorwa ntigisubirwaho.
      </p>
      <p v-if="adToDelete" class="text-sm font-semibold text-neutral-900">
        "{{ adToDelete.name }}" — {{ adToDelete.advertiser }}
      </p>
      <template #footer>
        <BaseButton variant="ghost" @click="deleteModalOpen = false">Reka</BaseButton>
        <BaseButton variant="danger" :loading="deleting" @click="handleDelete">
          {{ deleting ? 'Birabikwa...' : 'Siba' }}
        </BaseButton>
      </template>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseInput from '~/components/ui/BaseInput.vue'
import BaseSelect from '~/components/ui/BaseSelect.vue'
import BaseModal from '~/components/ui/BaseModal.vue'
import BaseSkeleton from '~/components/ui/BaseSkeleton.vue'

interface Advertisement {
  id: string
  name: string
  advertiser: string
  desktop_image: string | null
  mobile_image: string | null
  destination_url: string | null
  placement: string
  priority: number
  is_active: boolean
  starts_at: string | null
  expires_at: string | null
  click_count: number
  impression_count: number
}

definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth'],
})

// ====================================================================
// DATA
// ====================================================================
const ads = ref<Advertisement[]>([])
const loading = ref(true)
const loadError = ref('')

const formOpen = ref(false)
const editingAd = ref<Advertisement | null>(null)
const saving = ref(false)
const formError = ref('')

const deleteModalOpen = ref(false)
const adToDelete = ref<Advertisement | null>(null)
const deleting = ref(false)

const desktopFileInput = ref<HTMLInputElement>()
const mobileFileInput = ref<HTMLInputElement>()

const placementOptions = [
  { value: 'homepage_banner', label: 'Homepage Banner (munsi y\'inkuru nyamukuru)' },
  { value: 'sidebar', label: 'Ibumoso cyangwa iburyo' },
  { value: 'in_article', label: 'Mu nkuru' },
  { value: 'footer_sponsor', label: 'Footer — Abaterankunga' },
]

const form = reactive({
  name: '',
  advertiser: '',
  desktop_image: '',
  mobile_image: '',
  destination_url: '',
  placement: 'sidebar' as string,
  priority: 0,
  is_active: true,
  starts_at: '',
  expires_at: '',
})

// ====================================================================
// COMPUTED
// ====================================================================
const activeCount = computed(() =>
  ads.value.filter((a) => {
    const now = new Date()
    const startOk = !a.starts_at || new Date(a.starts_at) <= now
    const endOk = !a.expires_at || new Date(a.expires_at) >= now
    return a.is_active && startOk && endOk
  }).length
)
const totalClicks = computed(() => ads.value.reduce((s, a) => s + (a.click_count || 0), 0))
const totalImpressions = computed(() => ads.value.reduce((s, a) => s + (a.impression_count || 0), 0))

// ====================================================================
// FETCH
// ====================================================================
async function fetchAds() {
  loading.value = true
  loadError.value = ''
  try {
    const result = await useAdminFetch('/api/admin/ads')
    ads.value = (result as any)?.data || []
  } catch (e: any) {
    loadError.value = e?.message || 'Ntibyashobotse gukura ibyamamaza.'
  } finally {
    loading.value = false
  }
}

onMounted(() => fetchAds())

// ====================================================================
// FORM
// ====================================================================
function openCreate() {
  editingAd.value = null
  resetForm()
  formOpen.value = true
}

function openEdit(ad: Advertisement) {
  editingAd.value = ad
  form.name = ad.name
  form.advertiser = ad.advertiser
  form.desktop_image = ad.desktop_image || ''
  form.mobile_image = ad.mobile_image || ''
  form.destination_url = ad.destination_url || ''
  form.placement = ad.placement
  form.priority = ad.priority
  form.is_active = ad.is_active
  form.starts_at = ad.starts_at ? ad.starts_at.substring(0, 16) : ''
  form.expires_at = ad.expires_at ? ad.expires_at.substring(0, 16) : ''
  formError.value = ''
  formOpen.value = true
}

function closeForm() {
  formOpen.value = false
  editingAd.value = null
  resetForm()
}

function resetForm() {
  form.name = ''
  form.advertiser = ''
  form.desktop_image = ''
  form.mobile_image = ''
  form.destination_url = ''
  form.placement = 'sidebar'
  form.priority = 0
  form.is_active = true
  form.starts_at = ''
  form.expires_at = ''
  formError.value = ''
}

// ====================================================================
// IMAGE UPLOAD
// ====================================================================
function triggerDesktopUpload() { desktopFileInput.value?.click() }
function triggerMobileUpload() { mobileFileInput.value?.click() }

async function handleDesktopUpload(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) await uploadFile(file, 'desktop_image')
}

async function handleMobileUpload(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) await uploadFile(file, 'mobile_image')
}

async function uploadFile(file: File, field: 'desktop_image' | 'mobile_image') {
  try {
    if (file.size > 5 * 1024 * 1024) {
      formError.value = 'Dosiye nini cyane (ntarenga 5MB)'
      return
    }
    const formData = new FormData()
    formData.append('file', file)
    const result = await useAdminFetch('/api/upload', { method: 'POST', body: formData })
    const url = (result as any)?.data?.url || ''
    if (field === 'desktop_image') form.desktop_image = url
    else form.mobile_image = url
  } catch (e: any) {
    formError.value = e?.data?.message || 'Gushyiraho ifoto byanze'
  }
}

// ====================================================================
// SAVE
// ====================================================================
async function handleSave() {
  if (!form.name.trim() || !form.advertiser.trim()) {
    formError.value = 'Izina ry\'ikimamaza n\'uwamamaza ni ngombwa.'
    return
  }

  saving.value = true
  formError.value = ''

  const payload = {
    name: form.name.trim(),
    advertiser: form.advertiser.trim(),
    desktop_image: form.desktop_image || null,
    mobile_image: form.mobile_image || null,
    destination_url: form.destination_url || null,
    placement: form.placement,
    priority: form.priority,
    is_active: form.is_active,
    starts_at: form.starts_at || null,
    expires_at: form.expires_at || null,
  }

  try {
    if (editingAd.value) {
      await useAdminFetch(`/api/admin/ads/${editingAd.value.id}`, { method: 'PUT', body: payload })
    } else {
      await useAdminFetch('/api/admin/ads', { method: 'POST', body: payload })
    }
    closeForm()
    await fetchAds()
  } catch (e: any) {
    formError.value = e?.data?.message || 'Birabyanze. Ongera ugerageze.'
  } finally {
    saving.value = false
  }
}

// ====================================================================
// DELETE
// ====================================================================
function confirmDelete(ad: Advertisement) {
  adToDelete.value = ad
  deleteModalOpen.value = true
}

async function handleDelete() {
  if (!adToDelete.value) return
  deleting.value = true
  try {
    await useAdminFetch(`/api/admin/ads/${adToDelete.value.id}`, { method: 'DELETE' })
    ads.value = ads.value.filter((a) => a.id !== adToDelete.value!.id)
    deleteModalOpen.value = false
    adToDelete.value = null
  } catch (e: any) {
    // Keep modal open on error
  } finally {
    deleting.value = false
  }
}

// ====================================================================
// HELPERS
// ====================================================================
function placementLabel(p: string) {
  const map: Record<string, string> = {
    homepage_banner: 'Homepage Banner',
    sidebar: 'Ibumoso/Iburyo',
    in_article: 'Mu nkuru',
    footer_sponsor: 'Footer',
  }
  return map[p] || p
}

function statusClass(ad: Advertisement) {
  if (!ad.is_active) return 'dash-badge--draft'
  const now = new Date()
  if (ad.starts_at && new Date(ad.starts_at) > now) return 'dash-badge--draft'
  if (ad.expires_at && new Date(ad.expires_at) < now) return 'dash-badge--draft'
  return 'dash-badge--published'
}

function statusText(ad: Advertisement) {
  if (!ad.is_active) return 'Yahagaze'
  const now = new Date()
  if (ad.starts_at && new Date(ad.starts_at) > now) return 'Itegerejwe'
  if (ad.expires_at && new Date(ad.expires_at) < now) return 'Yarangiye'
  return 'Irakora'
}

function formatNumber(n: number) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K'
  return String(n)
}
</script>

<style scoped>
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
