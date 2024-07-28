/*
 * @Version    : v1.00
 * @Author     : itchaox
 * @Date       : 2024-07-27 13:20
 * @LastAuthor : itchaox
 * @LastTime   : 2024-07-28 22:42
 * @desc       :
 */
import { createI18n } from 'vue-i18n'
import en from './en.json'
import zh from './zh.json'
import es from './es.json'
import fr from './fr.json'
import de from './de.json'
import ko from './ko.json'
import ru from './ru.json'
import pt from './pt.json'
import it from './it.json'
import ja from './ja.json'

export const i18n = createI18n({
  locale: 'en',
  allowComposition: true, // 占位符支持
  messages: {
    en: en,
    zh: zh,
    es: es,
    fr: fr,
    de: de,
    ko: ko,
    ru: ru,
    pt: pt,
    it: it,
    ja: ja
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
