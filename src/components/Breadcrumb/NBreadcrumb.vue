<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'

interface BreadcrumbItem {
  label: string
  href?: string
  icon?: string
}

interface Props {
  items: BreadcrumbItem[]
  separator?: string
  maxItems?: number
  collapseOnMobile?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  separator: '/',
  maxItems: 0,
  collapseOnMobile: true,
})

const emit = defineEmits<{
  click: [item: BreadcrumbItem, index: number]
}>()

const showDropdown = ref(false)
const isMobile = ref(false)

// Check if we should collapse based on maxItems or mobile
const shouldCollapse = computed(() => {
  if (props.maxItems > 0 && props.items.length > props.maxItems) return true
  if (props.collapseOnMobile && isMobile.value && props.items.length > 2) return true
  return false
})

// Get visible items when collapsed
const visibleItems = computed(() => {
  if (!shouldCollapse.value) return props.items
  
  const maxVisible = isMobile.value ? 2 : (props.maxItems || 3)
  if (props.items.length <= maxVisible) return props.items
  
  // Show first item, ellipsis, and last items
  const first = props.items.slice(0, 1)
  const last = props.items.slice(-(maxVisible - 1))
  return [...first, { label: '...', isEllipsis: true } as BreadcrumbItem & { isEllipsis?: boolean }, ...last]
})

// Get collapsed/hidden items for dropdown
const collapsedItems = computed(() => {
  if (!shouldCollapse.value) return []
  const maxVisible = isMobile.value ? 2 : (props.maxItems || 3)
  return props.items.slice(1, props.items.length - (maxVisible - 1))
})

function handleResize() {
  isMobile.value = window.innerWidth < 640
}

function toggleDropdown() {
  showDropdown.value = !showDropdown.value
}

function handleItemClick(item: BreadcrumbItem & { isEllipsis?: boolean }, index: number) {
  if (item.isEllipsis) {
    toggleDropdown()
    return
  }
  showDropdown.value = false
  // Find actual index in original items
  const actualIndex = props.items.findIndex(i => i.label === item.label && i.href === item.href)
  emit('click', item, actualIndex >= 0 ? actualIndex : index)
}

function handleCollapsedItemClick(item: BreadcrumbItem, index: number) {
  showDropdown.value = false
  const actualIndex = props.items.findIndex(i => i.label === item.label && i.href === item.href)
  emit('click', item, actualIndex >= 0 ? actualIndex : index + 1)
}

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <nav aria-label="Breadcrumb">
    <ol class="flex items-center gap-1.5 text-sm">
      <template v-for="(item, index) in visibleItems" :key="index">
        <li class="flex items-center gap-1.5">
          <!-- Ellipsis with dropdown -->
          <div v-if="(item as any).isEllipsis" class="relative">
            <button
              class="flex items-center justify-center w-6 h-6 rounded hover:bg-surface-100 text-surface-400 hover:text-surface-600 nexa-transition"
              aria-label="Show more breadcrumbs"
              @click="toggleDropdown"
            >
              <i class="i-mdi-dots-horizontal w-4 h-4" />
            </button>
            <!-- Dropdown menu -->
            <Transition name="dropdown">
              <div
                v-if="showDropdown"
                class="absolute top-full left-0 mt-1 py-1 bg-white rounded-lg shadow-lg ring-1 ring-black/5 min-w-32 z-dropdown"
              >
                <button
                  v-for="(collapsedItem, cIndex) in collapsedItems"
                  :key="cIndex"
                  class="w-full px-3 py-2 text-left text-sm text-surface-600 hover:bg-surface-50 hover:text-surface-900 nexa-transition"
                  @click="handleCollapsedItemClick(collapsedItem, cIndex)"
                >
                  <span v-if="collapsedItem.icon" :class="collapsedItem.icon" class="mr-2" />
                  {{ collapsedItem.label }}
                </button>
              </div>
            </Transition>
          </div>
          <!-- Regular breadcrumb item -->
          <component
            v-else
            :is="item.href ? 'a' : 'span'"
            :href="item.href"
            :class="[
              'flex items-center gap-1 nexa-transition px-1.5 py-1 rounded',
              index === visibleItems.length - 1
                ? 'text-surface-900 font-medium'
                : 'text-surface-500 hover:text-primary-600 hover:bg-surface-50 cursor-pointer',
            ]"
            :aria-current="index === visibleItems.length - 1 ? 'page' : undefined"
            @click="handleItemClick(item, index)"
          >
            <span v-if="item.icon" :class="item.icon" />
            <span class="truncate max-w-24 sm:max-w-none">{{ item.label }}</span>
          </component>
        </li>
        <li v-if="index < visibleItems.length - 1" aria-hidden="true" class="text-surface-300 flex-shrink-0">
          <slot name="separator">
            <i class="i-mdi-chevron-right w-4 h-4" />
          </slot>
        </li>
      </template>
    </ol>
  </nav>
</template>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 150ms ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
