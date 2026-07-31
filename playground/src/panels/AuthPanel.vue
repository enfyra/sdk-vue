<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '@enfyra/sdk-vue'

const { user, isAuthenticated, pending, status, error, login, logout, refresh } = useAuth()
const email = ref('')
const password = ref('')

const handleLogin = async () => {
  await login({ email: email.value, password: password.value })
}
</script>

<template>
  <section>
    <div class="mb-5 flex items-center justify-between">
      <div>
        <h2 class="text-base font-semibold text-ink">Authentication</h2>
        <p class="mt-0.5 text-xs text-ink/50">Token strategy · shared singleton refs across all components</p>
      </div>
      <span class="rounded-md bg-canvas px-2 py-1 font-mono text-[11px] text-ink/60">
        status: {{ status ?? 'null' }}
      </span>
    </div>

    <div v-if="isAuthenticated" class="animate-fade-up">
      <div class="mb-4 rounded-lg border border-accent/20 bg-accent/5 p-4">
        <p class="text-sm font-medium text-ink">{{ user?.email }}</p>
        <p class="mt-0.5 font-mono text-[11px] text-ink/50">id: {{ user?.id }}</p>
      </div>
      <div class="flex gap-2">
        <button
          class="rounded-md border border-danger/30 px-3.5 py-1.5 text-[13px] font-medium text-danger transition-colors hover:bg-danger/5"
          @click="logout()"
        >
          Logout
        </button>
        <button
          class="rounded-md border border-border px-3.5 py-1.5 text-[13px] font-medium text-ink/70 transition-colors hover:bg-canvas disabled:opacity-50"
          :disabled="pending"
          @click="refresh()"
        >
          Refresh user
        </button>
      </div>
    </div>

    <form v-else class="flex max-w-sm flex-col gap-3" @submit.prevent="handleLogin">
      <label class="block">
        <span class="mb-1 block text-xs font-medium text-ink/60">Email</span>
        <input
          v-model="email"
          type="email"
          placeholder="you@example.com"
          class="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-ink outline-none transition-shadow placeholder:text-ink/30 focus:border-accent focus:ring-2 focus:ring-accent/15"
        />
      </label>
      <label class="block">
        <span class="mb-1 block text-xs font-medium text-ink/60">Password</span>
        <input
          v-model="password"
          type="password"
          placeholder="••••••••"
          class="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-ink outline-none transition-shadow placeholder:text-ink/30 focus:border-accent focus:ring-2 focus:ring-accent/15"
        />
      </label>
      <button
        type="submit"
        :disabled="pending || !email || !password"
        class="mt-1 rounded-md bg-accent px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-accent-hover disabled:opacity-50"
      >
        {{ pending ? 'Signing in…' : 'Sign in' }}
      </button>
      <p v-if="error" class="animate-fade-up rounded-md border border-danger/20 bg-danger/5 px-3 py-2 text-xs text-danger">
        {{ error.message }}
      </p>
    </form>
  </section>
</template>
