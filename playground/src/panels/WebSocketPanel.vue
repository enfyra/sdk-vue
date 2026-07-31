<script setup lang="ts">
import { ref } from 'vue'
import { useWebSocket } from '@enfyra/sdk-vue'

const gateway = ref('chat')
const { connected, connecting, error, connect, disconnect, emit, on } = useWebSocket(gateway.value)
const log = ref<string[]>([])

const handleConnect = async () => {
  log.value = []
  try {
    await connect()
    log.value.push(`[${new Date().toLocaleTimeString()}] Connected`)
    on('message', (data) => {
      log.value.push(`[${new Date().toLocaleTimeString()}] message: ${JSON.stringify(data)}`)
    })
  } catch (e) {
    log.value.push(`Error: ${e instanceof Error ? e.message : String(e)}`)
  }
}

const handleEmit = () => {
  emit('message', { text: 'hello from vue playground', ts: Date.now() })
  log.value.push(`[${new Date().toLocaleTimeString()}] → emitted message`)
}
</script>

<template>
  <section>
    <div class="mb-5 flex items-center justify-between">
      <div>
        <h2 class="text-base font-semibold text-ink">WebSocket</h2>
        <p class="mt-0.5 text-xs text-ink/50">useWebSocket · Socket.IO with token auth</p>
      </div>
      <span class="flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-[11px] font-medium">
        <span class="size-1.5 rounded-full" :class="connected ? 'bg-accent' : connecting ? 'animate-pulse-dot bg-warn' : 'bg-ink/25'" />
        {{ connected ? 'Connected' : connecting ? 'Connecting' : 'Disconnected' }}
      </span>
    </div>

    <div class="mb-4 flex gap-2">
      <input v-model="gateway" placeholder="Gateway" :disabled="connected" class="w-36 rounded-md border border-border bg-surface px-3 py-2 font-mono text-[13px] text-ink outline-none placeholder:text-ink/30 focus:border-accent focus:ring-2 focus:ring-accent/15 disabled:opacity-50" />
      <template v-if="!connected">
        <button class="rounded-md bg-accent px-3.5 py-2 text-[13px] font-medium text-white shadow-sm transition-colors hover:bg-accent-hover disabled:opacity-50" :disabled="connecting" @click="handleConnect">
          {{ connecting ? 'Connecting…' : 'Connect' }}
        </button>
      </template>
      <template v-else>
        <button class="rounded-md border border-border px-3.5 py-2 text-[13px] font-medium text-ink/70 transition-colors hover:bg-canvas" @click="handleEmit">Emit test</button>
        <button class="rounded-md border border-danger/30 px-3.5 py-2 text-[13px] font-medium text-danger transition-colors hover:bg-danger/5" @click="disconnect">Disconnect</button>
      </template>
    </div>

    <p v-if="error" class="mb-3 rounded-md border border-danger/20 bg-danger/5 px-3 py-2 text-xs text-danger">{{ error.message }}</p>

    <div v-if="log.length" class="rounded-lg bg-ink p-3">
      <div class="mb-2 flex items-center justify-between">
        <span class="font-mono text-[10px] uppercase tracking-wider text-white/40">Event log</span>
        <button class="font-mono text-[10px] text-white/40 transition-colors hover:text-white/70" @click="log = []">clear</button>
      </div>
      <pre class="max-h-56 overflow-auto font-mono text-[11px] leading-relaxed text-emerald-200/90">{{ log.join('\n') }}</pre>
    </div>
  </section>
</template>
