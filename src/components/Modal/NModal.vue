<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import type { Size } from '@/types'

interface Props {
  modelValue: boolean
  title?: string
  size?: Size
  closable?: boolean
  closeOnOverlay?: boolean
  animation?: 'fade' | 'slide' | 'scale'
  draggable?: boolean
  glass?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  closable: true,
  closeOnOverlay: true,
  animation: 'scale',
  draggable: false,
  glass: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const sizeClasses: Record<Size, string> = {
  xs: 'max-w-xs',
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
}

// Drag state
const isDragging = ref(false)
const dragOffset = ref({ x: 0, y: 0 })
const modalPosition = ref({ x: 0, y: 0 })
const modalRef = ref<HTMLElement | null>(null)

// Dev warnings
if (import.meta.env.DEV) {
  if (props.draggable && !props.title) {
    console.warn('[NexaUI/Modal] draggable requires a title (drag handle is on the title bar)')
  }
  if (!['fade', 'slide', 'scale'].includes(props.animation)) {
    console.warn(`[NexaUI/Modal] invalid animation "${props.animation}", expected "fade" | "slide" | "scale"`)
  }
}

// Dynamic motion config based on animation prop
const motionInitial = computed(() => {
  switch (props.animation) {
    case 'fade':
      return { opacity: 0 }
    case 'slide':
      return { opacity: 0, y: -40 }
    case 'scale':
    default:
      return { opacity: 0, scale: 0.9, y: -20 }
  }
})

const motionEnter = computed(() => {
  switch (props.animation) {
    case 'fade':
      return { opacity: 1, transition: { duration: 200 } }
    case 'slide':
      return { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 25 } }
    case 'scale':
    default:
      return { opacity: 1, scale: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 25, mass: 0.8 } }
  }
})

const motionLeave = computed(() => {
  switch (props.animation) {
    case 'fade':
      return { opacity: 0, transition: { duration: 150 } }
    case 'slide':
      return { opacity: 0, y: 20, transition: { duration: 150 } }
    case 'scale':
    default:
      return { opacity: 0, scale: 0.95, transition: { duration: 150 } }
  }
})

const modalClasses = computed(() => [
  'relative w-full rounded-2xl shadow-2xl ring-1 ring-white/20',
  props.glass ? 'bg-white/80 backdrop-blur-xl' : 'bg-white',
  sizeClasses[props.size],
])

const modalStyle = computed(() => {
  if (!props.draggable) return {}
  return {
    transform: `translate(${modalPosition.value.x}px, ${modalPosition.value.y}px)`,
    cursor: isDragging.value ? 'grabbing' : 'default',
  }
})

function close() {
  emit('update:modelValue', false)
}

function onOverlayClick() {
  if (props.closeOnOverlay && !isDragging.value) close()
}

// Drag handlers
function startDrag(e: MouseEvent) {
  if (!props.draggable) return
  isDragging.value = true
  dragOffset.value = {
    x: e.clientX - modalPosition.value.x,
    y: e.clientY - modalPosition.value.y,
  }
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
}

function onDrag(e: MouseEvent) {
  if (!isDragging.value) return
  modalPosition.value = {
    x: e.clientX - dragOffset.value.x,
    y: e.clientY - dragOffset.value.y,
  }
}

function stopDrag() {
  isDragging.value = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
}

// ESC key handler
function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.modelValue && props.closable) {
    close()
  }
}

// Reset position when modal opens
watch(() => props.modelValue, (val) => {
  if (val) {
    // Lock scroll without hiding scrollbar (prevent layout shift)
    document.body.style.overflow = 'hidden'
    document.body.style.paddingRight = '0px'
    modalPosition.value = { x: 0, y: 0 }
  } else {
    document.body.style.overflow = ''
    document.body.style.paddingRight = ''
  }
})

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-overlay">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-modal flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        @click.self="onOverlayClick"
      >
        <Transition :name="`modal-${animation}`">
          <div 
            v-if="modelValue" 
            ref="modalRef"
            v-motion
            :initial="motionInitial"
            :enter="motionEnter"
            :leave="motionLeave"
            :class="modalClasses" 
            :style="modalStyle"
            role="dialog" 
            aria-modal="true"
          >
            <div 
              v-if="title || closable" 
              class="flex items-center justify-between px-6 py-5"
              :class="draggable && 'cursor-grab select-none'"
              @mousedown="startDrag"
            >
              <h2 class="text-lg font-semibold text-surface-900">{{ title }}</h2>
              <button
                v-if="closable"
                class="text-surface-400 hover:text-surface-600 hover:bg-surface-100 nexa-transition nexa-focus-ring rounded-full p-1.5 -mr-1.5"
                :class="draggable && 'cursor-pointer'"
                aria-label="Close modal"
                @click.stop="close"
                @mousedown.stop
              >
                <i class="i-mdi-close w-4 h-4" />
              </button>
            </div>
            <div class="px-6 pb-6" :class="{ 'pt-6': !title && !closable }">
              <slot />
            </div>
            <div v-if="$slots.footer" class="flex items-center justify-end gap-3 px-6 py-4 bg-surface-50/80 rounded-b-2xl">
              <slot name="footer" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-overlay-enter-active,
.modal-overlay-leave-active {
  transition: opacity 200ms ease;
}
.modal-overlay-enter-from,
.modal-overlay-leave-to {
  opacity: 0;
}

.modal-scale-enter-active,
.modal-scale-leave-active,
.modal-fade-enter-active,
.modal-fade-leave-active,
.modal-slide-enter-active,
.modal-slide-leave-active {
  /* Handled by v-motion */
}
</style>
