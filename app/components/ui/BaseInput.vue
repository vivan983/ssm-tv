<template>
  <div :class="{ 'opacity-60': disabled }">
    <label v-if="label" :for="inputId" class="block text-sm font-medium text-neutral-700 mb-1.5">
      {{ label }}
      <span v-if="required" class="text-red-500 ml-0.5">*</span>
    </label>
    <input
      :id="inputId"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :class="[
        'w-full px-3.5 py-2.5 border rounded-md text-sm text-neutral-900 bg-white transition-colors duration-200',
        'placeholder:text-neutral-400',
        'focus:outline-none focus:ring-2 focus:ring-offset-0',
        error
          ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
          : 'border-neutral-300 focus:border-green-500 focus:ring-green-100 hover:border-neutral-400',
        disabled ? 'bg-neutral-50 cursor-not-allowed' : '',
      ]"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @blur="$emit('blur')"
      @focus="$emit('focus')"
    />
    <p v-if="hint && !error" class="mt-1 text-xs text-neutral-500">{{ hint }}</p>
    <p v-if="error" class="mt-1 text-xs text-red-600">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string
  label?: string
  placeholder?: string
  type?: string
  error?: string
  hint?: string
  disabled?: boolean
  required?: boolean
}>()

defineEmits<{
  'update:modelValue': [value: string]
  blur: []
  focus: []
}>()

const inputId = `input-${Math.random().toString(36).substring(2, 9)}`
</script>
