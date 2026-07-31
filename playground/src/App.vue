<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '@enfyra/sdk-vue'
import AuthPanel from './panels/AuthPanel.vue'
import DataPanel from './panels/DataPanel.vue'
import StoragePanel from './panels/StoragePanel.vue'
import IntegrationsPanel from './panels/IntegrationsPanel.vue'
import ErrorsPanel from './panels/ErrorsPanel.vue'
import WebSocketPanel from './panels/WebSocketPanel.vue'

const tabs = [
  { id: 'auth', label: 'Auth' },
  { id: 'data', label: 'Data' },
  { id: 'storage', label: 'Storage' },
  { id: 'integrations', label: 'Fetch & Axios' },
  { id: 'errors', label: 'Errors' },
  { id: 'websocket', label: 'WebSocket' },
] as const

const active = ref<string>('auth')
const { user, isAuthenticated, pending } = useAuth()
</script>

<template>
  <div class="min-h-screen">
    <header class="sticky top-0 z-10 border-b border-border bg-surface/90 backdrop-blur-sm">
      <div class="mx-auto flex max-w-4xl items-center gap-4 px-6 py-3">
        <div class="flex items-center gap-2.5">
          <span class="grid size-7 place-items-center rounded-md bg-accent font-mono text-sm font-bold text-white">E</span>
          <div class="leading-tight">
            <span class="block text-sm font-semibold text-ink">SDK Playground</span>
            <span class="block font-mono text-[11px] text-ink/50">@enfyra/sdk-vue</span>
          </div>
        </div>
        <div class="ml-auto flex items-center gap-3">
          <span class="flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-[11px] font-medium">
            <span
              class="size-1.5 rounded-full"
              :class="pending ? 'animate-pulse-dot bg-warn' : isAuthenticated ? 'bg-accent' : 'bg-ink/25'"
            />
            {{ pending ? 'Checking…' : isAuthenticated ? user?.email : 'Anonymous' }}
          </span>
        </div>
      </div>
    </header>

    <main class="mx-auto max-w-4xl px-6 py-6">
      <nav class="mb-6 flex gap-1 rounded-lg border border-border bg-surface p-1 shadow-sm">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="rounded-md px-3.5 py-1.5 text-[13px] font-medium transition-all duration-150"
          :class="active === tab.id ? 'bg-ink text-white shadow-sm' : 'text-ink/60 hover:bg-canvas hover:text-ink'"
          @click="active = tab.id"
        >
          {{ tab.label }}
        </button>
      </nav>

      <div class="animate-fade-up rounded-xl border border-border bg-surface p-6 shadow-sm">
        <AuthPanel v-if="active === 'auth'" />
        <DataPanel v-else-if="active === 'data'" />
        <StoragePanel v-else-if="active === 'storage'" />
        <IntegrationsPanel v-else-if="active === 'integrations'" />
        <ErrorsPanel v-else-if="active === 'errors'" />
        <WebSocketPanel v-else-if="active === 'websocket'" />
      </div>
    </main>
  </div>
</template>
