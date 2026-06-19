<script setup lang="ts">
import { computed } from 'vue'
import type { Size, Variant } from '@/types'

interface Props {
  variant?: Variant
  size?: Size
  disabled?: boolean
  loading?: boolean
  iconOnly?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'solid',
  size: 'md',
  disabled: false,
  loading: false,
  iconOnly: false,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const sizeClasses: Record<Size, string> = {
  xs: 'h-7 px-2.5 text-xs gap-1',
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-9 px-4 text-sm gap-2',
  lg: 'h-10 px-5 text-sm gap-2',
  xl: 'h-11 px-6 text-base gap-2.5',
}

const iconOnlySizes: Record<Size, string> = {
  xs: 'h-7 w-7',
  sm: 'h-8 w-8',
  md: 'h-9 w-9',
  lg: 'h-10 w-10',
  xl: 'h-11 w-11',
}

const variantClasses: Record<Variant, string> = {
  solid: 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 shadow-sm',
  outline: 'bg-white text-surface-600 ring-1 ring-surface-200 hover:bg-surface-50 hover:ring-surface-300 active:bg-surface-100',
  ghost: 'text-surface-600 hover:bg-surface-100 active:bg-surface-200',
  text: 'text-primary-600 hover:text-primary-700 underline-offset-4 hover:underline',
}

const classes = computed(() => [
  'inline-flex items-center justify-center font-medium rounded-lg',
  'nexa-transition nexa-focus-ring select-none',
  'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
  props.iconOnly ? iconOnlySizes[props.size] : sizeClasses[props.size],
  variantClasses[props.variant],
])

function handleClick(e: MouseEvent) {
  if (!props.disabled && !props.loading) {
    emit('click', e)
  }
}
</script>

<template>
  <button
    :class="classes"
    :disabled="disabled || loading"
    :aria-disabled="disabled || loading"
    :aria-busy="loading"
    @click="handleClick"
  >
    <span v-if="loading" class="animate-spin" aria-hidden="true">
      <i class="i-mdi-loading w-4 h-4" />
    </span>
    <slot v-else name="icon-left" />
    <slot v-if="!iconOnly" />
    <slot name="icon-right" />
  </button>
</template>
