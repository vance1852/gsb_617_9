<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  hoverable?: boolean
  clickable?: boolean
  bordered?: boolean
  shadow?: 'none' | 'sm' | 'md' | 'lg'
  glass?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  hoverable: false,
  clickable: false,
  bordered: false,
  shadow: 'sm',
  glass: false,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const shadowClasses = {
  none: '',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
}

const classes = computed(() => [
  'rounded-xl overflow-hidden ring-1 ring-surface-200/80',
  'nexa-transition',
  props.glass ? 'bg-white/70 backdrop-blur-xl' : 'bg-white',
  shadowClasses[props.shadow],
  props.hoverable && 'hover:shadow-md hover:ring-surface-300',
  props.clickable && 'cursor-pointer active:scale-[0.99]',
])
</script>

<template>
  <div
    :class="classes"
    :role="clickable ? 'button' : undefined"
    :tabindex="clickable ? 0 : undefined"
    @click="clickable && emit('click', $event)"
    @keydown.enter="clickable && emit('click', $event as unknown as MouseEvent)"
  >
    <div v-if="$slots.header" class="px-6 py-4">
      <slot name="header" />
    </div>
    <div class="px-6 pb-6" :class="{ 'pt-6': !$slots.header }">
      <slot />
    </div>
    <div v-if="$slots.footer" class="px-6 py-4 bg-surface-50/50">
      <slot name="footer" />
    </div>
  </div>
</template>
