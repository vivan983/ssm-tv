<template>
  <div>
    <!-- Loading -->
    <div v-if="loading" class="card p-8 space-y-4">
      <div v-for="i in 5" :key="i" class="flex gap-4">
        <div class="skeleton-pulse w-2 h-2 rounded-full mt-1.5" />
        <div class="flex-1 space-y-2">
          <div class="skeleton-pulse w-1/3 h-4 rounded" />
          <div class="skeleton-pulse w-2/3 h-3 rounded" />
          <div class="skeleton-pulse w-1/4 h-3 rounded" />
        </div>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="loadError" class="card p-8 text-center">
      <p class="text-red-600 text-sm mb-3">{{ loadError }}</p>
      <BaseButton variant="outline" size="sm" @click="fetchMessages">
        Ongera ugerageze
      </BaseButton>
    </div>

    <!-- Messages list -->
    <div v-else-if="messages.length > 0" class="card">
      <div class="divide-y divide-neutral-100">
        <div
          v-for="msg in messages"
          :key="msg.id"
          class="flex items-start gap-4 px-5 py-4 hover:bg-neutral-50 cursor-pointer transition-colors"
          :class="{ 'bg-blue-50/60': !msg.is_read }"
          @click="openMessage(msg)"
        >
          <!-- Unread dot -->
          <div class="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0" :class="msg.is_read ? 'bg-transparent' : 'bg-blue-500'" />
          <!-- Content -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-0.5">
              <span class="font-semibold text-neutral-800 text-sm">{{ msg.name }}</span>
              <span class="text-xs text-neutral-400 truncate">{{ msg.email }}</span>
              <span v-if="!msg.is_read" class="text-xs font-semibold text-blue-600 flex-shrink-0">Bishya</span>
            </div>
            <p class="text-sm text-neutral-500 line-clamp-1">{{ msg.subject || msg.message }}</p>
            <span class="text-xs text-neutral-400 mt-0.5 block">{{ formatDate(msg.created_at) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty -->
    <div v-else class="card px-5 py-16 text-center">
      <svg class="h-10 w-10 text-neutral-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
      <p class="text-sm text-neutral-500">Nta butumwa buhari</p>
    </div>

    <!-- Detail modal -->
    <BaseModal :open="selectedMsg !== null" :title="'Ubutumwa'" size="lg" @close="closeMessage">
      <div v-if="selectedMsg" class="space-y-4">
        <!-- Meta row -->
        <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6 text-sm">
          <div>
            <span class="text-neutral-500">Izina:</span>
            <span class="font-semibold ml-1">{{ selectedMsg.name }}</span>
          </div>
          <div>
            <span class="text-neutral-500">Imeyili:</span>
            <a :href="`mailto:${selectedMsg.email}`" class="font-medium text-green-700 hover:text-green-800 ml-1">{{ selectedMsg.email }}</a>
          </div>
        </div>
        <p class="text-xs text-neutral-400">{{ formatDate(selectedMsg.created_at) }}</p>

        <!-- Subject -->
        <div v-if="selectedMsg.subject">
          <p class="text-sm text-neutral-500 mb-1">Intego</p>
          <p class="font-semibold text-neutral-800">{{ selectedMsg.subject }}</p>
        </div>

        <!-- Message body -->
        <div>
          <p class="text-sm text-neutral-500 mb-1">Ubutumwa</p>
          <div class="bg-neutral-50 rounded-md p-4 text-sm text-neutral-700 whitespace-pre-wrap leading-relaxed">
            {{ selectedMsg.message }}
          </div>
        </div>
      </div>
      <template v-if="selectedMsg" #footer>
        <BaseButton variant="ghost" @click="closeMessage">Reka</BaseButton>
        <BaseButton variant="outline" @click="closeMessage">
          Funga nk'isomwe
        </BaseButton>
        <a :href="`mailto:${selectedMsg.email}`" class="inline-flex items-center px-4 py-2.5 bg-green-600 text-white rounded-md text-sm font-semibold hover:bg-green-700 transition-colors">
          Subiza kuri Imeyili
        </a>
      </template>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import type { ContactMessage } from '~/types/contact'
import BaseModal from '~/components/ui/BaseModal.vue'
import BaseButton from '~/components/ui/BaseButton.vue'

definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth'],
})

const messages = ref<ContactMessage[]>([])
const loading = ref(true)
const loadError = ref('')
const selectedMsg = ref<ContactMessage | null>(null)

onMounted(() => {
  fetchMessages()
})

async function fetchMessages() {
  loading.value = true
  loadError.value = ''
  try {
    const result = await useAdminFetch('/api/admin/messages')
    messages.value = (result as any)?.data || []
  } catch (e: any) {
    loadError.value = e?.message || 'Ntibyashobotse gukura ubutumwa.'
  } finally {
    loading.value = false
  }
}

function openMessage(msg: ContactMessage) {
  selectedMsg.value = msg
  // Mark as read locally immediately for responsive UI
  if (!msg.is_read) {
    msg.is_read = true
    // Fire-and-forget: mark as read on the server
    useAdminFetch(`/api/admin/messages/${msg.id}/read`, { method: 'POST' }).catch(() => {})
  }
}

function closeMessage() {
  selectedMsg.value = null
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('rw-RW', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}
</script>
