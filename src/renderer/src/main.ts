/*
 * @Version    : v1.00
 * @Author     : itchaox
 * @Date       : 2024-07-06 11:28
 * @LastAuthor : itchaox
 * @LastTime   : 2024-07-10 23:56
 * @desc       :
 */
//全局初始化样式
import 'normalize.css'
import './assets/main.css'

import VueVirtualScroller from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import { createApp } from 'vue'

import 'element-plus/dist/index.css'

import App from './App.vue'
import { store } from './store'

const app = createApp(App)

app.use(store)
app.use(VueVirtualScroller)
app.mount('#app')
