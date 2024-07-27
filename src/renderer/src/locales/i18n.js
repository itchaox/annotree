/*
 * @Version    : v1.00
 * @Author     : itchaox
 * @Date       : 2024-07-27 13:20
 * @LastAuthor : itchaox
 * @LastTime   : 2024-07-27 17:03
 * @desc       :
 */
import { createI18n } from 'vue-i18n'
import en from './en.json'
import zh from './zh.json'

export const i18n = createI18n({
  locale: 'en',
  allowComposition: true, // 占位符支持
  messages: {
    en: en,
    zh: zh
  }
})

// 获取缓存的语言配置
let lang = 'en'
// 根据缓存语言，修改语言环境
const common = JSON.parse(localStorage.getItem('annotree-common'))
if (common) {
  lang = common.languageId ?? 'en'
}

i18n.global.locale = lang
