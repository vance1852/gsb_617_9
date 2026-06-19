<script setup lang="ts">
import { computed } from 'vue'
import type { Size } from '@/types'

interface Props {
  src?: string
  alt?: string
  name?: string
  size?: Size
  rounded?: boolean
  online?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  rounded: true,
})

const sizeClasses: Record<Size, string> = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-14 w-14 text-lg',
}

const initials = computed(() => {
  if (!props.name) return ''
  return props.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
})

const classes = computed(() => [
  'relative inline-flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200 text-primary-700 font-semibold overflow-hidden',
  sizeClasses[props.size],
  props.rounded ? 'rounded-full' : 'rounded-lg',
])
</script>

<template>
  <div :class="classes">
    <img v-if="src" :src="src" :alt="alt || name" class="h-full w-full object-cover" />
    <span v-else-if="name">{{ initials }}</span>
    <slot v-else>
      <span class="i-carbon-user" />
    </slot>
    <span
      v-if="online !== undefined"
      :class="[
        'absolute bottom-0 right-0 block rounded-full ring-2 ring-white',
        size === 'xs' ? 'h-1.5 w-1.5' : size === 'sm' ? 'h-2 w-2' : 'h-2.5 w-2.5',
        online ? 'bg-success-500' : 'bg-surface-300',
      ]"
      :aria-label="online ? 'Online' : 'Offline'"
    />
  </div>
</template>
