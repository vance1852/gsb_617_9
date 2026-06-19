<script setup lang="ts">
import { computed, ref } from 'vue'
import { useId } from '@/composables/useId'
import type { Status } from '@/types'

interface Props {
  modelValue?: string
  label?: string
  placeholder?: string
  helpText?: string
  status?: Status
  disabled?: boolean
  type?: 'text' | 'password' | 'email' | 'search' | 'number'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'search': [value: string]
  'clear': []
}>()

const id = useId('input')
const showPassword = ref(false)

const inputType = computed(() => {
  if (props.type === 'password') {
    return showPassword.value ? 'text' : 'password'
  }
  return props.type
})

const statusClasses: Record<Status, string> = {
  success: '!ring-success-500 !ring-2',
  warning: '!ring-warning-500 !ring-2',
  error: '!ring-error-500 !ring-2',
  info: '!ring-info-500 !ring-2',
}

const helpTextColors: Record<Status, string> = {
  success: 'text-success-600',
  warning: 'text-warning-600',
  error: 'text-error-600',
  info: 'text-info-600',
}

const isSearch = computed(() => props.type === 'search')

const inputClasses = computed(() => [
  'w-full h-9 rounded-lg bg-white',
  'nexa-transition text-sm',
  'placeholder:text-surface-400',
  'ring-1 ring-surface-200',
  'focus:outline-none focus:ring-2 focus:ring-primary-500/30',
  'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-surface-50',
  isSearch.value ? 'pl-9 pr-8' : 'px-3',
  props.type === 'password' ? 'pr-10' : '',
  props.status && statusClasses[props.status],
])

function onInput(e: Event) {
  emit('update:modelValue', (e.target as HTMLInputElement).value)
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && isSearch.value) {
    emit('search', props.modelValue)
  }
}

function clearInput() {
  emit('update:modelValue', '')
  emit('clear')
}
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label v-if="label" :for="id" class="text-sm font-medium text-surface-700">
      {{ label }}
    </label>
    <div class="relative">
      <slot name="prefix" />
      <!-- Search icon -->
      <span v-if="isSearch" class="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
      </span>
      <input
        :id="id"
        :type="inputType"
        :value="modelValue"
        :placeholder="placeholder || (isSearch ? '搜索...' : undefined)"
        :disabled="disabled"
        :class="inputClasses"
        :aria-describedby="helpText ? `${id}-help` : undefined"
        :aria-invalid="status === 'error'"
        @input="onInput"
        @keydown="onKeydown"
      />
      <!-- Search clear button -->
      <button
        v-if="isSearch && modelValue"
        type="button"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 nexa-transition"
        aria-label="Clear"
        @click="clearInput"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
      <button
        v-if="type === 'password'"
        type="button"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
        :aria-label="showPassword ? 'Hide password' : 'Show password'"
        @click="showPassword = !showPassword"
      >
        <i v-if="showPassword" class="i-mdi-eye-off w-5 h-5" />
        <i v-else class="i-mdi-eye w-5 h-5" />
      </button>
      <slot name="suffix" />
    </div>
    <p v-if="helpText" :id="`${id}-help`" :class="['text-xs', status ? helpTextColors[status] : 'text-surface-500']">
      {{ helpText }}
    </p>
  </div>
</template>
