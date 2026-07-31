<script setup lang="ts">
import { ref } from 'vue'
import { useQuery, useMutation } from '@enfyra/sdk-vue'

const collection = ref('enfyra_user')
const runId = ref(0)
const newTitle = ref('')
const editId = ref('')
const editTitle = ref('')
const deleteId = ref('')

const query = useQuery(collection.value, { limit: 5, meta: ['filterCount', 'totalCount'], immediate: false })
const insert = useMutation(collection.value, { operation: 'insert' })
const update = useMutation(collection.value, { operation: 'update' })
const remove = useMutation(collection.value, { operation: 'delete' })

const runQuery = () => { runId.value++; query.refresh() }
const runInsert = async () => { await insert.execute({ data: { title: newTitle.value } }); newTitle.value = ''; query.refresh() }
const runUpdate = async () => { await update.execute({ id: editId.value, data: { title: editTitle.value } }); query.refresh() }
const runDelete = async () => { await remove.execute({ id: deleteId.value }); deleteId.value = ''; query.refresh() }
</script>

<template>
  <section>
    <div class="mb-5 flex items-center justify-between">
      <div>
        <h2 class="text-base font-semibold text-ink">Data</h2>
        <p class="mt-0.5 text-xs text-ink/50">useQuery + useMutation · insert / update / delete / batch</p>
      </div>
      <span class="rounded-md bg-canvas px-2 py-1 font-mono text-[11px] text-ink/60">{{ query.status.value ?? 'idle' }}</span>
    </div>

    <div class="mb-3 flex gap-2">
      <input v-model="collection" placeholder="Collection name" class="w-full flex-1 rounded-md border border-border bg-surface px-3 py-2 font-mono text-[13px] text-ink outline-none placeholder:text-ink/30 focus:border-accent focus:ring-2 focus:ring-accent/15" />
      <button class="rounded-md bg-accent px-3.5 py-2 text-[13px] font-medium text-white shadow-sm transition-colors hover:bg-accent-hover disabled:opacity-50" :disabled="query.pending.value" @click="runQuery">
        {{ query.pending.value ? 'Querying…' : 'Query (limit 5)' }}
      </button>
    </div>

    <p v-if="query.meta.value" class="mb-2 font-mono text-[11px] text-ink/50">
      filterCount: {{ query.meta.value.filterCount ?? '—' }} · totalCount: {{ query.meta.value.totalCount ?? '—' }}
    </p>
    <p v-if="query.error.value" class="mb-2 rounded-md border border-danger/20 bg-danger/5 px-3 py-2 text-xs text-danger">{{ query.error.value.message }}</p>
    <pre v-if="query.data.value" class="mb-4 max-h-56 overflow-auto rounded-lg bg-ink p-3 font-mono text-[11px] leading-relaxed text-emerald-200/90">{{ JSON.stringify(query.data.value, null, 2) }}</pre>

    <div class="grid gap-4 border-t border-border pt-4 sm:grid-cols-3">
      <div>
        <h3 class="mb-2 text-xs font-semibold uppercase tracking-wide text-ink/50">Insert</h3>
        <input v-model="newTitle" placeholder="Title" class="mb-2 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-ink outline-none placeholder:text-ink/30 focus:border-accent focus:ring-2 focus:ring-accent/15" />
        <button class="w-full rounded-md bg-accent px-3.5 py-2 text-[13px] font-medium text-white shadow-sm transition-colors hover:bg-accent-hover disabled:opacity-50" :disabled="insert.pending.value || !newTitle.trim()" @click="runInsert">
          {{ insert.pending.value ? 'Inserting…' : 'Insert' }}
        </button>
        <p v-if="insert.error.value" class="mt-1.5 text-[11px] text-danger">{{ insert.error.value.message }}</p>
        <p v-if="insert.status.value === 'success'" class="mt-1.5 text-[11px] text-accent">Created ✓</p>
      </div>
      <div>
        <h3 class="mb-2 text-xs font-semibold uppercase tracking-wide text-ink/50">Update</h3>
        <input v-model="editId" placeholder="ID" class="mb-2 w-full rounded-md border border-border bg-surface px-3 py-2 font-mono text-[13px] text-ink outline-none placeholder:text-ink/30 focus:border-accent focus:ring-2 focus:ring-accent/15" />
        <input v-model="editTitle" placeholder="New title" class="mb-2 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-ink outline-none placeholder:text-ink/30 focus:border-accent focus:ring-2 focus:ring-accent/15" />
        <button class="w-full rounded-md border border-border px-3.5 py-2 text-[13px] font-medium text-ink/70 transition-colors hover:bg-canvas disabled:opacity-50" :disabled="update.pending.value || !editId || !editTitle.trim()" @click="runUpdate">
          {{ update.pending.value ? 'Updating…' : 'Update' }}
        </button>
        <p v-if="update.error.value" class="mt-1.5 text-[11px] text-danger">{{ update.error.value.message }}</p>
        <p v-if="update.status.value === 'success'" class="mt-1.5 text-[11px] text-accent">Updated ✓</p>
      </div>
      <div>
        <h3 class="mb-2 text-xs font-semibold uppercase tracking-wide text-ink/50">Delete</h3>
        <input v-model="deleteId" placeholder="ID" class="mb-2 w-full rounded-md border border-border bg-surface px-3 py-2 font-mono text-[13px] text-ink outline-none placeholder:text-ink/30 focus:border-accent focus:ring-2 focus:ring-accent/15" />
        <button class="w-full rounded-md border border-danger/30 px-3.5 py-2 text-[13px] font-medium text-danger transition-colors hover:bg-danger/5 disabled:opacity-50" :disabled="remove.pending.value || !deleteId" @click="runDelete">
          {{ remove.pending.value ? 'Deleting…' : 'Delete' }}
        </button>
        <p v-if="remove.error.value" class="mt-1.5 text-[11px] text-danger">{{ remove.error.value.message }}</p>
        <p v-if="remove.status.value === 'success'" class="mt-1.5 text-[11px] text-accent">Deleted ✓</p>
      </div>
    </div>
  </section>
</template>
