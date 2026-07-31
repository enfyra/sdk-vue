<script setup lang="ts">
import { ref } from 'vue'
import { useEnfyra } from '@enfyra/sdk-vue'
import axios from 'axios'

const client = useEnfyra()
const fetchResult = ref('')
const axiosResult = ref('')
const fetchPending = ref(false)
const axiosPending = ref(false)

const runFetch = async () => {
  fetchPending.value = true
  fetchResult.value = ''
  try {
    const response = await client.fetch('/me')
    const body = await response.json()
    fetchResult.value = `HTTP ${response.status}\n${JSON.stringify(body, null, 2)}`
  } catch (err) {
    fetchResult.value = err instanceof Error ? err.message : 'Fetch failed'
  } finally {
    fetchPending.value = false
  }
}

const runAxios = async () => {
  axiosPending.value = true
  axiosResult.value = ''
  try {
    const api = axios.create({ baseURL: client.getHttpClient().baseUrl })
    client.attachAxios(api)
    const { data, status } = await api.get('/me')
    axiosResult.value = `HTTP ${status}\n${JSON.stringify(data, null, 2)}`
    client.dispose()
  } catch (err) {
    axiosResult.value = err instanceof Error ? err.message : 'Axios failed'
  } finally {
    axiosPending.value = false
  }
}
</script>

<template>
  <section>
    <div class="mb-5">
      <h2 class="text-base font-semibold text-ink">Fetch & Axios</h2>
      <p class="mt-0.5 text-xs text-ink/50">Raw integrations through the core client</p>
    </div>

    <div class="grid gap-4 sm:grid-cols-2">
      <div class="rounded-lg border border-border p-4">
        <h3 class="mb-1 font-mono text-[13px] font-semibold text-ink">enfyra.fetch('/me')</h3>
        <p class="mb-3 text-[11px] text-ink/50">Native fetch with auto auth injection and 401 retry.</p>
        <button class="rounded-md bg-accent px-3.5 py-2 text-[13px] font-medium text-white shadow-sm transition-colors hover:bg-accent-hover disabled:opacity-50" :disabled="fetchPending" @click="runFetch">
          {{ fetchPending ? 'Running…' : 'Run fetch' }}
        </button>
        <pre v-if="fetchResult" class="mt-3 max-h-48 overflow-auto rounded-md bg-ink p-3 font-mono text-[11px] leading-relaxed text-emerald-200/90">{{ fetchResult }}</pre>
      </div>

      <div class="rounded-lg border border-border p-4">
        <h3 class="mb-1 font-mono text-[13px] font-semibold text-ink">attachAxios()</h3>
        <p class="mb-3 text-[11px] text-ink/50">Axios interceptors for auth and token refresh.</p>
        <button class="rounded-md bg-accent px-3.5 py-2 text-[13px] font-medium text-white shadow-sm transition-colors hover:bg-accent-hover disabled:opacity-50" :disabled="axiosPending" @click="runAxios">
          {{ axiosPending ? 'Running…' : 'Run axios' }}
        </button>
        <pre v-if="axiosResult" class="mt-3 max-h-48 overflow-auto rounded-md bg-ink p-3 font-mono text-[11px] leading-relaxed text-emerald-200/90">{{ axiosResult }}</pre>
      </div>
    </div>
  </section>
</template>
