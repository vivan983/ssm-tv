<template>
  <div>
    <div class="flex items-center justify-end mb-6">
      <BaseButton @click="showCreateModal = true">
        + Ibyiciro
      </BaseButton>
    </div>

    <div class="card">
      <div v-if="categories.length > 0" class="divide-y divide-neutral-100">
        <div v-for="cat in categories" :key="cat.id" class="flex items-center justify-between px-5 py-4">
          <div>
            <p class="font-medium text-neutral-800">{{ cat.name }}</p>
            <p class="text-xs text-neutral-500">/{{ cat.slug }}</p>
          </div>
          <div class="flex gap-2">
            <button class="text-sm text-blue-600 hover:text-blue-700 px-3 py-1 rounded hover:bg-blue-50" @click="editCategory(cat)">
              Hindura
            </button>
            <button class="text-sm text-red-600 hover:text-red-700 px-3 py-1 rounded hover:bg-red-50" @click="handleDelete(cat)">
              Siba
            </button>
          </div>
        </div>
      </div>
      <div v-else class="px-5 py-12 text-center text-neutral-500">
        Nta byiciro bihari
      </div>
    </div>

    <!-- Create/Edit modal -->
    <BaseModal :open="showCreateModal || !!editingCategory" :title="editingCategory ? 'Hindura Icyiciro' : 'Icyiciro Gishya'" @close="resetModal">
      <div class="space-y-4">
        <BaseInput v-model="form.slug" label="Slug" placeholder="icyiciro-slug" />
        <BaseInput v-model="form.nameRw" label="Izina (Kinyarwanda)" placeholder="Izina" />
        <BaseInput v-model="form.nameEn" label="Izina (English)" placeholder="Name" />
        <BaseInput v-model="form.nameFr" label="Izina (Français)" placeholder="Nom" />
      </div>
      <template #footer>
        <BaseButton variant="ghost" @click="resetModal">Reka</BaseButton>
        <BaseButton @click="handleSave">Bika</BaseButton>
      </template>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import type { Category } from '~/types/article'
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseInput from '~/components/ui/BaseInput.vue'
import BaseModal from '~/components/ui/BaseModal.vue'

definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth'],
})

const categories = ref<Category[]>([])
const showCreateModal = ref(false)
const editingCategory = ref<Category | null>(null)

const form = reactive({
  slug: '',
  nameRw: '',
  nameEn: '',
  nameFr: '',
})

onMounted(async () => {
  try {
    const { data } = await useFetch('/api/categories')
    categories.value = (data.value as any)?.data || []
  } catch {}
})

function editCategory(cat: Category) {
  editingCategory.value = cat
  form.slug = cat.slug
  form.nameRw = cat.translations?.find((t) => t.language_code === 'rw')?.name || cat.name
  form.nameEn = cat.translations?.find((t) => t.language_code === 'en')?.name || ''
  form.nameFr = cat.translations?.find((t) => t.language_code === 'fr')?.name || ''
}

async function handleSave() {
  try {
    const payload = {
      slug: form.slug,
      translations: [
        { language_code: 'rw', name: form.nameRw },
        { language_code: 'en', name: form.nameEn },
        { language_code: 'fr', name: form.nameFr },
      ],
    }
    if (editingCategory.value) {
      await useAdminFetch(`/api/admin/categories/${editingCategory.value.id}`, {
        method: 'PUT',
        body: payload,
      })
    } else {
      await useAdminFetch('/api/admin/categories', { method: 'POST', body: payload })
    }
    // Refresh list
    const { data } = await useFetch('/api/categories')
    categories.value = (data.value as any)?.data || []
    resetModal()
  } catch {}
}

async function handleDelete(cat: Category) {
  if (!confirm('Uremeza gusiba iki cyiciro?')) return
  try {
    await useAdminFetch(`/api/admin/categories/${cat.id}`, { method: 'DELETE' })
    categories.value = categories.value.filter((c) => c.id !== cat.id)
  } catch {}
}

function resetModal() {
  showCreateModal.value = false
  editingCategory.value = null
  form.slug = ''
  form.nameRw = ''
  form.nameEn = ''
  form.nameFr = ''
}
</script>
