/*
 * @Version    : v1.00
 * @Author     : itchaox
 * @Date       : 2024-07-06 11:28
 * @LastAuthor : itchaox
 * @LastTime   : 2024-07-27 22:31
 * @desc       :
 */

// @ts-nocheck 全局属性

import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import path from 'path'
import width from 'string-width'

import scan from '../renderer/src/utils/scan.js'
import translateFlat from '../renderer/src/utils/translate.flat.js'

import { replace as elementReplace } from '../renderer/src/utils/replace.element.js'
import { replace as noteReplace } from '../renderer/src/utils/replace.note.js'
import { replace as nameReplace } from '../renderer/src/utils/replace.fileName.js'
import { useTreeStoreHook } from '../renderer/src/store/modules/tree-store.ts'

import { quickBurstConfetti } from '../renderer/src/utils/quickBurstConfetti.js'

const treeStore = useTreeStoreHook()

/**
 * 根据 isShow 和 isShowElements 过滤数据
 * @param {Array} elements 需要过滤的原数组
 */
function showFilter(els) {
  return els
    .filter((el) => el.isShow)
    .map((el) => ({
      ...el,
      elements: el.isShowElements ? showFilter(el.elements) : []
    }))
}

const TREE_TEXT = {
  // 文件名
  FILE_NAME: 'Annotree [ {YYYY}-{MM}-{DD} {HH}:{mm}:{ss} ]',
  // 元素格式化
  ELEMENT_FORMAT: '{tree}{name}{ext}',
  // 备注格式化
  NOTE_FORMAT: '// {note}',
  // 桥梁最短
  BRIDGE_MIN: 4,
  // 桥梁填充
  BRIDGE_CELL: '-',
  // 始终显示桥梁
  BRIDGE_ALWAYS: false,
  // 右侧对齐
  FLOAT_RIGHT: false
}

// 自定义 api 用于渲染
const api = {
  localStorage: {
    setItem: (key, value) => window.localStorage.setItem(key, value),
    getItem: (key) => window.localStorage.getItem(key),
    removeItem: (key) => window.localStorage.removeItem(key),
    clear: () => window.localStorage.clear()
  },
  // 获取系统语言
  getSystemLanguage: () => ipcRenderer.invoke('get-system-language'),
  // 扫描函数
  IPC_FOLDER_SELECT: (params) => {
    const _params = JSON.parse(params)

    return new Promise((resolve) => {
      ipcRenderer.send('IPC_FOLDER_SELECT')

      ipcRenderer.once('IPC_FOLDER_SELECT_REPLY', async (event, arg) => {
        // FIXME 此处配置扫描相关的参数
        const res = await scan({
          folderPath: arg,
          // 默认自动忽略 node_modules 文件夹
          ignorePath: [
            ...['node_modules', '.git'].map((e) => path.sep + e),
            ..._params.ignoreFolderList
          ],
          ignoreExt: _params.ignoreFileList,
          ignoreFile: _params.onlyScanFolder,
          ignoreDotStartFile: _params.ignoreDotFile,
          ignoreDotStartFolder: _params.ignoreDotFolder,
          deep: _params.scanDeep
        })

        // 为扫描结果的每一项增加固定索引
        function addIndex(elements) {
          return elements.map((e, index) => ({
            index,
            ...e,
            elements: addIndex(e.elements)
          }))
        }

        const data = addIndex(res)

        const flatData = translateFlat({
          data: showFilter(data),
          notes: []
        })

        resolve({
          noFlatData: data,
          flatData,
          folderPath: arg
        })

        // 存储处理后的数据

        // store.commit('SCAN_FOLDER_PATH_UPDATE', arg)
        // store.commit('IPC_FOLDER_SCAN')
      })
    })
  },

  // 导出文本
  EXPORT_TREE_TEXT: (data, params) => {
    EXPORT_TREE_TEXT(JSON.parse(data), JSON.parse(params))
  }

  // 扫描结果回调
}

/**
 * 导出 [ 树形文本 ]
 */
function EXPORT_TREE_TEXT(data, params) {
  // 设置
  const setting = TREE_TEXT
  // 开始处理
  let result = data

  // 获取最大宽度
  function getMaxWidth(result) {
    // 右边对齐
    if (params?.isRight) {
      // 计算result中每个对象的element属性的最大宽度
      const elementLengthMax = result.reduce(
        (max, { element }) => (width(element) > max ? width(element) : max),
        0
      )

      // 计算result中每个对象的note属性的最大宽度
      const noteLengthMax = result.reduce(
        (max, { note }) => (width(note) > max ? width(note) : max),
        0
      )

      // 返回element和note最大宽度之和
      return elementLengthMax + noteLengthMax
    } else {
      // 左对齐
      // 计算result中每个对象的element属性的最大宽度
      return result.reduce((max, { element }) => {
        const length = width(element)
        return length > max ? length : max
      }, 0)
    }
  }

  // 生成合适的桥梁
  function bridgeAuto({ element, note }, max) {
    if (note !== '' || params?.showBridge) {
      let length = params?.minBridge
      if (params?.isRight) {
        length += max - width(`${element}${note}`)
      } else {
        length += max - width(element)
      }

      return params?.bridgeChar.repeat(length)
    }

    return ''
  }

  // 第一步 转换 element 和 note
  result = result.map((item) => {
    const element = elementReplace('{tree}{name}{ext}', {
      data: item
    })
    const bridge = ''

    const note = item.note
      ? noteReplace(params.noteFormat, {
          data: item
        })
      : ''
    return { element, bridge, note }
  })

  // 计算最大宽度
  const max = getMaxWidth(result)

  // 补齐桥梁
  result = result.map((item) => ({ ...item, bridge: bridgeAuto(item, max) }))

  // 转换为字符串
  result = result.map((e) => `${e.element}${e.bridge}${e.note}`)

  // 导出
  ipcRenderer.send('IPC_EXPORT', {
    name: `${nameReplace(params.defaultFileName)}.txt`,
    value: result.join('\n'),
    openAfterExport: params.autoOpenFile,
    isEggshell: params?.isEggshell
    // openFolderAfterExport: params.autoOpenFolder
  })
}

// 导出后回调
ipcRenderer.on('IPC_EXPORT_REPLY', (event, response) => {
  if (response?.isEggshell) {
    // 导出后彩带
    quickBurstConfetti()
  }
})

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
