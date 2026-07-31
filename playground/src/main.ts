import { createApp } from 'vue'
import { createEnfyra } from '@enfyra/sdk-vue'
import App from './App.vue'
import './style.css'

const baseUrl = import.meta.env.VITE_ENFYRA_URL || 'http://localhost:3000'

const app = createApp(App)
app.use(createEnfyra({ baseUrl }))
app.mount('#app')
