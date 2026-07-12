<template>
  <div>
    <label v-if="label" :for="selectId" class="block text-sm font-medium text-neutral-700 mb-1.5">
      {{ label }}
      <span v-if="required" class="text-red-500 ml-0.5">*</span>
    </label>
    <select
      :id="selectId"
      :value="modelValue"
      :required="required"
      :class="[
        'w-full px-3.5 py-2.5 border rounded-md text-sm text-neutral-900 bg-white transition-colors duration-150',
        'focus:outline-none focus:ring-2 focus:ring-offset-0',
        error
          ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
          : 'border-neutral-300 focus:border-green-500 focus:ring-green-100 hover:border-neutral-400',
        disabled ? 'bg-neutral-50 cursor-not-allowed' : '',
      ]"
      @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
    <p v-if="error" class="mt-1 text-xs text-red-600">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string
  label?: string
  placeholder?: string
  options: Array<{ value: string; label: string }>
  error?: string
  required?: boolean
  disabled?: boolean
}>()

defineEmits<{ 'update:modelValue': [value: string] }>()

const selectId = `select-${Math.random().toString(36).substring(2, 9)}`
</script>
