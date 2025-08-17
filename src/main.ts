import { createApp } from 'vue'
import App from './App.vue'

import { IonicVue } from '@ionic/vue'
import router from './router' // ⬅️ Router importieren

// Ionic CSS
import '@ionic/vue/css/core.css'
import '@ionic/vue/css/normalize.css'
import '@ionic/vue/css/structure.css'
import '@ionic/vue/css/typography.css'

const app = createApp(App)
app.use(IonicVue)
app.use(router) // ⬅️ Router registrieren
app.mount('#app')
