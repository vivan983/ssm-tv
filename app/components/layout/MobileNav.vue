<template>
  <Transition
    enter-active-class="transition ease-out duration-200"
    enter-from-class="opacity-0 -translate-y-2"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition ease-in duration-150"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 -translate-y-2"
  >
    <div class="lg:hidden border-t border-neutral-200 bg-white">
      <nav class="container-main py-3 flex flex-col gap-1" aria-label="Mobile navigation">
        <!-- Logo at top of mobile menu -->
        <div class="flex justify-center py-3 mb-2 border-b border-neutral-100">
          <img
            src="/logo-ssm.png"
            alt="SSM TV"
            width="120"
            height="48"
            loading="lazy"
            class="h-10 w-auto"
          />
        </div>

        <template v-for="item in items" :key="item.to">
          <a
            v-if="item.external"
            :href="item.href"
            target="_blank"
            rel="noopener noreferrer"
            class="px-3 py-2.5 text-sm font-bold uppercase tracking-wide text-neutral-700 hover:text-green-700 hover:bg-green-50 rounded-md transition-colors"
            @click="$emit('close')"
          >
            {{ $t(item.labelKey) }}
          </a>
          <NuxtLink
            v-else
            :to="localePath(item.to)"
            class="px-3 py-2.5 text-sm font-bold uppercase tracking-wide text-neutral-700 hover:text-green-700 hover:bg-green-50 rounded-md transition-colors"
            active-class="text-green-700 bg-green-50 font-bold"
            exact-active-class="text-green-700 bg-green-50 font-bold"
            @click="$emit('close')"
          >
            {{ $t(item.labelKey) }}
          </NuxtLink>
        </template>
      </nav>
    </div>
  </Transition>
</template>

<script setup lang="ts">
defineProps<{
  items: Array<{ to: string; labelKey: string; external?: boolean; href?: string }>
}>()

defineEmits<{ close: [] }>()

const localePath = useLocalePath()
</script>
