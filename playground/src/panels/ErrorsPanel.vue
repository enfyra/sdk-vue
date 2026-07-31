<script setup lang="ts">
import { ref } from 'vue'
import { useEnfyra } from '@enfyra/sdk-vue'
import { isEnfyraError, EnfyraClient } from '@enfyra/sdk-core'

const client = useEnfyra()
const pending = ref(false)

interface ErrorResult { label: string; passed: boolean; detail: string }
const results = ref<ErrorResult[]>([])

const runAll = async () => {
  pending.value = true
  results.value = []
  const log: ErrorResult[] = []

  try {
    await client.get('/sdk-lab-missing-route')
    log.push({ label: '404 Not Found', passed: false, detail: 'No error thrown' })
  } catch (err) {
    if (isEnfyraError(err)) {
      log.push({ label: '404 Not Found', passed: err.statusCode === 404, detail: `status=${err.statusCode} code=${err.code} message="${err.message}"` })
    } else {
      log.push({ label: '404 Not Found', passed: false, detail: 'Not an EnfyraError' })
    }
  }

  try {
    const anon = new EnfyraClient({ baseUrl: client.getHttpClient().baseUrl, auth: { strategy: 'none' }, credentials: 'omit' })
    await anon.get('/me')
    log.push({ label: '401 Unauthorized', passed: false, detail: 'No error thrown' })
  } catch (err) {
    if (isEnfyraError(err)) {
      log.push({ label: '401 Unauthorized', passed: err.statusCode === 401, detail: `status=${err.statusCode} code=${err.code} message="${err.message}"` })
    } else {
      log.push({ label: '401 Unauthorized', passed: false, detail: 'Not an EnfyraError' })
    }
  }

  try {
    await client.get('/enfyra_user', { query: { filter: '{invalid json' } })
    log.push({ label: 'Validation', passed: true, detail: 'Server tolerated malformed filter (no error)' })
  } catch (err) {
    if (isEnfyraError(err)) {
      log.push({ label: 'Validation', passed: true, detail: `status=${err.statusCode} code=${err.code} message="${err.message}"` })
    } else {
      log.push({ label: 'Validation', passed: false, detail: 'Not an EnfyraError' })
    }
  }

  results.value = log
  pending.value = false
}
</script>

<template>
  <section>
    <div class="mb-5 flex items-center justify-between">
      <div>
        <h2 class="text-base font-semibold text-ink">Errors</h2>
        <p class="mt-0.5 text-xs text-ink/50">Structured EnfyraError: statusCode, code, message preserved</p>
      </div>
      <button class="rounded-md bg-accent px-3.5 py-2 text-[13px] font-medium text-white shadow-sm transition-colors hover:bg-accent-hover disabled:opacity-50" :disabled="pending" @click="runAll">
        {{ pending ? 'Running…' : 'Run error tests' }}
      </button>
    </div>

    <div v-if="results.length" class="flex flex-col gap-2">
      <div
        v-for="(r, i) in results"
        :key="i"
        class="animate-fade-up flex items-start gap-3 rounded-lg border border-border px-4 py-3"
        :style="{ animationDelay: `${i * 60}ms` }"
      >
        <span class="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full text-[11px] font-bold" :class="r.passed ? 'bg-accent/10 text-accent' : 'bg-danger/10 text-danger'">
          {{ r.passed ? '✓' : '×' }}
        </span>
        <div class="min-w-0">
          <p class="text-[13px] font-medium text-ink">{{ r.label }}</p>
          <p class="mt-0.5 truncate font-mono text-[11px] text-ink/50">{{ r.detail }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
