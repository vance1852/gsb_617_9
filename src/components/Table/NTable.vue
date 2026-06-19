<script setup lang="ts" generic="T extends Record<string, unknown>">
import { computed, ref, reactive, onMounted, onUnmounted } from 'vue'

interface Column<T> {
  key: keyof T
  label: string
  sortable?: boolean
  filterable?: boolean
  resizable?: boolean
  width?: string
}

interface Props {
  data: T[]
  columns: Column<T>[]
  striped?: boolean
  compact?: boolean
  stickyHeader?: boolean
  virtualScroll?: boolean
  rowHeight?: number
  visibleRows?: number
  pageSize?: number
  currentPage?: number
}

const props = withDefaults(defineProps<Props>(), {
  striped: false,
  compact: false,
  stickyHeader: false,
  virtualScroll: false,
  rowHeight: 52,
  visibleRows: 10,
  pageSize: 0,
  currentPage: 1,
})

const emit = defineEmits<{
  rowClick: [row: T, index: number]
  'update:currentPage': [page: number]
}>()

const sortKey = ref<string | null>(null)
const sortOrder = ref<'asc' | 'desc'>('asc')
const scrollTop = ref(0)
const containerRef = ref<HTMLElement | null>(null)
const page = ref(props.currentPage)

// Dev warnings
if (import.meta.env.DEV) {
  if (props.pageSize > 0 && props.virtualScroll) {
    console.warn('[NexaUI/Table] pageSize and virtualScroll should not be used together; pagination is disabled when virtualScroll is on')
  }
  if (props.columns.length === 0) {
    console.warn('[NexaUI/Table] columns array is empty, table will not render any data')
  }
}

// Filter state: key -> filter string
const filters = reactive<Record<string, string>>({})

// Column width state for resizing
const columnWidths = reactive<Record<string, string>>({})

// Initialize column widths from props
props.columns.forEach(col => {
  if (col.width) columnWidths[String(col.key)] = col.width
})

const hasFilters = computed(() => props.columns.some(c => c.filterable))

// Filtering
const filteredData = computed(() => {
  let result = props.data
  for (const col of props.columns) {
    if (!col.filterable) continue
    const f = filters[String(col.key)]
    if (!f) continue
    const lower = f.toLowerCase()
    result = result.filter(row => {
      const val = row[col.key]
      if (val == null) return false
      return String(val).toLowerCase().includes(lower)
    })
  }
  return result
})

// Sorting (on filtered data)
const sortedData = computed(() => {
  if (!sortKey.value) return filteredData.value
  const sk = sortKey.value as keyof T
  return [...filteredData.value].sort((a, b) => {
    const aVal = a[sk] as string | number
    const bVal = b[sk] as string | number
    const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0
    return sortOrder.value === 'asc' ? cmp : -cmp
  })
})

// Pagination
const isPaginated = computed(() => props.pageSize > 0 && !props.virtualScroll)
const totalPages = computed(() => isPaginated.value ? Math.max(1, Math.ceil(sortedData.value.length / props.pageSize)) : 1)

const paginatedData = computed(() => {
  if (!isPaginated.value) return sortedData.value
  const start = (page.value - 1) * props.pageSize
  return sortedData.value.slice(start, start + props.pageSize)
})

function goToPage(p: number) {
  if (p < 1 || p > totalPages.value) return
  page.value = p
  emit('update:currentPage', p)
}

// Virtual scroll calculations
const totalHeight = computed(() => paginatedData.value.length * props.rowHeight)
const startIndex = computed(() => Math.floor(scrollTop.value / props.rowHeight))
const endIndex = computed(() => Math.min(startIndex.value + props.visibleRows + 2, paginatedData.value.length))
const offsetY = computed(() => startIndex.value * props.rowHeight)

const visibleData = computed(() => {
  if (!props.virtualScroll) return paginatedData.value
  return paginatedData.value.slice(startIndex.value, endIndex.value)
})

const actualIndices = computed(() => {
  if (!props.virtualScroll) return paginatedData.value.map((_, i) => i)
  return Array.from({ length: endIndex.value - startIndex.value }, (_, i) => startIndex.value + i)
})

function toggleSort(key: keyof T) {
  const k = String(key)
  if (sortKey.value === k) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = k
    sortOrder.value = 'asc'
  }
}

function handleScroll(e: Event) {
  const target = e.target as HTMLElement
  scrollTop.value = target.scrollTop
}

// Column resize
let resizingCol: string | null = null
let resizeStartX = 0
let resizeStartW = 0

function startResize(e: MouseEvent, colKey: string) {
  e.preventDefault()
  e.stopPropagation()
  resizingCol = colKey
  resizeStartX = e.clientX
  const th = (e.target as HTMLElement).closest('th')
  resizeStartW = th ? th.getBoundingClientRect().width : 100
  document.addEventListener('mousemove', onResize)
  document.addEventListener('mouseup', stopResize)
}

function onResize(e: MouseEvent) {
  if (!resizingCol) return
  const diff = e.clientX - resizeStartX
  const newW = Math.max(50, resizeStartW + diff)
  columnWidths[resizingCol] = `${newW}px`
}

function stopResize() {
  resizingCol = null
  document.removeEventListener('mousemove', onResize)
  document.removeEventListener('mouseup', stopResize)
}

function getColStyle(col: Column<T>): Record<string, string> {
  const w = columnWidths[String(col.key)] || col.width
  return w ? { width: w } : {}
}

onMounted(() => {
  if (props.virtualScroll && containerRef.value) {
    containerRef.value.addEventListener('scroll', handleScroll)
  }
})

onUnmounted(() => {
  if (containerRef.value) {
    containerRef.value.removeEventListener('scroll', handleScroll)
  }
  document.removeEventListener('mousemove', onResize)
  document.removeEventListener('mouseup', stopResize)
})
</script>

<template>
  <div class="rounded-xl bg-white ring-1 ring-surface-200/80">
    <div 
      ref="containerRef"
      :class="virtualScroll ? 'overflow-auto' : 'overflow-auto'"
      :style="virtualScroll ? { maxHeight: `${visibleRows * rowHeight + 44}px` } : {}"
    >
      <table class="w-full text-sm" :style="virtualScroll ? { minWidth: '100%' } : {}">
        <thead :class="['text-surface-500 text-xs uppercase tracking-wider bg-white', stickyHeader && 'sticky top-0 z-10']">
          <tr>
            <th
              v-for="col in columns"
              :key="String(col.key)"
              :class="[
                'text-left font-medium relative group',
                compact ? 'px-3 py-2.5' : 'px-4 py-3',
                col.sortable && 'cursor-pointer hover:text-surface-700 nexa-transition select-none',
              ]"
              :style="getColStyle(col)"
              @click="col.sortable && toggleSort(col.key)"
            >
              <div class="flex items-center gap-1.5">
                {{ col.label }}
                <svg v-if="col.sortable && sortKey === col.key" class="w-3.5 h-3.5" :class="sortOrder === 'desc' && 'rotate-180'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                </svg>
              </div>
              <!-- Resize handle -->
              <span
                v-if="col.resizable !== false"
                class="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize opacity-0 group-hover:opacity-100 bg-surface-300 hover:bg-primary-400 nexa-transition"
                @mousedown="startResize($event, String(col.key))"
              />
            </th>
          </tr>
          <!-- Filter row -->
          <tr v-if="hasFilters">
            <th v-for="col in columns" :key="'filter-' + String(col.key)" :class="compact ? 'px-3 py-1.5' : 'px-4 py-2'">
              <input
                v-if="col.filterable"
                :value="filters[String(col.key)] || ''"
                type="text"
                class="w-full px-2 py-1 text-xs font-normal normal-case tracking-normal rounded border border-surface-200 bg-surface-50 text-surface-700 placeholder-surface-400 focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400/30 nexa-transition"
                placeholder="筛选..."
                @input="filters[String(col.key)] = ($event.target as HTMLInputElement).value"
                @click.stop
              />
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-surface-100">
          <!-- Virtual scroll spacer -->
          <tr v-if="virtualScroll && offsetY > 0" :style="{ height: `${offsetY}px` }">
            <td :colspan="columns.length"></td>
          </tr>
          <tr
            v-for="(row, idx) in visibleData"
            :key="actualIndices[idx]"
            :class="[
              'hover:bg-surface-50/50 nexa-transition cursor-pointer',
              striped && actualIndices[idx] % 2 === 1 && 'bg-surface-50/30',
            ]"
            :style="virtualScroll ? { height: `${rowHeight}px` } : {}"
            @click="emit('rowClick', row, actualIndices[idx])"
          >
            <td v-for="col in columns" :key="String(col.key)" :class="[compact ? 'px-3 py-2.5' : 'px-4 py-3.5', 'text-surface-700']">
              <slot :name="`cell-${String(col.key)}`" :value="row[col.key]" :row="row">
                {{ row[col.key] }}
              </slot>
            </td>
          </tr>
          <!-- Virtual scroll bottom spacer -->
          <tr v-if="virtualScroll" :style="{ height: `${totalHeight - offsetY - visibleData.length * rowHeight}px` }">
            <td :colspan="columns.length"></td>
          </tr>
          <!-- Empty state -->
          <tr v-if="visibleData.length === 0">
            <td :colspan="columns.length" class="text-center py-8 text-surface-400">暂无数据</td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Pagination -->
    <div v-if="isPaginated" class="flex items-center justify-between px-4 py-3 border-t border-surface-100 text-sm text-surface-500">
      <span>共 {{ sortedData.length }} 条，第 {{ page }}/{{ totalPages }} 页</span>
      <div class="flex items-center gap-1">
        <button
          class="px-2 py-1 rounded hover:bg-surface-100 disabled:opacity-40 disabled:cursor-not-allowed nexa-transition"
          :disabled="page <= 1"
          @click="goToPage(1)"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
        </button>
        <button
          class="px-2 py-1 rounded hover:bg-surface-100 disabled:opacity-40 disabled:cursor-not-allowed nexa-transition"
          :disabled="page <= 1"
          @click="goToPage(page - 1)"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7 7" /></svg>
        </button>
        <template v-for="p in totalPages" :key="p">
          <button
            v-if="p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1)"
            :class="[
              'min-w-[28px] px-2 py-1 rounded nexa-transition',
              p === page ? 'bg-primary-500 text-white' : 'hover:bg-surface-100',
            ]"
            @click="goToPage(p)"
          >
            {{ p }}
          </button>
          <span v-else-if="p === page - 2 || p === page + 2" class="px-1">...</span>
        </template>
        <button
          class="px-2 py-1 rounded hover:bg-surface-100 disabled:opacity-40 disabled:cursor-not-allowed nexa-transition"
          :disabled="page >= totalPages"
          @click="goToPage(page + 1)"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
        </button>
        <button
          class="px-2 py-1 rounded hover:bg-surface-100 disabled:opacity-40 disabled:cursor-not-allowed nexa-transition"
          :disabled="page >= totalPages"
          @click="goToPage(totalPages)"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
        </button>
      </div>
    </div>
  </div>
</template>
