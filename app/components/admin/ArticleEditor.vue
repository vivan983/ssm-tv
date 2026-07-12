<template>
  <div class="card p-6 space-y-6">
    <!-- Error -->
    <div v-if="saveError" class="p-3 bg-red-50 border border-red-200 rounded-lg">
      <p class="text-sm text-red-700">{{ saveError }}</p>
    </div>

    <!-- Basic info -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <BaseInput v-model="form.slug" label="Slug" placeholder="ingoing-yacyo" :error="errors.slug" required />
      <BaseSelect
        v-model="form.category_id"
        label="Icyiciro"
        :options="categoryOptions"
        placeholder="Hitamo Icyiciro..."
        :error="errors.category_id"
        required
      />
    </div>

    <!-- Featured image -->
    <div>
      <label class="block text-sm font-medium text-neutral-700 mb-1.5">Ifoto y'ingingo</label>
      <div
        class="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors cursor-pointer"
        @click="triggerUpload"
        @dragover.prevent
        @drop.prevent="handleDrop"
      >
        <div v-if="form.featured_image" class="relative">
          <img :src="form.featured_image" alt="Featured" class="max-h-48 mx-auto rounded-lg" />
          <button class="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 text-xs" @click.stop="form.featured_image = ''">×</button>
        </div>
        <div v-else class="text-neutral-500">
          <p class="text-sm font-medium">{{ 'Kanda cyangwa tera ifoto hano' }}</p>
          <p class="text-xs mt-1">{{ 'PNG, JPG, cyangwa WebP. Ntigisumbana 5MB.' }}</p>
        </div>
        <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleFileSelect" />
      </div>
    </div>

    <!-- Translations tabs -->
    <div>
      <label class="block text-sm font-medium text-neutral-700 mb-3">{{ 'Ubuhinduzi' }}</label>
      <div class="border border-neutral-200 rounded-lg">
        <div class="flex border-b border-neutral-200">
          <button
            v-for="lang in languages"
            :key="lang.code"
            class="flex-1 px-4 py-2.5 text-sm font-medium transition-colors relative"
            :class="activeLang === lang.code ? 'bg-green-50 text-green-700 border-b-2 border-green-600' : 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50'"
            @click="activeLang = lang.code"
          >
            {{ lang.name }}
            <span
              v-if="hasTranslationContent(lang.code)"
              class="absolute top-2 right-2 w-2 h-2 rounded-full"
              :class="activeLang === lang.code ? 'bg-green-600' : 'bg-green-400'"
              :title="lang.code + ' has content'"
            />
          </button>
        </div>
        <div class="p-4 space-y-4">
          <BaseInput
            v-model="getTranslation(activeLang).title"
            :label="'Umutwe'"
            :placeholder="`Title (${activeLang})`"
            required
          />
          <BaseTextarea
            v-model="getTranslation(activeLang).excerpt"
            :label="'Incamake'"
            :placeholder="`Excerpt (${activeLang})`"
            :rows="2"
          />
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="block text-sm font-medium text-neutral-700">{{ 'Ibikubiyemo' }}</label>
              <button type="button" class="text-xs font-medium text-green-600 hover:text-green-700" @click="previewContent = !previewContent">
                {{ previewContent ? 'Hindura' : 'Igaragaza' }}
              </button>
            </div>
            <textarea
              v-if="!previewContent"
              v-model="getTranslation(activeLang).content"
              :placeholder="`Content (${activeLang}) - HTML supported`"
              rows="12"
              class="w-full px-3.5 py-2.5 border border-neutral-300 rounded-md text-sm font-mono text-neutral-900 focus:outline-none focus:ring-2 focus:border-green-500 focus:ring-green-100 resize-y"
            />
            <div
              v-else
              class="w-full min-h-[200px] px-4 py-3 border border-neutral-200 rounded-md bg-white text-sm prose prose-sm max-w-none"
              v-html="getTranslation(activeLang).content || `<p class='text-neutral-400 italic'>${'Nta kugaragaza.'}</p>`"
            />
            <p class="mt-1 text-xs text-neutral-400">HTML content — use &lt;p&gt;, &lt;h2&gt;, &lt;img&gt;, etc.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Video options -->
    <div class="border-t border-neutral-200 pt-5">
      <label class="flex items-center gap-3">
        <input v-model="form.is_video" type="checkbox" class="w-4 h-4 rounded border-neutral-300 text-green-600 focus:ring-green-500" />
        <span class="text-sm font-medium text-neutral-700">{{ 'Ni amashusho?' }}</span>
      </label>
      <div v-if="form.is_video" class="mt-3">
        <BaseInput v-model="form.youtube_url" label="YouTube URL" placeholder="https://youtube.com/watch?v=..." />
      </div>
    </div>

    <!-- SEO panel -->
    <div class="border-t border-neutral-200 pt-5">
      <button type="button" class="seo-toggle" @click="showSeo = !showSeo">
        <svg class="seo-toggle-chevron" :class="{ 'seo-toggle-chevron--open': showSeo }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <span>{{ 'SEO' }}</span>
      </button>
      <div v-if="showSeo" class="mt-4 space-y-4">
        <BaseInput v-model="form.meta_title" :label="'Umutwe wa Meta'" placeholder="Meta title (60 chars)" />
        <BaseTextarea v-model="form.meta_description" :label="'Incamake ya Meta'" :rows="2" placeholder="Meta description (160 chars)" />
        <BaseInput v-model="form.og_image" :label="'Ifoto ya OG'" placeholder="https://..." />
      </div>
    </div>

    <!-- Toggles -->
    <div class="border-t border-neutral-200 pt-5 flex flex-wrap gap-6">
      <label class="flex items-center gap-2">
        <input v-model="form.is_published" type="checkbox" class="w-4 h-4 rounded border-neutral-300 text-green-600 focus:ring-green-500" />
        <span class="text-sm font-medium text-neutral-700">{{ 'Sohora' }}</span>
      </label>
      <label class="flex items-center gap-2">
        <input v-model="form.is_featured" type="checkbox" class="w-4 h-4 rounded border-neutral-300 text-green-600 focus:ring-green-500" />
        <span class="text-sm font-medium text-neutral-700">{{ 'Byihariye' }}</span>
      </label>
    </div>

    <!-- Actions -->
    <div class="border-t border-neutral-200 pt-5 flex justify-between gap-3">
      <BaseButton variant="ghost" @click="handleCancel">
        {{ 'Reka' }}
      </BaseButton>
      <div class="flex gap-2">
        <BaseButton v-if="!form.is_published" variant="outline" :loading="saving" @click="save">
          {{ saving ? 'Birabikwa...' : "Bika nk'umushinga" }}
        </BaseButton>
        <BaseButton :loading="saving" @click="publish">
          {{ saving ? 'Birabikwa...' : 'Sohora' }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Article } from '~/types/article'
import BaseInput from '~/components/ui/BaseInput.vue'
import BaseTextarea from '~/components/ui/BaseTextarea.vue'
import BaseSelect from '~/components/ui/BaseSelect.vue'
import BaseButton from '~/components/ui/BaseButton.vue'

const props = defineProps<{
  initialData?: Article | null
}>()

const emit = defineEmits<{ save: [data: any] }>()

const saving = ref(false)
const saveError = ref('')
const previewContent = ref(false)
const showSeo = ref(false)
const fileInput = ref<HTMLInputElement>()

const activeLang = ref<'rw' | 'en' | 'fr'>('rw')

const languages = [
  { code: 'rw' as const, name: 'Kinyarwanda' },
  { code: 'en' as const, name: 'English' },
  { code: 'fr' as const, name: 'Français' },
]

const form = reactive({
  slug: props.initialData?.slug || '',
  category_id: props.initialData?.category_id || '',
  featured_image: props.initialData?.featured_image || '',
  featured_image_alt: props.initialData?.featured_image_alt || '',
  is_featured: props.initialData?.is_featured || false,
  is_published: props.initialData?.is_published || false,
  is_video: props.initialData?.is_video || false,
  youtube_url: props.initialData?.youtube_url || '',
  meta_title: props.initialData?.meta_title || '',
  meta_description: props.initialData?.meta_description || '',
  og_image: props.initialData?.og_image || '',
  translations: {
    rw: {
      title: props.initialData?.translations?.find((t) => t.language_code === 'rw')?.title || props.initialData?.title || '',
      excerpt: props.initialData?.translations?.find((t) => t.language_code === 'rw')?.excerpt || props.initialData?.excerpt || '',
      content: props.initialData?.translations?.find((t) => t.language_code === 'rw')?.content || props.initialData?.content || '',
    },
    en: {
      title: props.initialData?.translations?.find((t) => t.language_code === 'en')?.title || '',
      excerpt: props.initialData?.translations?.find((t) => t.language_code === 'en')?.excerpt || '',
      content: props.initialData?.translations?.find((t) => t.language_code === 'en')?.content || '',
    },
    fr: {
      title: props.initialData?.translations?.find((t) => t.language_code === 'fr')?.title || '',
      excerpt: props.initialData?.translations?.find((t) => t.language_code === 'fr')?.excerpt || '',
      content: props.initialData?.translations?.find((t) => t.language_code === 'fr')?.content || '',
    },
  },
})

const errors = reactive({
  slug: '',
  category_id: '',
})

const categoryOptions = ref<Array<{ value: string; label: string }>>([])

onMounted(async () => {
  try {
    const { data } = await useFetch('/api/categories')
    const cats = (data.value as any)?.data || []
    categoryOptions.value = cats.map((c: any) => ({ value: c.id, label: c.name?.toUpperCase?.() || c.name }))
  } catch (e: any) {}
})

function getTranslation(lang: 'rw' | 'en' | 'fr') {
  return form.translations[lang]
}

function hasTranslationContent(lang: string) {
  const t = form.translations[lang as 'rw' | 'en' | 'fr']
  return !!(t?.title?.trim() || t?.content?.trim())
}

// Unsaved changes detection
const isDirty = computed(() => {
  return form.slug || form.featured_image || form.is_published ||
    Object.values(form.translations).some(t => t.title.trim() || t.content.trim())
})

onMounted(() => {
  window.addEventListener('beforeunload', beforeUnloadHandler)
})

onUnmounted(() => {
  window.removeEventListener('beforeunload', beforeUnloadHandler)
})

function beforeUnloadHandler(e: BeforeUnloadEvent) {
  if (isDirty.value && !saving.value) {
    e.preventDefault()
    e.returnValue = ''
  }
}

function triggerUpload() {
  fileInput.value?.click()
}

function handleDrop(e: DragEvent) {
  const files = e.dataTransfer?.files
  if (files?.length) uploadFile(files[0])
}

function handleFileSelect(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files?.length) uploadFile(target.files[0])
}

async function uploadFile(file: File) {
  saveError.value = ''
  try {
    if (file.size > 5 * 1024 * 1024) {
      saveError.value = 'Dosiye nini cyane (ntarenga 5MB)'
      return
    }
    const formData = new FormData()
    formData.append('file', file)
    // BUG FIX: Use useAdminFetch instead of $fetch so the JWT token is sent.
    // Previously used plain $fetch which doesn't attach the auth header,
    // causing the server's requireAuth() to reject the upload with 401.
    const result = await useAdminFetch('/api/upload', { method: 'POST', body: formData })
    const data = result as { data?: { url?: string } }
    form.featured_image = data.data?.url || ''
  } catch (e) {
    const err = e as { data?: { message?: string }; message?: string }
    saveError.value = err.data?.message || err.message || 'Gushyiraho dosiye byanze'
  }
}

function validate(): boolean {
  errors.slug = ''
  errors.category_id = ''
  if (!form.slug || form.slug.length < 3) {
    errors.slug = 'Slug igomba kuba nyuguti nibura 3'
    return false
  }
  if (!/^[a-z0-9-]+$/.test(form.slug)) {
    errors.slug = 'Slug igomba kuba inyuguti nto, imibare, cyangwa utudirongo gusa'
    return false
  }
  if (!form.category_id) {
    errors.category_id = 'Hitamo icyiciro mbere yo gutangaza inkuru.'
    return false
  }
  const hasTitle = Object.values(form.translations).some((t) => t.title.trim())
  if (!hasTitle) {
    saveError.value = 'Nibura umutwe umwe urakenewe mu ndimi'
    return false
  }
  return true
}

function buildPayload(publishNow: boolean) {
  return {
    slug: form.slug,
    category_id: form.category_id || null,
    featured_image: form.featured_image || null,
    featured_image_alt: form.featured_image_alt || null,
    is_featured: form.is_featured,
    is_published: publishNow,
    is_video: form.is_video,
    youtube_url: form.youtube_url || null,
    published_at: publishNow ? new Date().toISOString() : props.initialData?.published_at || null,
    meta_title: form.meta_title || null,
    meta_description: form.meta_description || null,
    og_image: form.og_image || null,
    translations: Object.entries(form.translations)
      .filter(([_, t]) => t.title.trim())
      .map(([lang, t]) => ({
        language_code: lang,
        title: t.title,
        excerpt: t.excerpt || null,
        content: t.content || null,
      })),
  }
}

async function save() {
  if (!validate()) return
  saving.value = true
  saveError.value = ''
  try {
    await emit('save', buildPayload(false))
  } catch (e: any) {
    saveError.value = e?.message || 'Save failed'
  } finally {
    saving.value = false
  }
}

async function publish() {
  form.is_published = true
  if (!validate()) { form.is_published = false; return }
  saving.value = true
  saveError.value = ''
  try {
    await emit('save', buildPayload(true))
  } catch (e: any) {
    form.is_published = false
    saveError.value = e?.message || 'Save failed'
  } finally {
    saving.value = false
  }
}

function handleCancel() {
  if (isDirty.value) {
    if (confirm('Hari ibyahinduwe bitarabikwa. Komeza usize?')) {
      navigateTo('/admin/articles')
    }
  } else {
    navigateTo('/admin/articles')
  }
}
</script>

<style scoped>
/* ---- SEO toggle ---- */
.seo-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: color 0.15s ease;
}

.seo-toggle:hover {
  color: #16a34a;
}

.seo-toggle-chevron {
  width: 14px;
  height: 14px;
  transition: transform 0.2s ease;
}

.seo-toggle-chevron--open {
  transform: rotate(90deg);
}
</style>
