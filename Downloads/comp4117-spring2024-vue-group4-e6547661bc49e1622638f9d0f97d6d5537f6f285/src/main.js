import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.css'
import "bootstrap"
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import WaveUI from 'wave-ui'
import 'wave-ui/dist/wave-ui.css'
import Oruga from '@oruga-ui/oruga-next';
import '@oruga-ui/theme-oruga/dist/oruga-full.css'

const app = createApp(App)

app.use(router)
import VCalendar from 'v-calendar';
app.use(WaveUI, { /* Some Wave UI options */ })
app.use(VCalendar, {});
app.use(Oruga);
app.mount('#app')
