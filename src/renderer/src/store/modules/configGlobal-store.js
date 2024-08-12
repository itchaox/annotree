/*
 * @Version    : v1.00
 * @Author     : yanglong
 * @Date       : 2023-05-17 13:55
 * @LastAuthor : itchaox
 * @LastTime   : 2024-08-10 09:57
 * @desc       : 全局配置 store
 */

import { store } from '../index'
import { defineStore } from 'pinia'

export const useConfigGlobalStore = defineStore({
  id: 'ConfigGlobal',
  state: (): any => ({
    // 通用
    COMMON: {
      // 语言
      languageId: 'en',

      // 导出后自动打开文件
      autoOpenFile: true,

      // 导出后展示彩蛋
      isEggshell: true,

      // 同步滚动
      syncScroll: true,

      // 是否显示文件和文件夹的图标
      showIcon: true,

      // 文件夹显示 /
      folderSuffix: true
    },

    // 扫描
    SCAN: {
      // 忽略以 . 开头的文件
      ignoreDotFile: false,

      // 忽略以 . 开头的文件夹
      ignoreDotFolder: false,

      // 只扫描文件夹
      onlyScanFolder: false,

      // 扫描深度
      scanDeep: 0,

      // 忽略文件夹
      ignoreFolderList: [],

      // 忽略文件
      ignoreFileList: []
    },

    // 结果
    RESULT: {
      // 默认名称
      defaultFileName: 'Annotree_{YYYY}-{MM}-{DD}_{HH}-{mm}-{ss}'
    }
  }),
  actions: {
    setData(data) {
      this.data = data
    }
  }
})

export function useConfigGlobalStoreHook() {
  return useConfigGlobalStore(store)
}
