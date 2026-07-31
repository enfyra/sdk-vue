<script setup lang="ts">
import { ref } from 'vue'
import { useStorage } from '@enfyra/sdk-vue'

const { uploading, upload, download, getDownloadUrl, getFolderTree } = useStorage()
const result = ref('')
const downloadUrl = ref('')
const fileInput = ref<HTMLInputElement | null>(null)

const handleUpload = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  result.value = ''
  const record = await upload(file)
  if (record) {
    result.value = JSON.stringify(record, null, 2)
    downloadUrl.value = getDownloadUrl(record.id)
  } else {
    result.value = 'Upload failed'
  }
}

const handleDownload = async () => {
  const id = downloadUrl.value.split('/').pop()
  if (!id) return
  const blob = await download(id)
  result.value = blob ? `Downloaded blob: ${blob.size} bytes (${blob.type || 'unknown type'})` : 'Download failed'
}

const loadTree = async () => {
  result.value = ''
  downloadUrl.value = ''
  const tree = await getFolderTree()
  result.value = tree ? JSON.stringify(tree, null, 2) : 'Failed to load folder tree'
}
</script>

<template>
  <section>
    <div class="mb-5">
      <h2 class="text-base font-semibold text-ink">Storage</h2>
      <p class="mt-0.5 text-xs text-ink/50">useStorage · upload / download / folder tree</p>
    </div>

    <div class="mb-4 flex flex-wrap items-center gap-2">
      <input ref="fileInput" type="file" class="hidden" @change="handleUpload" />
      <button class="rounded-md bg-accent px-3.5 py-2 text-[13px] font-medium text-white shadow-sm transition-colors hover:bg-accent-hover disabled:opacity-50" :disabled="uploading" @click="fileInput?.click()">
        {{ uploading ? 'Uploading…' : 'Upload file' }}
      </button>
      <button class="rounded-md border border-border px-3.5 py-2 text-[13px] font-medium text-ink/70 transition-colors hover:bg-canvas" @click="loadTree">Load folder tree</button>
      <span v-if="uploading" class="flex items-center gap-1.5 text-xs text-ink/50">
        <span class="size-1.5 animate-pulse-dot rounded-full bg-accent" />
        Uploading…
      </span>
    </div>

    <div v-if="downloadUrl" class="mb-3 flex items-center gap-2 rounded-lg border border-accent/20 bg-accent/5 px-3 py-2">
      <code class="flex-1 truncate font-mono text-[11px] text-ink/70">{{ downloadUrl }}</code>
      <button class="shrink-0 rounded border border-border px-2 py-1 text-[11px] font-medium text-ink/60 transition-colors hover:bg-canvas" @click="handleDownload">Download</button>
    </div>

    <pre v-if="result" class="max-h-72 overflow-auto rounded-lg bg-ink p-3 font-mono text-[11px] leading-relaxed text-emerald-200/90">{{ result }}</pre>
  </section>
</template>
