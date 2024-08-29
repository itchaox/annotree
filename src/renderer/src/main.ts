/*
 * @Version    : v1.00
 * @Author     : itchaox
 * @Date       : 2024-07-06 11:28
 * @LastAuthor : itchaox
 * @LastTime   : 2024-07-29 00:17
 * @desc       :
 */
//全局初始化样式
import 'normalize.css'
import './assets/main.css'

import { i18n } from './locales/i18n.js'
import VueVirtualScroller from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import en from 'element-plus/dist/locale/en.mjs'
import ElementPlus from 'element-plus'
import { createApp } from 'vue'

import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import App from './App.vue'
import { store } from './store'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

let lang = 'en'
// 根据缓存语言，修改语言环境
const common =
  localStorage.getItem('annotree-common') && JSON.parse(localStorage.getItem('annotree-common') ?? '')
if (common) {
  lang = common.languageId ?? 'en'
}

// i18n.global.locale = lang
const _isZh = lang === 'zh'

app.use(ElementPlus, {
  locale: _isZh ? zhCn : en
})

app.use(i18n)
app.use(store)
app.use(VueVirtualScroller)
app.mount('#app')
