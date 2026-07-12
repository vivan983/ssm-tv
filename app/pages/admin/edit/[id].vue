<template>
  <div>
    <div v-if="loading" class="card p-8 space-y-4">
      <BaseSkeleton variant="title" />
      <BaseSkeleton variant="text" />
      <BaseSkeleton variant="card" class="h-64" />
    </div>

    <div v-else-if="loadError" class="card p-8 text-center">
      <p class="text-lg text-red-600 mb-2">Hari ikibazo. Ongera ugerageze.</p>
      <p class="text-sm text-neutral-500 mb-4">{{ loadError }}</p>
      <div class="flex justify-center gap-3">
        <BaseButton variant="outline" size="sm" @click="fetchArticle">
          Ongera ugerageze
        </BaseButton>
        <BaseButton variant="ghost" size="sm" @click="goBack">
          Ingingo
        </BaseButton>
      </div>
    </div>

    <div v-else-if="!article && !loading" class="card p-8 text-center">
      <p class="text-lg text-neutral-600">Ntibashije kuboneka</p>
      <p class="text-sm text-neutral-400 mt-1 mb-4">
        The article you are trying to edit may have been deleted or the ID is invalid.
      </p>
      <BaseButton variant="outline" size="sm" @click="goBack">
        Ingingo
      </BaseButton>
    </div>

    <ArticleEditor
      v-else
      :key="article.id"
      :initial-data="article"
      @save="handleSave"
    />
  </div>
</template>

<script setup lang="ts">
import type { Article } from '~/types/article'
import ArticleEditor from '~/components/admin/ArticleEditor.vue'
import BaseSkeleton from '~/components/ui/BaseSkeleton.vue'
import BaseButton from '~/components/ui/BaseButton.vue'

const route = useRoute()
const router = useRouter()

definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth'],
})

const articleId = computed(() => route.params.id as string)
const article = ref<Article | null>(null)
const loading = ref(true)
const loadError = ref('')

async function fetchArticle() {
  loading.value = true
  loadError.value = ''
  try {
    const result = await useAdminFetch('/api/admin/articles/' + articleId.value)
    article.value = (result as any)?.data || null
  } catch (e: any) {
    loadError.value = e?.message || 'Could not load the article. Please try again.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchArticle()
})

async function handleSave(data: any) {
  try {
    await useAdminFetch('/api/admin/articles/' + articleId.value, {
      method: 'PUT',
      body: data,
    })

    const uiStore = useUiStore()
    uiStore.showToast({
      type: 'success',
      message: 'Article has been updated.',
    })

    router.push('/admin/articles')
  } catch (e: any) {
    const message = e?.data?.message || e?.message || 'Failed to save article.'
    const uiStore = useUiStore()
    uiStore.showToast({ type: 'error', message })
    throw e
  }
}

function goBack() {
  router.push('/admin/articles')
}
</script>
