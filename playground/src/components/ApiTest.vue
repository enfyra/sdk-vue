<script setup lang="ts">
import { ref } from 'vue'
import { useEnfyra } from '@enfyra/sdk-vue'

const { client } = useEnfyra()

const activeMethod = ref<'GET' | 'POST' | 'PATCH' | 'DELETE'>('GET')

// GET request
const getPath = ref('/post')
const getFilter = ref('')
const getData = ref<any>(null)
const getLoading = ref(false)
const getError = ref<string | null>(null)

// POST request
const postPath = ref('/post')
const postBody = ref('{\n  "title": "New Post",\n  "content": "Hello World"\n}')
const postData = ref<any>(null)
const postLoading = ref(false)
const postError = ref<string | null>(null)

// PATCH request
const patchPath = ref('/post/1')
const patchBody = ref('{\n  "title": "Updated Title"\n}')
const patchData = ref<any>(null)
const patchLoading = ref(false)
const patchError = ref<string | null>(null)

// DELETE request
const deletePath = ref('/post/1')
const deleteData = ref<any>(null)
const deleteLoading = ref(false)
const deleteError = ref<string | null>(null)

const responseData = ref<any>(null)
const responseError = ref<string | null>(null)

const executeGet = async () => {
  getLoading.value = true
  getError.value = null
  try {
    const query: any = {}
    if (getFilter.value) {
      query.filter = getFilter.value
    }
    const response = await client.get(getPath.value, { query })
    getData.value = response.data
  } catch (e: any) {
    getError.value = e.message || 'Request failed'
  } finally {
    getLoading.value = false
  }
}

const executePost = async () => {
  postLoading.value = true
  postError.value = null
  try {
    const body = JSON.parse(postBody.value)
    const response = await client.post(postPath.value, body)
    postData.value = response.data
  } catch (e: any) {
    postError.value = e.message || 'Request failed'
  } finally {
    postLoading.value = false
  }
}

const executePatch = async () => {
  patchLoading.value = true
  patchError.value = null
  try {
    const body = JSON.parse(patchBody.value)
    const response = await client.patch(patchPath.value, body)
    patchData.value = response.data
  } catch (e: any) {
    patchError.value = e.message || 'Request failed'
  } finally {
    patchLoading.value = false
  }
}

const executeDelete = async () => {
  deleteLoading.value = true
  deleteError.value = null
  try {
    const response = await client.delete(deletePath.value)
    deleteData.value = response.data
  } catch (e: any) {
    deleteError.value = e.message || 'Request failed'
  } finally {
    deleteLoading.value = false
  }
}

const isLoading = () => getLoading.value || postLoading.value || patchLoading.value || deleteLoading.value

const currentData = () => {
  if (activeMethod.value === 'GET') return getData.value
  if (activeMethod.value === 'POST') return postData.value
  if (activeMethod.value === 'PATCH') return patchData.value
  if (activeMethod.value === 'DELETE') return deleteData.value
  return null
}

const currentError = () => {
  if (activeMethod.value === 'GET') return getError.value
  if (activeMethod.value === 'POST') return postError.value
  if (activeMethod.value === 'PATCH') return patchError.value
  if (activeMethod.value === 'DELETE') return deleteError.value
  return null
}
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold text-white mb-2">API Requests</h2>
    <p class="text-slate-400 mb-8">Test GET, POST, PATCH, DELETE operations</p>

    <!-- Method Tabs -->
    <div class="flex gap-2 mb-6">
      <button
        v-for="method in ['GET', 'POST', 'PATCH', 'DELETE']"
        :key="method"
        @click="activeMethod = method as any"
        :class="[
          'px-4 py-2 rounded-lg text-sm font-medium transition-all',
          activeMethod === method
            ? 'bg-primary-500 text-white'
            : 'bg-white/5 text-slate-400 hover:text-white'
        ]"
      >
        {{ method }}
      </button>
    </div>

    <div class="grid lg:grid-cols-2 gap-8">
      <!-- Request -->
      <div class="space-y-4">
        <!-- GET -->
        <div v-if="activeMethod === 'GET'" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Path</label>
            <input
              v-model="getPath"
              type="text"
              class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="/post"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Filter (JSON)</label>
            <textarea
              v-model="getFilter"
              rows="3"
              class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
              placeholder='{"status": {"_eq": "published"}}'
            />
          </div>
          <button
            @click="executeGet"
            :disabled="getLoading"
            class="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-green-500/25"
          >
            {{ getLoading ? 'Fetching...' : 'Send GET Request' }}
          </button>
        </div>

        <!-- POST -->
        <div v-else-if="activeMethod === 'POST'" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Path</label>
            <input
              v-model="postPath"
              type="text"
              class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="/post"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Body (JSON)</label>
            <textarea
              v-model="postBody"
              rows="5"
              class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
            />
          </div>
          <button
            @click="executePost"
            :disabled="postLoading"
            class="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-medium rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-blue-500/25"
          >
            {{ postLoading ? 'Creating...' : 'Send POST Request' }}
          </button>
        </div>

        <!-- PATCH -->
        <div v-else-if="activeMethod === 'PATCH'" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Path</label>
            <input
              v-model="patchPath"
              type="text"
              class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="/post/1"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Body (JSON)</label>
            <textarea
              v-model="patchBody"
              rows="5"
              class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
            />
          </div>
          <button
            @click="executePatch"
            :disabled="patchLoading"
            class="w-full py-3 px-4 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-medium rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-yellow-500/25"
          >
            {{ patchLoading ? 'Updating...' : 'Send PATCH Request' }}
          </button>
        </div>

        <!-- DELETE -->
        <div v-else-if="activeMethod === 'DELETE'" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Path</label>
            <input
              v-model="deletePath"
              type="text"
              class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="/post/1"
            />
          </div>
          <button
            @click="executeDelete"
            :disabled="deleteLoading"
            class="w-full py-3 px-4 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-medium rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-red-500/25"
          >
            {{ deleteLoading ? 'Deleting...' : 'Send DELETE Request' }}
          </button>
        </div>
      </div>

      <!-- Response -->
      <div class="space-y-4">
        <div class="bg-black/30 rounded-2xl border border-white/10 p-6 min-h-[300px]">
          <h4 class="text-sm font-medium text-slate-400 mb-4">Response</h4>

          <div v-if="isLoading()" class="flex items-center justify-center h-48">
            <div class="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          </div>

          <p v-if="currentError()" class="text-red-400 text-sm bg-red-500/10 py-3 px-4 rounded-lg border border-red-500/20 mb-4">
            {{ currentError() }}
          </p>

          <pre v-if="currentData()" :class="[
            'text-xs overflow-auto max-h-64 font-mono',
            activeMethod === 'GET' ? 'text-green-400' :
            activeMethod === 'POST' ? 'text-blue-400' :
            activeMethod === 'PATCH' ? 'text-yellow-400' : 'text-red-400'
          ]">{{ JSON.stringify(currentData(), null, 2) }}</pre>

          <p v-if="!currentData() && !currentError() && !isLoading()" class="text-slate-500 text-sm text-center py-12">
            No response yet. Send a request to see the response.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
