# @enfyra/sdk-vue

CSR-only Vue 3 composables for `@enfyra/sdk-core`.

Use [`@enfyra/nuxt`](../nuxt/README.md) for Nuxt or any server-rendered Vue application. This package intentionally rejects server execution so process-global browser state cannot leak between SSR requests.

## Install

```bash
yarn add @enfyra/sdk-vue @enfyra/sdk-core
```

Configure the same-origin Enfyra App bridge:

```dotenv
VITE_ENFYRA_BASE_URL=/enfyra
```

```ts
import { createEnfyraClient } from '@enfyra/sdk-vue'

createEnfyraClient({
  baseUrl: '/enfyra',
  auth: {
    strategy: 'cookie',
    cookieBridgePrefix: '/enfyra',
  },
})
```

## Authentication

```ts
const { user, login, logout, fetchUser } = useAuth()

await login({ email, password, remember: true })
await fetchUser()
await logout()
```

Only a 401 clears the local user. Network and server failures remain errors and do not masquerade as logout.

## API

```ts
const { data, loading, error, refresh } = useApi().get<Article[]>(
  '/articles',
  { query: { limit: 20 } },
)
```

Immediate GET requests run once on mount. Set `revalidate` to a millisecond interval for polling.

## Storage

```ts
const { upload, download } = useStorage()
await upload(file, { folder, storageConfig, uploadId })
```

## Socket.IO

```ts
const socket = useWebSocket('chat')
await socket.connect()
```

Cookie clients default to the Enfyra App `/ws` bridge. Pass explicit WebSocket options when the host application exposes a different Socket.IO proxy.
