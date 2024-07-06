/*
 * @Version    : v1.00
 * @Author     : itchaox
 * @Date       : 2024-07-06 11:28
 * @LastAuthor : itchaox
 * @LastTime   : 2024-07-06 11:52
 * @desc       :
 */

// @ts-nocheck 全局属性

import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// 自定义 api 用于渲染
const api = {
  name: 'wangchao'
}

// 仅当启用上下文隔离时使用 `contextBridge` API 将 Electron API 暴露给渲染进程，否则直接添加到 DOM 全局对象。
if (process.contextIsolated) {
  // FIXME 现在走这里
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
