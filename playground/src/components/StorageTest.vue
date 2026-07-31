<script setup lang="ts">
import { ref } from 'vue'
import { useStorage } from '@enfyra/sdk-vue'

const { uploading, upload, getDownloadUrl, download, getFolderTree } = useStorage()

const selectedFile = ref<File | null>(null)
const uploadResult = ref<any>(null)
const downloadResult = ref<any>(null)
const folderTree = ref<any>(null)
const fileIdInput = ref('')

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  selectedFile.value = input.files?.[0] || null
}

const handleUpload = async () => {
  if (!selectedFile.value) return
  try {
    uploadResult.value = await upload(selectedFile.value)
  } catch (e: any) {
    uploadResult.value = { error: e.message }
  }
}

const handleGetUrl = async () => {
  if (!fileIdInput.value) return
  try {
    const url = getDownloadUrl(fileIdInput.value)
    downloadResult.value = { url }
  } catch (e: any) {
    downloadResult.value = { error: e.message }
  }
}

const handleDownload = async () => {
  if (!fileIdInput.value) return
  try {
    const blob = await download(fileIdInput.value)
    downloadResult.value = {
      success: true,
      size: blob.size,
      type: blob.type,
    }
  } catch (e: any) {
    downloadResult.value = { error: e.message }
  }
}

const handleGetFolderTree = async () => {
  try {
    folderTree.value = await getFolderTree()
  } catch (e: any) {
    folderTree.value = { error: e.message }
  }
}

</script>

<template>
  <div>
    <h2 class="text-2xl font-bold text-white mb-2">File Storage</h2>
    <p class="text-slate-400 mb-8">Test file upload, download, and folder management</p>

    <div class="grid lg:grid-cols-2 gap-8">
      <!-- Upload -->
      <div class="space-y-6">
        <div class="bg-white/5 rounded-2xl border border-white/10 p-6">
          <h3 class="text-lg font-semibold text-white mb-4">Upload File</h3>

          <div class="mb-4">
            <label class="block text-sm font-medium text-slate-300 mb-2">Select File</label>
            <input
              type="file"
              @change="handleFileChange"
              class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-500 file:text-white hover:file:bg-primary-600 transition-all"
            />
          </div>

          <div v-if="selectedFile" class="mb-4 p-4 bg-white/5 rounded-xl border border-white/10">
            <p class="text-sm text-slate-300">
              <span class="text-slate-500">File:</span> {{ selectedFile.name }}
            </p>
            <p class="text-sm text-slate-300">
              <span class="text-slate-500">Size:</span> {{ (selectedFile.size / 1024).toFixed(2) }} KB
            </p>
            <p class="text-sm text-slate-300">
              <span class="text-slate-500">Type:</span> {{ selectedFile.type || 'Unknown' }}
            </p>
          </div>

          <button
            @click="handleUpload"
            :disabled="!selectedFile || uploading"
            class="w-full py-3 px-4 bg-gradient-to-r from-primary-500 to-purple-600 hover:from-primary-600 hover:to-purple-700 text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-500/25"
          >
            {{ uploading ? 'Uploading...' : 'Upload' }}
          </button>

          <!-- Result -->
          <div v-if="uploadResult && !uploadResult.error" class="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
            <p class="text-sm text-green-400 font-medium mb-2">✓ Upload Successful</p>
            <pre class="text-xs text-green-300 overflow-auto max-h-32 font-mono">{{ JSON.stringify(uploadResult, null, 2) }}</pre>
          </div>
          <div v-if="uploadResult?.error" class="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
            <p class="text-sm text-red-400 font-medium">✗ {{ uploadResult.error }}</p>
          </div>
        </div>

        <!-- Download by ID -->
        <div class="bg-white/5 rounded-2xl border border-white/10 p-6">
          <h3 class="text-lg font-semibold text-white mb-4">Download File</h3>

          <div class="mb-4">
            <label class="block text-sm font-medium text-slate-300 mb-2">File ID</label>
            <input
              v-model="fileIdInput"
              type="text"
              placeholder="123"
              class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <button
              @click="handleGetUrl"
              :disabled="!fileIdInput"
              class="py-3 px-4 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 font-medium rounded-xl transition-all disabled:opacity-50"
            >
              Get URL
            </button>
            <button
              @click="handleDownload"
              :disabled="!fileIdInput"
              class="py-3 px-4 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 text-green-400 font-medium rounded-xl transition-all disabled:opacity-50"
            >
              Download
            </button>
          </div>

          <!-- Download Result -->
          <div v-if="downloadResult" class="mt-4 p-4 bg-slate-500/10 border border-slate-500/20 rounded-xl">
            <pre class="text-xs text-slate-300 overflow-auto max-h-32 font-mono">{{ JSON.stringify(downloadResult, null, 2) }}</pre>
          </div>
        </div>
      </div>

      <!-- Folder Tree & Status -->
      <div class="space-y-6">
        <div class="bg-white/5 rounded-2xl border border-white/10 p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-white">Folder Tree</h3>
            <button
              @click="handleGetFolderTree"
              class="text-sm text-primary-400 hover:text-primary-300 transition-colors"
            >
              ↻ Refresh
            </button>
          </div>

          <div v-if="folderTree" class="space-y-2">
            <div v-if="folderTree.error" class="text-red-400 text-sm">
              {{ folderTree.error }}
            </div>
            <pre v-else class="text-xs text-slate-300 overflow-auto max-h-64 font-mono">{{ JSON.stringify(folderTree, null, 2) }}</pre>
          </div>
          <p v-else class="text-slate-500 text-sm text-center py-8">
            Click "Refresh" to load folder structure
          </p>
        </div>

        <!-- Status -->
        <div class="bg-white/5 rounded-2xl border border-white/10 p-6">
          <h3 class="text-lg font-semibold text-white mb-4">Status</h3>
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-slate-300">Uploading</span>
              <span :class="['px-3 py-1 rounded-full text-xs font-medium', uploading ? 'bg-primary-500/20 text-primary-400' : 'bg-slate-500/20 text-slate-400']">
                {{ uploading ? 'Yes' : 'No' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
