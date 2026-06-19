<script setup lang="ts">
import { computed, provide, ref, watch, nextTick, onMounted } from 'vue'

interface Tab {
  key: string
  label: string
  icon?: string
  disabled?: boolean
  closable?: boolean
}

interface Props {
  modelValue?: string
  tabs: Tab[]
  vertical?: boolean
  closable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  vertical: false,
  closable: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'close': [key: string]
}>()

// Dev warnings
if (import.meta.env.DEV) {
  if (props.tabs.length === 0) {
    console.warn('[NexaUI/Tabs] tabs array is empty')
  }
  if (props.modelValue && !props.tabs.find(t => t.key === props.modelValue)) {
    console.warn(`[NexaUI/Tabs] modelValue "${props.modelValue}" does not match any tab key`)
  }
}

const activeKey = ref(props.modelValue || props.tabs[0]?.key)
const tabListRef = ref<HTMLElement | null>(null)
const indicatorStyle = ref<Record<string, string>>({})

watch(() => props.modelValue, (val) => {
  if (val) activeKey.value = val
})

watch(() => activeKey.value, () => {
  nextTick(updateIndicator)
})

watch(() => props.tabs, () => {
  nextTick(updateIndicator)
}, { deep: true })

onMounted(() => {
  nextTick(updateIndicator)
})

function updateIndicator() {
  if (!tabListRef.value) return
  const activeBtn = tabListRef.value.querySelector('[aria-selected="true"]') as HTMLElement | null
  if (!activeBtn) {
    indicatorStyle.value = { opacity: '0' }
    return
  }
  const listRect = tabListRef.value.getBoundingClientRect()
  const btnRect = activeBtn.getBoundingClientRect()
  if (props.vertical) {
    indicatorStyle.value = {
      height: `${btnRect.height}px`,
      width: '2px',
      top: `${btnRect.top - listRect.top}px`,
      left: '0px',
      opacity: '1',
    }
  } else {
    indicatorStyle.value = {
      width: `${btnRect.width}px`,
      height: '2px',
      left: `${btnRect.left - listRect.left}px`,
      bottom: '0px',
      opacity: '1',
    }
  }
}

function selectTab(key: string) {
  activeKey.value = key
  emit('update:modelValue', key)
}

function closeTab(key: string) {
  emit('close', key)
}

function isTabClosable(tab: Tab): boolean {
  if (tab.closable !== undefined) return tab.closable
  return props.closable
}

// Keyboard navigation
function handleKeydown(e: KeyboardEvent) {
  const enabledTabs = props.tabs.filter(t => !t.disabled)
  const currentIdx = enabledTabs.findIndex(t => t.key === activeKey.value)
  if (currentIdx === -1) return

  let nextIdx = -1
  const isHorizontal = !props.vertical

  if ((isHorizontal && e.key === 'ArrowRight') || (!isHorizontal && e.key === 'ArrowDown')) {
    e.preventDefault()
    nextIdx = (currentIdx + 1) % enabledTabs.length
  } else if ((isHorizontal && e.key === 'ArrowLeft') || (!isHorizontal && e.key === 'ArrowUp')) {
    e.preventDefault()
    nextIdx = (currentIdx - 1 + enabledTabs.length) % enabledTabs.length
  } else if (e.key === 'Home') {
    e.preventDefault()
    nextIdx = 0
  } else if (e.key === 'End') {
    e.preventDefault()
    nextIdx = enabledTabs.length - 1
  }

  if (nextIdx >= 0) {
    selectTab(enabledTabs[nextIdx].key)
    // Focus the new active tab button
    nextTick(() => {
      if (!tabListRef.value) return
      const buttons = tabListRef.value.querySelectorAll('[role="tab"]:not([aria-disabled="true"])')
      ;(buttons[nextIdx] as HTMLElement)?.focus()
    })
  }
}

provide('activeTab', activeKey)

const containerClasses = computed(() => [
  'flex',
  props.vertical ? 'flex-row gap-6' : 'flex-col',
])

const tabListClasses = computed(() => [
  'relative flex',
  props.vertical ? 'flex-col gap-1' : 'gap-1 border-b border-surface-200',
])
</script>

<template>
  <div :class="containerClasses">
    <div ref="tabListRef" :class="tabListClasses" role="tablist" :aria-orientation="vertical ? 'vertical' : 'horizontal'" @keydown="handleKeydown">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        role="tab"
        :aria-selected="activeKey === tab.key"
        :aria-disabled="tab.disabled"
        :tabindex="activeKey === tab.key ? 0 : -1"
        :class="[
          'relative inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium nexa-transition nexa-focus-ring',
          activeKey === tab.key 
            ? 'text-primary-600' 
            : 'text-surface-500 hover:text-surface-700',
          tab.disabled && 'opacity-50 cursor-not-allowed',
        ]"
        @click="!tab.disabled && selectTab(tab.key)"
      >
        <span v-if="tab.icon" :class="tab.icon" />
        {{ tab.label }}
        <span
          v-if="isTabClosable(tab)"
          class="inline-flex items-center justify-center w-4 h-4 ml-1 rounded-full hover:bg-surface-200 text-surface-400 hover:text-surface-600 nexa-transition"
          role="button"
          :aria-label="`Close ${tab.label}`"
          @click.stop="closeTab(tab.key)"
        >
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </span>
      </button>
      <!-- Underline indicator -->
      <span
        class="absolute bg-primary-500 rounded-full nexa-transition pointer-events-none"
        :style="indicatorStyle"
      />
    </div>
    <div class="flex-1 pt-4" role="tabpanel">
      <slot :active-key="activeKey" />
    </div>
  </div>
</template>
