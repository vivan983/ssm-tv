<template>
  <div>
    <ArticleEditor @save="handleSave" />
  </div>
</template>

<script setup lang="ts">
import ArticleEditor from '~/components/admin/ArticleEditor.vue'

definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth'],
})

const router = useRouter()

async function handleSave(data: Record<string, unknown>) {
  await useAdminFetch('/api/admin/articles', {
    method: 'POST',
    body: data,
  })
  router.push('/admin/articles')
}
</script>
