<template>
  <div class="admin-layout">
    <!-- Sidebar overlay on mobile -->
    <div
      v-if="sidebarOpen"
      class="admin-sidebar-overlay"
      @click="sidebarOpen = false"
    />

    <!-- Sidebar -->
    <AdminSidebar :class="{ 'admin-sidebar--open': sidebarOpen }" />

    <!-- Main area -->
    <div class="admin-main">
      <AdminHeader @toggle-sidebar="sidebarOpen = !sidebarOpen" />
      <main class="admin-content">
        <slot />
      </main>
    </div>
    <BaseToast />
  </div>
</template>

<script setup lang="ts">
import AdminSidebar from '~/components/admin/AdminSidebar.vue'
import AdminHeader from '~/components/admin/AdminHeader.vue'
import BaseToast from '~/components/ui/BaseToast.vue'

const sidebarOpen = ref(false)

// Close sidebar on route change (mobile)
const route = useRoute()
watch(() => route.path, () => {
  sidebarOpen.value = false
})
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: #f9fafb;
}

/* ---- Sidebar ---- */
:deep(.admin-sidebar) {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 50;
  transform: translateX(-100%);
  transition: transform 0.2s ease;
}

@media (min-width: 1024px) {
  :deep(.admin-sidebar) {
    position: static;
    transform: none;
  }
}

:deep(.admin-sidebar--open) {
  transform: translateX(0);
}

/* ---- Mobile overlay ---- */
.admin-sidebar-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  z-index: 40;
}

@media (min-width: 1024px) {
  .admin-sidebar-overlay {
    display: none;
  }
}

/* ---- Main area ---- */
.admin-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.admin-content {
  flex: 1;
  padding: 20px 16px 48px;
  overflow: auto;
}

@media (min-width: 768px) {
  .admin-content {
    padding: 24px 24px 48px;
  }
}

@media (min-width: 1024px) {
  .admin-content {
    padding: 28px 32px 56px;
  }
}
</style>
