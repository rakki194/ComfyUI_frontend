import '@comfyorg/litegraph/style.css'
import { definePreset } from '@primevue/themes'
import Aura from '@primevue/themes/aura'
import { createPinia } from 'pinia'
import 'primeicons/primeicons.css'
import PrimeVue from 'primevue/config'
import ConfirmationService from 'primevue/confirmationservice'
import ToastService from 'primevue/toastservice'
import Tooltip from 'primevue/tooltip'
import { createApp } from 'vue'

import '@/assets/css/style.css'
import router from '@/router'

import App from './App.vue'
import { i18n } from './i18n'

const ComfyUIPreset = definePreset(Aura, {
  semantic: {
    // @ts-expect-error fixme ts strict error
    primary: Aura['primitive'].blue
  }
})

const app = createApp(App)
const pinia = createPinia()

app.use(router)
app.use(i18n)
app.use(PrimeVue, {
  theme: {
    preset: ComfyUIPreset,
    options: {
      darkModeSelector: 'system',
      cssLayer: {
        name: 'primevue',
        order: 'tailwind-base, primevue, tailwind-utilities'
      }
    }
  }
})
app.use(pinia)
app.use(ToastService)
app.use(ConfirmationService)
app.directive('tooltip', Tooltip)
app.mount('#vue-app')
