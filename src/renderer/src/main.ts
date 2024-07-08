/*
 * @Version    : v1.00
 * @Author     : itchaox
 * @Date       : 2024-07-06 11:28
 * @LastAuthor : itchaox
 * @LastTime   : 2024-07-09 00:10
 * @desc       :
 */
//全局初始化样式
import 'normalize.css'
import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { store } from './store'

const app = createApp(App)

app.use(store)
app.mount('#app')
