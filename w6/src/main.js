import { createApp } from 'vue'

import App from './App.vue'
import router from './router'

import './assets/all.scss'

import axios from 'axios'
import VueAxios from 'vue-axios'

import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'

const app = createApp(App)

app.component('VueLoading', Loading)

app.use(VueAxios, axios)
app.use(router)
app.mount('#app')
