/*
 * @Version    : v1.00
 * @Author     : itchaox
 * @Date       : 2024-07-06 11:28
 * @LastAuthor : itchaox
 * @LastTime   : 2024-07-10 23:36
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
  FILE_NAME: 'Annotate-Tree [ {YYYY}-{MM}-{DD} {HH}:{mm}:{ss} ]',
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
  name: 'wangchao',
  // 扫描函数
  IPC_FOLDER_SELECT: () => {
    return new Promise((resolve) => {
      ipcRenderer.send('IPC_FOLDER_SELECT')

      // IPC_FOLDER_SELECT_REPLY: () => {
      ipcRenderer.once('IPC_FOLDER_SELECT_REPLY', async (event, arg) => {
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
        // console.log('前：', treeStore.data)

        const flatData = translateFlat({
          data: showFilter(data),
          notes: []
        })

        resolve(flatData)

        // 存储处理后的数据

        // EXPORT_TREE_TEXT(flatData)

        // store.commit('SCAN_FOLDER_PATH_UPDATE', arg)
        // store.commit('IPC_FOLDER_SCAN')
      })
      // }
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

  console.log('查看处理后数据：', result)

  // 导出
  ipcRenderer.send('IPC_EXPORT', {
    name: `${nameReplace(setting.FILE_NAME)}.txt`,
    value: result.join('\n'),
    openAfterExport: true
  })
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
