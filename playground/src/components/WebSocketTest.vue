<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useWebSocket } from '@enfyra/sdk-vue'

const gateway = ref('/chat')
const { connected, connecting, error, connect, disconnect, emit, on } = useWebSocket(gateway.value)

const messages = ref<Array<{ type: string; data: any; time: string }>>([])
const eventName = ref('message')
const eventData = ref('{ "text": "Hello" }')
const subscribed = ref(false)

const addLog = (type: string, data: any) => {
  messages.value.unshift({
    type,
    data,
    time: new Date().toLocaleTimeString(),
  })
  if (messages.value.length > 50) {
    messages.value.pop()
  }
}

// Subscribe to events after connection is established
watch(connected, (isConnected) => {
  if (isConnected && !subscribed.value) {
    on('message', (data) => {
      addLog('message', data)
    })
    subscribed.value = true
    addLog('info', { message: 'Connected and subscribed to events' })
  }
  if (!isConnected) {
    subscribed.value = false
  }
})

const handleConnect = () => {
  try {
    connect()
  } catch (e: any) {
    addLog('error', { message: e.message })
  }
}

const handleDisconnect = () => {
  disconnect()
  addLog('event', { event: 'manual_disconnect', message: 'Disconnected by user' })
}

const handleEmit = () => {
  try {
    const data = JSON.parse(eventData.value)
    emit(eventName.value, data)
    addLog('sent', { event: eventName.value, data })
  } catch (e: any) {
    addLog('error', { message: 'Invalid JSON: ' + e.message })
  }
}

const clearLogs = () => {
  messages.value = []
}
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold text-white mb-2">WebSocket</h2>
    <p class="text-slate-400 mb-8">Test real-time bidirectional communication</p>

    <div class="grid lg:grid-cols-3 gap-6">
      <!-- Connection Controls -->
      <div class="space-y-4">
        <div class="bg-white/5 rounded-2xl border border-white/10 p-6">
          <h3 class="text-lg font-semibold text-white mb-4">Connection</h3>

          <div class="mb-4">
            <label class="block text-sm font-medium text-slate-300 mb-2">Gateway</label>
            <input
              v-model="gateway"
              type="text"
              placeholder="/chat"
              class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <button
              @click="handleConnect"
              :disabled="connected || connecting"
              class="py-3 px-4 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 text-green-400 font-medium rounded-xl transition-all disabled:opacity-50"
            >
              {{ connecting ? 'Connecting...' : 'Connect' }}
            </button>
            <button
              @click="handleDisconnect"
              :disabled="!connected"
              class="py-3 px-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-medium rounded-xl transition-all disabled:opacity-50"
            >
              Disconnect
            </button>
          </div>

          <!-- Connection Status -->
          <div class="mt-4 flex items-center gap-3">
            <div :class="['w-3 h-3 rounded-full', connected ? 'bg-green-500 animate-pulse' : connecting ? 'bg-yellow-500' : 'bg-slate-500']"></div>
            <span class="text-sm" :class="connected ? 'text-green-400' : connecting ? 'text-yellow-400' : 'text-slate-400'">
              {{ connected ? 'Connected' : connecting ? 'Connecting...' : 'Disconnected' }}
            </span>
          </div>

          <p v-if="error" class="mt-3 text-sm text-red-400 bg-red-500/10 py-2 px-3 rounded-lg border border-red-500/20">
            {{ error.message }}
          </p>
        </div>

        <!-- Emit Event -->
        <div class="bg-white/5 rounded-2xl border border-white/10 p-6">
          <h3 class="text-lg font-semibold text-white mb-4">Emit Event</h3>

          <div class="mb-4">
            <label class="block text-sm font-medium text-slate-300 mb-2">Event Name</label>
            <input
              v-model="eventName"
              type="text"
              placeholder="message"
              class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-slate-300 mb-2">Event Data (JSON)</label>
            <textarea
              v-model="eventData"
              rows="4"
              class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
            />
          </div>

          <button
            @click="handleEmit"
            :disabled="!connected"
            class="w-full py-3 px-4 bg-gradient-to-r from-primary-500 to-purple-600 hover:from-primary-600 hover:to-purple-700 text-white font-medium rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-primary-500/25"
          >
            Emit Event
          </button>
        </div>
      </div>

      <!-- Event Log -->
      <div class="lg:col-span-2">
        <div class="bg-white/5 rounded-2xl border border-white/10 p-6 h-[500px] flex flex-col">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-white">Event Log</h3>
            <button
              @click="clearLogs"
              class="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Clear
            </button>
          </div>

          <div class="flex-1 overflow-auto space-y-2 min-h-0">
            <div
              v-for="(msg, index) in messages"
              :key="index"
              :class="[
                'p-3 rounded-lg text-sm font-mono',
                msg.type === 'message' ? 'bg-blue-500/10 border border-blue-500/20 text-blue-300' :
                msg.type === 'sent' ? 'bg-green-500/10 border border-green-500/20 text-green-300' :
                msg.type === 'error' ? 'bg-red-500/10 border border-red-500/20 text-red-300' :
                msg.type === 'event' ? 'bg-purple-500/10 border border-purple-500/20 text-purple-300' :
                'bg-slate-500/10 border border-slate-500/20 text-slate-300'
              ]"
            >
              <div class="flex items-center justify-between gap-4 mb-1">
                <span class="text-xs opacity-60">{{ msg.time }}</span>
                <span class="text-xs font-semibold uppercase">{{ msg.type }}</span>
              </div>
              <pre class="whitespace-pre-wrap">{{ JSON.stringify(msg.data, null, 2) }}</pre>
            </div>

            <p v-if="messages.length === 0" class="text-slate-500 text-sm text-center py-12">
              No events yet. Connect and emit events to see them here.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
