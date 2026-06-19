<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'text' | 'circular' | 'rectangular'
  animation?: 'pulse' | 'wave' | 'none'
  width?: string | number
  height?: string | number
  rows?: number
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'text',
  animation: 'pulse',
  rows: 1,
})

const baseClasses = computed(() => [
  'bg-surface-100',
  props.animation === 'pulse' && 'animate-pulse',
  props.animation === 'wave' && 'skeleton-wave',
  props.variant === 'circular' && 'rounded-full',
  props.variant === 'rectangular' && 'rounded-lg',
  props.variant === 'text' && 'rounded-md h-4',
])

const style = computed(() => ({
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
  height: typeof props.height === 'number' ? `${props.height}px` : props.height,
}))
</script>

<template>
  <div v-if="rows > 1" class="flex flex-col gap-2">
    <div
      v-for="i in rows"
      :key="i"
      :class="baseClasses"
      :style="{ ...style, width: i === rows ? '80%' : style.width }"
    />
  </div>
  <div v-else :class="baseClasses" :style="style" />
</template>

<style scoped>
.skeleton-wave {
  position: relative;
  overflow: hidden;
}
.skeleton-wave::after {
  content: '';
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  animation: wave 1.5s infinite;
}
@keyframes wave {
  100% {
    transform: translateX(100%);
  }
}
</style>
