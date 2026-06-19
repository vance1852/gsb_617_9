<script setup lang="ts">
import { ref } from 'vue'
import { NButton } from './components/Button'
import { NInput } from './components/Input'
import { NCard } from './components/Card'
import { NAvatar } from './components/Avatar'
import { NTabs } from './components/Tabs'
import { NBreadcrumb } from './components/Breadcrumb'
import { NToast } from './components/Toast'
import { NModal } from './components/Modal'
import { NSkeleton } from './components/Skeleton'
import { NTable } from './components/Table'
import { NBadge } from './components/Badge'

const inputValue = ref('')
const passwordValue = ref('')
const modalOpen = ref(false)
const showToast = ref(false)
const toastType = ref<'success' | 'error' | 'warning' | 'info'>('success')
const toastMessage = ref('')
const activeTab = ref('overview')
const isLoading = ref(false)

const tabs = [
  { key: 'overview', label: '概览' },
  { key: 'analytics', label: '分析' },
  { key: 'reports', label: '报告' },
  { key: 'notifications', label: '通知' },
]

const breadcrumbs = [
  { label: '首页', href: '#' },
  { label: '产品中心', href: '#' },
  { label: '组件库', href: '#' },
  { label: '基础组件', href: '#' },
  { label: '按钮' },
]

const tableData = [
  { id: 1, name: '张三', email: 'zhangsan@email.com', status: '活跃', amount: '¥1,999.00' },
  { id: 2, name: '李四', email: 'lisi@email.com', status: '活跃', amount: '¥39.00' },
  { id: 3, name: '王五', email: 'wangwu@email.com', status: '离线', amount: '¥299.00' },
  { id: 4, name: '赵六', email: 'zhaoliu@email.com', status: '活跃', amount: '¥99.00' },
]

const tableColumns = [
  { key: 'name' as const, label: '姓名', sortable: true },
  { key: 'email' as const, label: '邮箱' },
  { key: 'status' as const, label: '状态' },
  { key: 'amount' as const, label: '金额', sortable: true },
]

const teamMembers = [
  { name: '张晓明', role: '产品设计师', online: true },
  { name: '李思琪', role: '前端开发', online: true },
  { name: '王建国', role: '后端开发', online: false },
]

const projectName = ref('')
const projectDesc = ref('')

function showMessage(type: 'success' | 'error' | 'warning' | 'info', message: string) {
  toastType.value = type
  toastMessage.value = message
  showToast.value = true
}

function handleCreateProject() {
  if (!projectName.value) {
    showMessage('error', '请输入项目名称！')
    return
  }
  modalOpen.value = false
  showMessage('success', `项目「${projectName.value}」创建成功！`)
  projectName.value = ''
  projectDesc.value = ''
}

function simulateLoading() {
  isLoading.value = true
  setTimeout(() => {
    isLoading.value = false
    showMessage('success', '操作成功！')
  }, 2000)
}

function handleRowClick(row: typeof tableData[0]) {
  showMessage('info', `查看用户：${row.name}`)
}
</script>

<template>
  <div class="min-h-screen bg-surface-50">
    <!-- 导航栏 -->
    <nav class="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm">
      <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div class="flex items-center gap-8">
          <div class="flex items-center gap-2 cursor-pointer hover:opacity-80 nexa-transition" @click="showMessage('info', '欢迎使用 Nexa UI！')">
            <div class="h-8 w-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-sm">
              <span class="text-white font-bold text-sm">N</span>
            </div>
            <span class="font-semibold text-lg text-surface-900">Nexa UI</span>
          </div>
          <div class="hidden md:flex items-center gap-1">
            <a href="#buttons" class="px-3 py-2 rounded-lg text-sm text-surface-600 hover:text-surface-900 hover:bg-surface-100 nexa-transition">按钮</a>
            <a href="#inputs" class="px-3 py-2 rounded-lg text-sm text-surface-600 hover:text-surface-900 hover:bg-surface-100 nexa-transition">输入框</a>
            <a href="#feedback" class="px-3 py-2 rounded-lg text-sm text-surface-600 hover:text-surface-900 hover:bg-surface-100 nexa-transition">反馈</a>
          </div>
        </div>
        <a href="http://localhost:3001" target="_blank" class="text-sm text-surface-600 hover:text-primary-600 nexa-transition">
          文档
        </a>
      </div>
    </nav>

    <!-- Hero 区域 -->
    <section class="relative overflow-hidden bg-gradient-to-b from-white to-surface-50">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.08),transparent_50%)]"></div>
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(124,58,237,0.06),transparent_50%)]"></div>
      <div class="max-w-7xl mx-auto px-6 py-20 relative">
        <div class="max-w-3xl">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6 cursor-pointer hover:bg-primary-200 nexa-transition" @click="showMessage('info', '查看更新日志')">
            <span>✨</span>
            <span>Nexa UI v0.1 正式发布</span>
          </div>
          <h1 class="text-5xl md:text-6xl font-bold tracking-tight text-surface-900 mb-6">
            更快地构建
            <span class="bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">精美界面</span>
          </h1>
          <p class="text-xl text-surface-500 mb-8 leading-relaxed">
            基于原子设计理念的现代化 Vue 3 组件库。无障碍访问、高度可定制、精心打造。
          </p>
          <div class="flex flex-wrap gap-4">
            <a href="http://localhost:3001/guide/getting-started.html" target="_blank">
              <NButton size="lg">🚀 快速开始</NButton>
            </a>
            <a href="http://localhost:3001" target="_blank">
              <NButton variant="outline" size="lg">📖 查看文档</NButton>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- 主要内容 -->
    <main class="max-w-7xl mx-auto px-6 py-12">
      <!-- 面包屑 (响应式折叠) -->
      <div class="mb-8">
        <NBreadcrumb :items="breadcrumbs" :max-items="4" @click="(item) => showMessage('info', `导航到：${item.label}`)" />
      </div>

      <!-- 按钮组件展示 -->
      <div id="buttons" class="grid lg:grid-cols-3 gap-6 mb-12">
        <NCard class="lg:col-span-2">
          <template #header>
            <div>
              <h3 class="font-semibold text-surface-900">Button 按钮</h3>
              <p class="text-sm text-surface-500 mt-1">触发操作的交互元素，支持多种变体和状态</p>
            </div>
          </template>
          <div class="space-y-6">
            <div>
              <p class="text-xs font-medium text-surface-400 uppercase tracking-wider mb-3">变体</p>
              <div class="flex flex-wrap gap-3">
                <NButton @click="showMessage('success', '实心按钮点击')">实心 Solid</NButton>
                <NButton variant="outline" @click="showMessage('info', '描边按钮点击')">描边 Outline</NButton>
                <NButton variant="ghost" @click="showMessage('warning', '幽灵按钮点击')">幽灵 Ghost</NButton>
                <NButton variant="text" @click="showMessage('error', '文字按钮点击')">文字 Text</NButton>
              </div>
            </div>
            <div>
              <p class="text-xs font-medium text-surface-400 uppercase tracking-wider mb-3">尺寸</p>
              <div class="flex flex-wrap items-center gap-3">
                <NButton size="xs" @click="showMessage('info', 'XS')">超小</NButton>
                <NButton size="sm" @click="showMessage('info', 'SM')">小号</NButton>
                <NButton size="md" @click="showMessage('info', 'MD')">中号</NButton>
                <NButton size="lg" @click="showMessage('info', 'LG')">大号</NButton>
                <NButton size="xl" @click="showMessage('info', 'XL')">超大</NButton>
              </div>
            </div>
            <div>
              <p class="text-xs font-medium text-surface-400 uppercase tracking-wider mb-3">状态</p>
              <div class="flex flex-wrap gap-3">
                <NButton :loading="isLoading" @click="simulateLoading">{{ isLoading ? '加载中...' : '点击加载' }}</NButton>
                <NButton disabled>禁用状态</NButton>
              </div>
            </div>
          </div>
        </NCard>

        <!-- Avatar 组件展示 -->
        <NCard>
          <template #header>
            <div>
              <h3 class="font-semibold text-surface-900">Avatar 头像</h3>
              <p class="text-sm text-surface-500 mt-1">用户头像与在线状态</p>
            </div>
          </template>
          <div class="space-y-3">
            <div 
              v-for="member in teamMembers" 
              :key="member.name" 
              class="flex items-center gap-3 p-2 -mx-2 rounded-lg cursor-pointer hover:bg-surface-50 nexa-transition"
              @click="showMessage('info', `查看 ${member.name} 的资料`)"
            >
              <NAvatar :name="member.name" size="md" :online="member.online" />
              <div class="flex-1 min-w-0">
                <p class="font-medium text-sm text-surface-900">{{ member.name }}</p>
                <p class="text-xs text-surface-500">{{ member.role }}</p>
              </div>
            </div>
          </div>
          <template #footer>
            <NButton variant="outline" class="w-full" size="sm" @click="modalOpen = true">+ 添加成员</NButton>
          </template>
        </NCard>
      </div>

      <!-- 输入框区域 -->
      <div id="inputs" class="grid lg:grid-cols-2 gap-6 mb-12">
        <NCard>
          <template #header>
            <div>
              <h3 class="font-semibold text-surface-900">Input 输入框</h3>
              <p class="text-sm text-surface-500 mt-1">带验证状态的表单控件</p>
            </div>
          </template>
          <div class="space-y-4">
            <NInput v-model="inputValue" label="邮箱地址" placeholder="请输入您的邮箱" type="email" help-text="我们不会分享您的邮箱" />
            <NInput v-model="passwordValue" type="password" label="密码" placeholder="请输入密码" help-text="密码至少8位" />
            <NInput label="错误状态" status="error" help-text="此字段为必填项" placeholder="必填字段" />
            <NInput label="成功状态" status="success" help-text="格式正确！" model-value="valid@email.com" />
          </div>
        </NCard>

        <NCard>
          <template #header>
            <div>
              <h3 class="font-semibold text-surface-900">Skeleton 骨架屏</h3>
              <p class="text-sm text-surface-500 mt-1">内容加载占位符</p>
            </div>
          </template>
          <div class="space-y-6">
            <div>
              <p class="text-xs font-medium text-surface-400 uppercase tracking-wider mb-3">用户卡片</p>
              <div class="flex items-center gap-4">
                <NSkeleton variant="circular" width="48" height="48" />
                <div class="flex-1 space-y-2">
                  <NSkeleton width="60%" height="14" />
                  <NSkeleton width="40%" height="12" />
                </div>
              </div>
            </div>
            <div>
              <p class="text-xs font-medium text-surface-400 uppercase tracking-wider mb-3">图片 (波浪动画)</p>
              <NSkeleton variant="rectangular" width="100%" height="80" animation="wave" />
            </div>
            <div>
              <p class="text-xs font-medium text-surface-400 uppercase tracking-wider mb-3">多行文本</p>
              <NSkeleton :rows="3" />
            </div>
          </div>
        </NCard>
      </div>

      <!-- 标签页区域 -->
      <NCard class="mb-12">
        <template #header>
          <div>
            <h3 class="font-semibold text-surface-900">Tabs 标签页</h3>
            <p class="text-sm text-surface-500 mt-1">将内容组织成多个可切换的部分</p>
          </div>
        </template>
        <NTabs v-model="activeTab" :tabs="tabs">
          <template #default="{ activeKey }">
            <div class="bg-surface-50 rounded-xl p-6">
              <div v-if="activeKey === 'overview'" class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="bg-white rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-md nexa-transition" @click="showMessage('info', '查看收入详情')">
                  <p class="text-2xl font-bold text-surface-900">¥45,231</p>
                  <p class="text-sm text-surface-500">总收入</p>
                  <p class="text-xs text-success-600 mt-1">↑ 12% 较上月</p>
                </div>
                <div class="bg-white rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-md nexa-transition" @click="showMessage('info', '查看订阅详情')">
                  <p class="text-2xl font-bold text-surface-900">+2,350</p>
                  <p class="text-sm text-surface-500">新增订阅</p>
                  <p class="text-xs text-success-600 mt-1">↑ 8% 较上月</p>
                </div>
                <div class="bg-white rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-md nexa-transition" @click="showMessage('info', '查看用户详情')">
                  <p class="text-2xl font-bold text-surface-900">12,234</p>
                  <p class="text-sm text-surface-500">活跃用户</p>
                  <p class="text-xs text-error-600 mt-1">↓ 3% 较上月</p>
                </div>
              </div>
              <div v-else class="text-center py-12">
                <p class="text-4xl mb-4">{{ activeKey === 'analytics' ? '📊' : activeKey === 'reports' ? '📈' : '🔔' }}</p>
                <p class="text-surface-600 font-medium">{{ activeKey === 'analytics' ? '数据分析' : activeKey === 'reports' ? '报告中心' : '通知设置' }}</p>
                <p class="text-surface-400 text-sm mt-2">功能开发中...</p>
              </div>
            </div>
          </template>
        </NTabs>
      </NCard>

      <!-- 表格区域 -->
      <NCard class="mb-12">
        <template #header>
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-semibold text-surface-900">Table 表格</h3>
              <p class="text-sm text-surface-500 mt-1">点击表头排序，点击行查看详情</p>
            </div>
            <NButton variant="outline" size="sm" @click="showMessage('success', '数据导出成功！')">导出</NButton>
          </div>
        </template>
        <NTable :data="tableData" :columns="tableColumns" striped @row-click="handleRowClick">
          <template #cell-name="{ row }">
            <div class="flex items-center gap-3">
              <NAvatar :name="row.name" size="sm" />
              <span class="font-medium">{{ row.name }}</span>
            </div>
          </template>
          <template #cell-status="{ value }">
            <span :class="[
              'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
              value === '活跃' ? 'bg-success-100 text-success-700' : 'bg-surface-100 text-surface-600'
            ]">
              {{ value }}
            </span>
          </template>
          <template #cell-amount="{ value }">
            <span class="font-semibold text-surface-900">{{ value }}</span>
          </template>
        </NTable>
      </NCard>

      <!-- Badge 徽标展示 -->
      <NCard class="mb-12">
        <template #header>
          <div>
            <h3 class="font-semibold text-surface-900">Badge 徽标</h3>
            <p class="text-sm text-surface-500 mt-1">用于显示数字、状态或小红点</p>
          </div>
        </template>
        <div class="space-y-6">
          <div>
            <p class="text-xs font-medium text-surface-400 uppercase tracking-wider mb-4">数字徽标</p>
            <div class="flex flex-wrap items-center gap-4">
              <NBadge :value="5" type="error">
                <NButton variant="outline" @click="showMessage('info', '5 条消息')">消息</NButton>
              </NBadge>
              <NBadge :value="99" type="error">
                <NButton variant="outline" @click="showMessage('info', '99 条通知')">通知</NButton>
              </NBadge>
              <NBadge :value="100" :max="99" type="error">
                <NButton variant="outline" @click="showMessage('info', '超过 99 条')">更多</NButton>
              </NBadge>
            </div>
          </div>
          <div>
            <p class="text-xs font-medium text-surface-400 uppercase tracking-wider mb-4">点状徽标</p>
            <div class="flex flex-wrap items-center gap-4">
              <NBadge dot type="error">
                <NAvatar name="张三" size="lg" class="cursor-pointer hover:ring-2 hover:ring-primary-200 nexa-transition" @click="showMessage('info', '张三 - 有新消息')" />
              </NBadge>
              <NBadge dot type="success">
                <NAvatar name="李四" size="lg" class="cursor-pointer hover:ring-2 hover:ring-primary-200 nexa-transition" @click="showMessage('info', '李四 - 在线')" />
              </NBadge>
              <NBadge dot type="warning">
                <NAvatar name="王五" size="lg" class="cursor-pointer hover:ring-2 hover:ring-primary-200 nexa-transition" @click="showMessage('info', '王五 - 忙碌')" />
              </NBadge>
            </div>
          </div>
        </div>
      </NCard>

      <!-- 反馈组件 -->
      <div id="feedback">
        <NCard>
          <template #header>
            <div>
              <h3 class="font-semibold text-surface-900">反馈组件</h3>
              <p class="text-sm text-surface-500 mt-1">Modal 模态框和 Toast 轻提示</p>
            </div>
          </template>
          <div class="space-y-6">
            <div>
              <p class="text-xs font-medium text-surface-400 uppercase tracking-wider mb-3">模态框</p>
              <NButton @click="modalOpen = true">打开模态框</NButton>
            </div>
            <div>
              <p class="text-xs font-medium text-surface-400 uppercase tracking-wider mb-3">轻提示</p>
              <div class="flex flex-wrap gap-3">
                <NButton variant="outline" @click="showMessage('success', '操作成功！')">成功</NButton>
                <NButton variant="outline" @click="showMessage('error', '操作失败！')">错误</NButton>
                <NButton variant="outline" @click="showMessage('warning', '请注意！')">警告</NButton>
                <NButton variant="outline" @click="showMessage('info', '提示信息')">信息</NButton>
              </div>
            </div>
          </div>
        </NCard>
      </div>

      <!-- 模态框 (可拖拽) -->
      <NModal v-model="modalOpen" title="创建新项目" size="md" draggable>
        <div class="space-y-4">
          <p class="text-sm text-surface-500 mb-4">💡 提示：可以拖拽标题栏移动此窗口</p>
          <NInput v-model="projectName" label="项目名称" placeholder="请输入项目名称" />
          <NInput v-model="projectDesc" label="项目描述" placeholder="简要描述您的项目（可选）" />
        </div>
        <template #footer>
          <NButton variant="ghost" @click="modalOpen = false">取消</NButton>
          <NButton @click="handleCreateProject">创建</NButton>
        </template>
      </NModal>

      <!-- Toast -->
      <NToast v-if="showToast" :message="toastMessage" :type="toastType" @close="showToast = false" />
    </main>

    <!-- 页脚 -->
    <footer class="bg-white mt-12">
      <div class="max-w-7xl mx-auto px-6 py-8">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-2">
            <div class="h-6 w-6 rounded bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
              <span class="text-white font-bold text-xs">N</span>
            </div>
            <span class="text-sm text-surface-500">Vue 3 + TypeScript + UnoCSS</span>
          </div>
          <p class="text-sm text-surface-400">© 2026 Nexa UI</p>
        </div>
      </div>
    </footer>
  </div>
</template>
