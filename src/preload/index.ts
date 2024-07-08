/*
 * @Version    : v1.00
 * @Author     : itchaox
 * @Date       : 2024-07-06 11:28
 * @LastAuthor : itchaox
 * @LastTime   : 2024-07-08 21:44
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
  FILE_NAME: 'FolderExplorer [ {YYYY}-{MM}-{DD} {HH}:{mm}:{ss} ]',
  // 元素格式化
  ELEMENT_FORMAT: '{tree}{name}{ext} ',
  // 备注格式化
  NOTE_FORMAT: ' // {note}',
  // 桥梁最短
  BRIDGE_MIN: 4,
  // 桥梁填充
  BRIDGE_CELL: '-',
  // 始终显示桥梁
  BRIDGE_ALWAYS: false,
  // 右侧对齐
  FLOAT_RIGHT: false,
  // 显示边框
  BORDER: false
}

// 自定义 api 用于渲染
const api = {
  name: 'wangchao',
  // 扫描函数
  IPC_FOLDER_SELECT: () => {
    ipcRenderer.send('IPC_FOLDER_SELECT')
  },

  // 扫描结果回调
  IPC_FOLDER_SELECT_REPLY: () => {
    ipcRenderer.on('IPC_FOLDER_SELECT_REPLY', async (event, arg) => {
      const res = await scan({
        folderPath: arg,
        ignorePath: ['node_modules', 'dist', '.git'].map((e) => path.sep + e),
        ignoreExt: [],
        ignoreFile: false,
        ignoreDotStartFile: false,
        ignoreDotStartFolder: false,
        deep: 0
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

      // console.log(
      //   'flag-data',
      //   translateFlat({
      //     data: showFilter(data),
      //     notes: []
      //   })
      // )

      // // 这里用 pinia 存储数据

      const flatData = translateFlat({
        data: showFilter(data),
        notes: []
      })

      console.log('scan result', flatData)

      EXPORT_TREE_TEXT(flatData)

      // store.commit('SCAN_FOLDER_PATH_UPDATE', arg)
      // store.commit('IPC_FOLDER_SCAN')
    })
  }
}

/**
 * 导出 [ 树形文本 ]
 */
function EXPORT_TREE_TEXT(data) {
  // 设置
  const setting = TREE_TEXT
  // 开始处理
  let result = data

  // 获取最大宽度
  function getMaxWidth(result) {
    if (setting.FLOAT_RIGHT) {
      const elementLengthMax = result.reduce(
        (max, { element }) => (width(element) > max ? width(element) : max),
        0
      )
      const noteLengthMax = result.reduce(
        (max, { note }) => (width(note) > max ? width(note) : max),
        0
      )
      return elementLengthMax + noteLengthMax
    } else {
      return result.reduce((max, { element }) => {
        const length = width(element)
        return length > max ? length : max
      }, 0)
    }
  }
  // 生成合适的桥梁
  function bridgeAuto({ element, note }, max) {
    if (note !== '' || setting.BRIDGE_ALWAYS) {
      let length = setting.BRIDGE_MIN
      if (setting.FLOAT_RIGHT) length += max - width(`${element}${note}`)
      else length += max - width(element)
      return setting.BRIDGE_CELL.repeat(length)
    }
    return ''
  }

  // 第一步 转换 element 和 note
  result = result.map((item) => {
    const element = elementReplace(setting.ELEMENT_FORMAT, {
      data: item
    })
    const bridge = ''
    const note = item.note
      ? noteReplace(setting.NOTE_FORMAT, {
          data: item
        })
      : ''
    return { element, bridge, note }
  })
  // 计算最大宽度
  const max = getMaxWidth(result)
  // 补齐
  result = result.map((item) => ({ ...item, bridge: bridgeAuto(item, max) }))
  // 转换为字符串
  result = result.map((e) => `${e.element}${e.bridge}${e.note}`)
  // 边框
  if (setting.BORDER) result = asciiBorder(result)
  // 导出
  ipcRenderer.send('IPC_EXPORT', {
    name: `${nameReplace(setting.FILE_NAME)}.txt`,
    value: result.join('\n'),
    openAfterExport: true,
    openFolderAfterExport: true
  })

  // this.commit('IPC_EXPORT', {
  //   name: `${require('@/util/replace.fileName.js').replace(setting.FILE_NAME)}.txt`,
  //   value: result.join('\n')
  // })
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
