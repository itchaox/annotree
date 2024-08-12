/*
 * @Version    : v1.00
 * @Author     : yanglong
 * @Date       : 2023-05-17 13:55
 * @LastAuthor : itchaox
 * @LastTime   : 2024-08-10 11:33
 * @desc       : 预览配置 store
 */

import { defineStore } from 'pinia'

export const useConfigPreviewStore = defineStore({
  id: 'ConfigPreview',
  state: () => ({
    // 预览
    PREVIEW: {
      // 桥梁字符
      bridgeChar: '-',

      // 桥梁最短字符数
      minBridge: 4,

      // 注释格式化
      noteFormat: ' # {note}',

      // 始终显示桥梁
      showBridge: false
    }
  }),
  actions: {}
})
