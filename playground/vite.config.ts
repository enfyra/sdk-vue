import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@enfyra/sdk-vue': resolve(__dirname, '../src/index.ts'),
      '@enfyra/sdk-core': resolve(__dirname, '../../core/src/index.ts'),
    },
  },
  server: {
    port: 3002,
    host: true,
  },
})
