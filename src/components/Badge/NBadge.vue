<script setup lang="ts">
import { computed } from 'vue'
import type { Status } from '@/types'

interface Props {
  value?: number | string
  dot?: boolean
  max?: number
  type?: Status
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  hidden?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  max: 99,
  type: 'error',
  position: 'top-right',
  hidden: false,
})

const typeClasses: Record<Status, string> = {
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  error: 'bg-error-500',
  info: 'bg-info-500',
}

const positionClasses: Record<string, string> = {
  'top-right': 'top-0 right-0 translate-x-1/3 -translate-y-1/3',
  'top-left': 'top-0 left-0 -translate-x-1/3 -translate-y-1/3',
  'bottom-right': 'bottom-0 right-0 translate-x-1/3 translate-y-1/3',
  'bottom-left': 'bottom-0 left-0 -translate-x-1/3 translate-y-1/3',
}

const dotPositionClasses: Record<string, string> = {
  'top-right': 'top-0 right-0',
  'top-left': 'top-0 left-0',
  'bottom-right': 'bottom-0 right-0',
  'bottom-left': 'bottom-0 left-0',
}

const displayValue = computed(() => {
  if (props.dot || props.value === undefined) return ''
  if (typeof props.value === 'number' && props.value > props.max) {
    return `${props.max}+`
  }
  return String(props.value)
})

const badgeClasses = computed(() => [
  'absolute text-white text-xs font-medium',
  typeClasses[props.type],
  props.dot ? dotPositionClasses[props.position] : positionClasses[props.position],
  props.dot ? 'h-2.5 w-2.5 rounded-full ring-2 ring-white' : 'min-w-5 h-5 px-1.5 rounded-full flex items-center justify-center',
])
</script>

<template>
  <div class="relative inline-flex">
    <slot />
    <span v-if="!hidden" :class="badgeClasses">
      {{ displayValue }}
    </span>
  </div>
</template>
