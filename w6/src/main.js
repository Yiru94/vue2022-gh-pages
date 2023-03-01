import { createApp } from 'vue'

import App from './App.vue'
import router from './router'

import './assets/all.scss'

import axios from 'axios'
import VueAxios from 'vue-axios'

import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'

import { Form, Field, ErrorMessage, defineRule, configure } from 'vee-validate'// 引入 VeeValidate 元件跟功能
import AllRules from '@vee-validate/rules' // 引入 VeeValidate 的驗證規則
import { localize, setLocale } from '@vee-validate/i18n' // 引入 VeeValidate 的 i18n 功能
import zhTW from '@vee-validate/i18n/dist/locale/zh_TW.json' // 引入 VeeValidate 的繁體中文語系檔

Object.keys(AllRules).forEach((rule) => {
  defineRule(rule, AllRules[rule])
})

configure({
  generateMessage: localize({ zh_TW: zhTW }), // 載入繁體中文語系
  validateOnInput: true // 當輸入任何內容直接進行驗證
})
setLocale('zh_TW')

const app = createApp(App)

app.component('VueLoading', Loading)
app.component('VeeForm', Form)
app.component('VeeField', Field)
app.component('ErrorMessage', ErrorMessage)
app.use(VueAxios, axios)
app.use(router)
app.mount('#app')
