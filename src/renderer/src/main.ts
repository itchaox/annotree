/*
 * @Version    : v1.00
 * @Author     : itchaox
 * @Date       : 2024-07-06 11:28
 * @LastAuthor : itchaox
 * @LastTime   : 2024-07-11 10:02
 * @desc       :
 */
//全局初始化样式
import 'normalize.css'
import './assets/main.css'

import VueVirtualScroller from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import { createApp } from 'vue'

import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import App from './App.vue'
import { store } from './store'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(store)
app.use(VueVirtualScroller)
app.mount('#app')
