<!--
 * @Version    : v1.00
 * @Author     : itchaox
 * @Date       : 2024-07-06 11:57
 * @LastAuthor : itchaox
 * @LastTime   : 2024-08-10 11:58
 * @desc       :
-->
<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { replace as elementReplace } from '../../utils/replace.element.js'
import { replace as noteReplace } from '../../utils/replace.note.js'
import translateFlat from '../../utils/translate.flat.js'
import data from 'emoji-mart-vue-fast/data/all.json'

import 'emoji-mart-vue-fast/css/emoji-mart.css'
import { Picker, EmojiIndex } from 'emoji-mart-vue-fast/src'
const emojiIndex = ref(new EmojiIndex(data))

import { set } from 'lodash'

import { exportImg } from '../../utils/exportImg.js'
import { copyImg } from '../../utils/copyImg.js'
import { copyTree } from '../../utils/copyTree.js'

import { languageList } from '../../constants/constants.js'

import width from 'string-width'

import { nextTick, onMounted, ref, watch, watchEffect } from 'vue'
import useClipboard from 'vue-clipboard3'

import { useI18n } from 'vue-i18n'

import { i18n } from '../../locales/i18n.js'

import ConfigPreview from './components/ConfigPreview.vue'
import ConfigGlobal from './components/ConfigGlobal.vue'

const { IPC_FOLDER_SELECT, EXPORT_TREE_TEXT, localStorage, getSystemLanguage } = window.api as any

const { t } = useI18n()

const { toClipboard } = useClipboard()

import { storeToRefs } from 'pinia'
import { useConfigPreviewStore } from '../../store/modules/configPreview-store.js'
const configPreviewStore = useConfigPreviewStore()

const { PREVIEW } = storeToRefs(configPreviewStore)

// 全局配置
const isCommon = ref(false)

// 导出后自动打开文件
const autoOpenFile = ref(true)

// 导出文件后自动打开所在目录
const autoOpenFolder = ref(false)

// 忽略文件夹
const ignoreFolderList = ref([])

// 忽略文件
const ignoreFileList = ref([])

// 扫描深度
const scanDeep = ref(0)

// 只扫描文件夹
const onlyScanFolder = ref(false)

// 忽略以 . 开头的文件
const ignoreDotFile = ref(false)

//  忽略以 . 开头的文件夹
const ignoreDotFolder = ref(false)

// 默认名称
const defaultFileName = ref('Annotree_{YYYY}-{MM}-{DD}_{HH}-{mm}-{ss}')

const emojisOutput = ref('')

const isShowEmoji = ref(false)

// 导出后展示彩蛋
const isEggshell = ref(true)

// 同步滚动
const syncScroll = ref(true)

// 缓存
const isCache = ref(false)

// 配置
const isConfig = ref(false)

// 文件夹显示 /
const folderSuffix = ref(true)

const common = JSON.parse(localStorage.getItem('annotree-common'))

// 确定重置配置
async function resetCache() {
  // 重置配置
  if (isConfig.value) {
    localStorage.removeItem('annotree-common')
    localStorage.removeItem('annotree-scan')
    localStorage.removeItem('annotree-exportConfig')
    localStorage.removeItem('annotree-preview')
    // 获取系统语言
    const _languageId = await getSystemLanguage()

    // 如果当前语言支持，则展示选中语言，否则默认展示英文
    languageId.value =
      common?.languageId ??
      (languageList?.find((item) => item.id === _languageId) ? _languageId : 'en')

    i18n.global.locale = languageId.value
  }

  // 重置注释
  if (isCache.value) {
    localStorage.removeItem('annotree-notes')
    treeData.value = []
    previewList.value = []
    folderPath.value = ''
  }

  loadLocalStorage()

  ElMessage({
    message: t('zhong-zhi-cheng-gong'),
    type: 'success',
    duration: 1500,
    showClose: true
  })
}

// 清除当前文件夹缓存的 note
function clearNotes() {
  const annotreeNotes = JSON.parse(localStorage.getItem('annotree-notes') || '{}')
  for (const item of treeData.value) {
    delete annotreeNotes[item.id]
  }

  localStorage.setItem('annotree-notes', JSON.stringify(annotreeNotes))
}

// 默认展示系统语言
const languageId = ref('en')

onMounted(async () => {
  // 获取系统语言
  const _languageId = await getSystemLanguage()

  const zhLanguages = ['zh-CN', 'zh-TW', 'zh-HK', 'zh-MO', 'zh-SG']

  // 如果当前语言支持，则展示选中语言，否则默认展示英文

  const defaultLanguage = 'en'

  // 确定最终使用的语言ID
  let languageToUse = common?.languageId

  if (!languageToUse) {
    if (zhLanguages.includes(_languageId)) {
      languageToUse = 'zh'
    } else if (languageList.some((item) => item.id === _languageId)) {
      languageToUse = _languageId
    } else {
      languageToUse = defaultLanguage
    }
  }

  loadLocalStorage()

  languageId.value = languageToUse
  i18n.global.locale = languageId.value
})

// 切换语言
watch([languageId], async () => {
  i18n.global.locale = languageId.value
})

// 加载本地存储的数据
const loadLocalStorage = () => {
  const common = JSON.parse(localStorage.getItem('annotree-common'))
  // 通用
  languageId.value = common?.languageId ?? 'en'
  autoOpenFile.value = common?.autoOpenFile ?? true
  isEggshell.value = common?.isEggshell ?? true
  syncScroll.value = common?.syncScroll ?? true
  showIcon.value = common?.showIcon ?? true
  folderSuffix.value = common?.folderSuffix ?? true

  // 扫描
  const scan = JSON.parse(localStorage.getItem('annotree-scan'))
  ignoreDotFile.value = scan?.ignoreDotFile ?? false
  ignoreDotFolder.value = scan?.ignoreDotFolder ?? false
  onlyScanFolder.value = scan?.onlyScanFolder ?? false
  scanDeep.value = scan?.scanDeep ?? 0
  ignoreFolderList.value = scan?.ignoreFolderList ?? []
  ignoreFileList.value = scan?.ignoreFileList ?? []

  // 导出
  const exportConfig = JSON.parse(localStorage.getItem('annotree-exportConfig'))
  defaultFileName.value =
    exportConfig?.defaultFileName ?? 'Annotree_{YYYY}-{MM}-{DD}_{HH}-{mm}-{ss}'

  // 预览区
  const preview = JSON.parse(localStorage.getItem('annotree-preview'))
  PREVIEW.value.bridgeChar = preview?.bridgeChar ?? '-'
  PREVIEW.value.minBridge = preview?.minBridge ?? 4
  PREVIEW.value.noteFormat = preview?.noteFormat ?? ' # {note}'
  PREVIEW.value.showBridge = preview?.showBridge ?? false
}

async function copy() {
  try {
    // 复制
    await toClipboard(emojisOutput.value)
    ElMessage({
      message: `${emojisOutput.value} ${t('copySuccess')}`,
      type: 'success',
      duration: 1500,
      showClose: true
    })
    // 复制成功
  } catch (e) {
    // 复制失败
  }
}

const treeData = ref([])

// 忽略文件夹列表
const folderList: any = ref([])

// 扫描目录
const folderPath = ref('')

// 未拍平数组
const noFlatData = ref([])

// 扫描
async function scan() {
  const params = {
    ignoreFolderList: ignoreFolderList.value,
    ignoreFileList: ignoreFileList.value,
    scanDeep: scanDeep.value,
    onlyScanFolder: onlyScanFolder.value,
    ignoreDotFile: ignoreDotFile.value,
    ignoreDotFolder: ignoreDotFolder.value
  }

  try {
    // 更新数据
    const allData = await IPC_FOLDER_SELECT(JSON.stringify(params))
    const result = allData.flatData
    noFlatData.value = allData?.noFlatData
    folderPath.value = allData.folderPath

    treeData.value = result

    // 初始化缓存
    cacheNoteList.value = result.map((item) => ({ id: item?.id, note: null }))

    folderNumber.value = treeData?.value.filter((item) => item?.isDirectory).length
    fileNumber.value = treeData?.value.filter((item) => item?.isFile).length

    // 读取缓存
    const annotreeNotes = JSON.parse(localStorage.getItem('annotree-notes') || '{}')

    // 读取缓存的 note
    treeData.value = treeData.value.map((item) => {
      for (const key in annotreeNotes) {
        const value = annotreeNotes[key]
        if (item.id === key) {
          item.note = value
        }
      }

      return item
    })
    getPreviewData()
    getIgnoreFolderList()

    // 聚焦第一个输入框
    setTimeout(() => {
      const inputs = document.getElementsByTagName('input')
      if (inputs.length > 0) {
        inputs[0].focus()
        currentIndex.value = -1
      } else {
        console.error('No input elements found on the page.')
      }
    }, 0)

    handleFolderSuffix()
  } catch (error) {
    console.error('Scan failed:', error)
  }
}

// 获取忽略的目录
function getIgnoreFolderList() {
  let result = []
  function isFolderAndPush(elements, level = 1) {
    if (level > 2) return
    for (const item of elements) {
      if (item.isDirectory) {
        result.push(item.filePath)
        isFolderAndPush(item.elements, level + 1)
      }
    }
  }
  isFolderAndPush(treeData.value)

  let uniquePaths = [...new Set(result)]
  folderList.value = uniquePaths
}

// 导出
function exportFile() {
  const params = {
    bridgeChar: PREVIEW.value.bridgeChar,
    minBridge: PREVIEW.value.minBridge,
    noteFormat: PREVIEW.value.noteFormat,
    showBridge: PREVIEW.value.showBridge,

    isRight: isRight.value,
    autoOpenFile: autoOpenFile.value,
    autoOpenFolder: autoOpenFolder.value,
    defaultFileName: defaultFileName.value,
    isEggshell: isEggshell.value
  }

  // 临时的数组，增加文件夹和文件的图标显示
  let _list = treeData.value
  _list = treeData.value.map((item) => {
    return {
      ...item,
      tree: item.tree + (showIcon.value ? (item?.isDirectory ? '📁 ' : '📄 ') : '')
    }
  })
  // ipc 通信需要序列化
  EXPORT_TREE_TEXT(JSON.stringify(_list), JSON.stringify(params))
}

// 生成合适的桥梁
function bridgeAuto({ element, note }, max) {
  if (note !== '' || showBridge.value) {
    let length = minBridge.value
    if (isRight.value) {
      length += max - width(`${element}${note}`)
    } else {
      length += max - width(element)
    }

    return PREVIEW.value.bridgeChar.repeat(length)
  }

  return ''
}

// 获取最大宽度
function getMaxWidth(result) {
  // 右边对齐
  if (isRight.value) {
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

// 当前输入框索引
const currentIndex = ref(-1)

const isShiftTab = ref(false)
// tab 聚焦下一个输入框；shift + tab 聚焦上一个输入框；
document.addEventListener('keydown', function (event) {
  nextTick(() => {
    if (event.key === 'Tab') {
      const activeElement = document.activeElement
      const inputs = document.querySelectorAll('input')
      currentIndex.value = Array.from(inputs).indexOf(activeElement)

      const firstInput = inputs[0]
      const lastInput = inputs[inputs.length - 1]

      if (!inputs.length) return // 如果没有输入框，直接返回

      // 检查当前焦点是否在输入框上
      if (![...inputs].includes(activeElement)) {
        event.preventDefault()
        if (event.shiftKey) {
          lastInput.focus()

          if (scrollLeft.value) {
            // 确保滚动条到底部
            setTimeout(() => {
              scrollLeft.value.scrollTop = scrollLeft.value.scrollHeight
            }, 10)
          }
        } else {
          firstInput.focus()
        }
        return
      }

      if (event.shiftKey) {
        isShiftTab.value = true
        // Shift + Tab
        event.preventDefault()
        if (activeElement === firstInput) {
          lastInput.focus() // 从第一个跳到最后一个
          currentIndex.value = inputs.length

          if (scrollLeft.value) {
            // 确保滚动条到底部
            setTimeout(() => {
              scrollLeft.value.scrollTop = scrollLeft.value.scrollHeight
            }, 10)
          }
        } else {
          inputs[currentIndex.value - 1].focus() // 焦点移到上一个输入框
        }
      } else {
        isShiftTab.value = false
        // Tab
        event.preventDefault()
        if (activeElement === lastInput) {
          firstInput.focus() // 从最后一个跳到第一个
          currentIndex.value = -1
        } else {
          inputs[currentIndex.value + 1].focus() // 焦点移到下一个输入框
        }
      }
    }
  })
})

// 预览数据
const previewList = ref([])

// 处理预览区域展示
function getPreviewData() {
  let result = treeData.value

  // 第一步 转换 element 和 note
  result = result?.map((item) => {
    const element = elementReplace(
      `{tree}${showIcon.value ? (item?.isDirectory ? '📁 ' : '📄 ') : ''}{name}{ext}`,
      {
        data: item
      }
    )
    const bridge = ''

    const note = item.note
      ? noteReplace(PREVIEW.value.noteFormat, {
          data: item
        })
      : ''
    return { element, bridge, note, type: item?.isFile ? 'file' : 'folder' }
  })

  const max = getMaxWidth(result)

  // 补齐桥梁
  result = result.map((item) => ({ ...item, bridge: bridgeAuto(item, max) }))

  // 转换为字符串
  result = result.map((e) => ({
    value: `${e.element}${e.bridge}${e.note}`,
    id: Math.random()
  }))

  // console.log(333)

  // 更新预览区数据
  previewList.value = result
}

// 显示预览配置
const isPreview = ref(false)

// 注释格式化
const noteFormat = ref(' # {note}')

// 桥梁最短字符数
const minBridge = ref(4)

// 桥梁字符
// const bridgeChar = ref('-')

// 始终显示桥梁
const showBridge = ref(false)

// 右侧对齐
const isRight = ref(false)

function inputChange(item) {
  //  缓存 note
  const itemIndex = cacheNoteList.value.findIndex((i) => i?.id === item.id)

  if (itemIndex !== -1) {
    cacheNoteList.value[itemIndex] = {
      id: cacheNoteList.value[itemIndex]?.id,
      note: item.note
    }
  }

  getPreviewData()
}

let typingTimer: any = null
let typingDelay = 100

// 实现实时预览效果
const handleInputChange = (item) => {
  // 如果之前有定时器，清除它
  if (typingTimer) {
    clearTimeout(typingTimer)
  }

  // 设置新的定时器
  typingTimer = setTimeout(() => {
    // 此处缓存 note
    const obj = JSON.parse(localStorage.getItem('annotree-notes') || '{}')
    const id = item.id
    const note = item.note

    localStorage.setItem(
      'annotree-notes',
      JSON.stringify({
        ...obj,
        [id]: note
      })
    )

    getPreviewData()
  }, typingDelay)
}

// 是否显示文件和文件夹的图标
const showIcon = ref(true)

// 全局配置-通用
watch([autoOpenFile, isEggshell, syncScroll, showIcon, languageId, folderSuffix], () => {
  //  存储数据
  localStorage.setItem(
    'annotree-common',
    JSON.stringify({
      autoOpenFile: autoOpenFile.value,
      isEggshell: isEggshell.value,
      syncScroll: syncScroll.value,
      showIcon: showIcon.value,
      languageId: languageId.value,
      folderSuffix: folderSuffix.value
    })
  )
})

// 控制文件夹结尾显示 /
watch([folderSuffix], () => {
  handleFolderSuffix()
})

// 处理文件夹尾部
function handleFolderSuffix() {
  if (folderSuffix.value) {
    treeData.value = treeData.value.map((item) => {
      if (item.isDirectory) {
        // 检查名称是否已经以斜杠结尾
        if (!item.name.endsWith('/')) {
          item.name = item.name + '/'
        }
      }
      return item
    })
  } else {
    treeData.value = treeData.value.map((item) => {
      if (item.isDirectory) {
        // 去掉文件夹名称末尾的斜杠
        if (item.name.endsWith('/')) {
          item.name = item.name.slice(0, -1)
        }
      }
      return item
    })
  }

  getPreviewData()
}

// 全局配置-扫描
watch(
  [ignoreDotFolder, ignoreDotFile, onlyScanFolder, scanDeep, ignoreFolderList, ignoreFileList],
  () => {
    //  存储数据
    localStorage.setItem(
      'annotree-scan',
      JSON.stringify({
        ignoreDotFile: ignoreDotFile.value,
        ignoreDotFolder: ignoreDotFolder.value,
        onlyScanFolder: onlyScanFolder.value,
        scanDeep: scanDeep.value,
        ignoreFolderList: ignoreFolderList.value,
        ignoreFileList: ignoreFileList.value
      })
    )
  }
)

// 全局配置-导出文本

watch([defaultFileName], () => {
  //  存储数据
  localStorage.setItem(
    'annotree-exportConfig',
    JSON.stringify({
      defaultFileName: defaultFileName.value
    })
  )
})

// 预览区配置
watch(
  [
    () => PREVIEW.value.bridgeChar,
    () => PREVIEW.value.minBridge,
    () => PREVIEW.value.noteFormat,
    () => PREVIEW.value.showBridge,
    isRight,
    showIcon
  ],
  () => {
    //  存储数据
    localStorage.setItem(
      'annotree-preview',
      JSON.stringify({
        bridgeChar: PREVIEW.value.bridgeChar,
        minBridge: PREVIEW.value.minBridge,
        noteFormat: PREVIEW.value.noteFormat,
        showBridge: PREVIEW.value.showBridge
      })
    )

    getPreviewData()
  }
)

// 更新 emoji
function selectEmoji(emoji) {
  emojisOutput.value = emoji.native

  copy()
}

// 重置注释
function refreshNote() {
  treeData.value = treeData.value.map((item) => ({
    ...item,
    note: ''
  }))

  clearNotes()

  getPreviewData()

  ElMessage({
    message: t('zhong-zhi-zhu-shi-cheng-gong'),
    type: 'success',
    duration: 1500,
    showClose: true
  })
}

// 文件夹数量
const folderNumber = ref(0)

// 文件数量
const fileNumber = ref(0)

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

// 删除节点
function removeNode(item) {
  const data = set(noFlatData.value, `${item.dataPath}.isShow`, false)

  const newData = translateFlat({
    data: showFilter(data),
    notes: []
  })

  // 找到之前的对象，因为以前有 note 数据
  // 这里有问题，需要替换 tree

  treeData.value = newData.map((i) => {
    let obj = treeData.value.find((j) => j.id === i.id)
    return {
      ...obj,
      tree: i.tree
    }
  })

  getPreviewData()
}

// 缓存 note 列表
const cacheNoteList = ref([])

// 折叠节点
function foldNode(item) {
  const data = set(noFlatData.value, `${item.dataPath}.isShowElements`, !item.isShowElements)

  const newData = translateFlat({
    data: showFilter(data),
    notes: []
  })

  // 找到之前的对象，因为以前有 note 数据
  // 这里有问题，需要替换 tree

  treeData.value = newData.map((i) => {
    let obj = cacheNoteList.value?.find((j) => j?.id === i.id)
    return {
      ...i,
      note: obj?.note
    }
  })

  getPreviewData()
}

const scrollLeft = ref(null)
const scrollRight = ref(null)

// 使用 isScrolling 标志来防止无限循环
let isScrolling = false

// 开启同步滚动后，先保证位置一致
watchEffect(() => {
  if (syncScroll.value && scrollLeft.value && scrollRight.value) {
    scrollLeft.value.scrollTop = scrollRight.value.scrollTop
    scrollLeft.value.scrollLeft = scrollRight.value.scrollLeft
  }
})

// 处理同步滚动
const handleScroll = (scrolledContainer, otherContainer) => {
  if (!isScrolling && syncScroll.value) {
    isScrolling = true
    otherContainer.scrollTop = scrolledContainer.scrollTop
    otherContainer.scrollLeft = scrolledContainer.scrollLeft
    isScrolling = false
  }
}

// 点击树节点
function nodeClick(index) {
  if (isShiftTab.value) {
    currentIndex.value = index + 1
  } else {
    currentIndex.value = index - 1
  }

  // 点击后聚焦至当前输入框
  const inputs = document.querySelectorAll('input')
  inputs[index].focus()
}
</script>

<template>
  <div class="main-page" @click="isShowEmoji = false">
    <!-- TODO 顶部操作区 -->
    <div class="operation">
      <div>
        <el-button type="primary" @click="scan">
          <el-icon><Search /></el-icon>
          <span> {{ $t('sao-miao') }} </span>
        </el-button>
        <el-button type="success" plain @click="isCommon = true">
          <el-icon size="16"><Setting /></el-icon>
          <span> {{ $t('quan-ju-pei-zhi') }} </span>
        </el-button>
      </div>
    </div>

    <!-- 内容区 -->
    <div class="content" v-if="treeData.length > 0">
      <!-- TODO 编辑区 -->
      <div class="left">
        <div
          class="edit-tools"
          style="display: flex; align-items: center; justify-content: space-between"
          v-if="treeData.length > 0"
        >
          <div>
            <el-icon
              size="24"
              class="tools-icon"
              @click="refreshNote"
              :title="$t('zhong-zhi-zhu-shi')"
              ><Refresh
            /></el-icon>
          </div>

          <!-- TODO 表情 -->
          <div style="position: relative">
            <el-icon
              size="24"
              :title="$t('xuan-ze-biao-qing')"
              @click.stop="isShowEmoji = !isShowEmoji"
              class="tools-icon"
              ><Star
            /></el-icon>
            <Picker
              @click.stop="isShowEmoji = true"
              v-if="isShowEmoji"
              style="position: absolute; top: 45px; left: 20px; z-index: 2"
              :data="emojiIndex"
              set="google"
              @select="selectEmoji"
              :emojiSize="26"
              :emojiTooltip="true"
              :showPreview="false"
              :i18n="{
                search: t('p1'),
                notfound: t('p2'),
                categories: {
                  search: t('p3'),
                  recent: t('p4'),
                  smileys: t('p5'),
                  people: t('p6'),
                  nature: t('p7'),
                  foods: t('p8'),
                  activity: t('p9'),
                  places: t('p10'),
                  objects: t('p11'),
                  symbols: t('p12'),
                  flags: t('p13'),
                  custom: t('p14')
                }
              }"
            />
          </div>
        </div>

        <div @scroll="handleScroll(scrollLeft, scrollRight)" ref="scrollLeft" class="tree-scroller">
          <div
            v-for="(item, index) in treeData"
            :class="{
              'tree-node-active': isShiftTab
                ? currentIndex - 1 === index
                : currentIndex + 1 === index
            }"
            :key="item.id"
            class="tree-node"
            @click="nodeClick(index)"
          >
            <div style="display: flex">
              <div style="display: flex; flex: 1">
                <div
                  class="folder-icon"
                  style="width: 15px"
                  v-if="item?.isDirectory"
                  @click="foldNode(item)"
                >
                  <el-icon color="#00000088" v-if="item.isShowElements"><CaretBottom /></el-icon>
                  <el-icon color="#00000088" v-else><CaretRight /></el-icon>
                </div>
                <div v-else style="width: 15px"></div>
                <!-- 树枝 -->
                <span class="row-tree">
                  <pre>{{ item.tree }}</pre>
                </span>
                <!-- 文件信息 -->
                <span class="row-info">
                  <!-- 文件名 -->
                  <div style="display: flex">
                    <pre>{{ showIcon ? (item?.isDirectory ? '📁 ' : '📄 ') : '' }}</pre>
                    <pre>{{ item.name }}</pre>
                    <!-- 扩展名 -->
                    <pre v-if="item.ext">{{ item.ext }}</pre>
                  </div>
                </span>
              </div>

              <div>
                <!-- 注释 -->
                <el-input
                  style="height: 20px; width: 120px; margin-right: 2px"
                  v-model="item.note"
                  size="small"
                  :placeholder="$t('qing-shu-ru-zhu-shi')"
                  clearable
                  :tabindex="index + 1"
                  @change="inputChange(item)"
                  @input="handleInputChange(item)"
                ></el-input>

                <el-button link type="danger" @click="removeNode(item)"
                  ><el-icon><Delete /></el-icon
                ></el-button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- TODO 预览区 -->
      <div class="right">
        <div class="preview-tools" v-if="previewList.length > 0">
          <div style="display: flex; align-items: center">
            <el-icon
              class="tools-icon"
              size="24"
              @click="isPreview = true"
              :title="$t('yu-lan-qu-pei-zhi')"
              ><Setting
            /></el-icon>
          </div>
          <div>
            <el-icon
              class="tools-icon"
              size="24"
              @click="copyTree(previewList, toClipboard)"
              :title="$t('fu-zhi-wen-ben')"
              ><CopyDocument
            /></el-icon>

            <el-icon class="tools-icon" size="24" @click="exportFile" :title="$t('dao-chu-wen-ben')"
              ><Download
            /></el-icon>

            <el-icon
              class="tools-icon"
              size="24"
              @click="copyImg('#capture')"
              :title="$t('fu-zhi-tu-pian')"
              ><Picture
            /></el-icon>

            <el-icon
              class="tools-icon"
              @click="exportImg('#capture')"
              size="24"
              :title="$t('dao-chu-tu-pian')"
              ><Camera
            /></el-icon>
          </div>
        </div>

        <div
          class="tree-scroller"
          ref="scrollRight"
          @scroll="handleScroll(scrollRight, scrollLeft)"
        >
          <div id="capture">
            <pre class="tree-node" v-for="item in previewList" :key="item.id">{{ item.value }}</pre>
          </div>
        </div>
      </div>
    </div>

    <!-- TODO 无数据 -->
    <div class="no-data" v-else>
      <img src="../../assets/images/noData.png" alt="" />
      <div>
        {{ $t('qing') }} <span class="no-data-btn" @click="scan">{{ $t('sao-miao') }}</span>
        {{ $t('wen-jian-jia-lu-ru-shu-ju') }}
      </div>
    </div>

    <!-- TODO 预览配置 -->
    <ConfigPreview v-model:isPreview="isPreview" />

    <!-- v-model:noteFormat="noteFormat"
      v-model:minBridge="minBridge"
      v-model:bridgeChar="bridgeChar"
      v-model:showBridge="showBridge" -->

    <!-- TODO 全局配置 -->
    <ConfigGlobal
      @resetCache="resetCache"
      :folderList="folderList"
      v-model:isCommon="isCommon"
      v-model:languageId="languageId"
      v-model:autoOpenFile="autoOpenFile"
      v-model:isEggshell="isEggshell"
      v-model:syncScroll="syncScroll"
      v-model:showIcon="showIcon"
      v-model:folderSuffix="folderSuffix"
      v-model:isCache="isCache"
      v-model:isConfig="isConfig"
      v-model:ignoreFolderList="ignoreFolderList"
      v-model:ignoreDotFolder="ignoreDotFolder"
      v-model:onlyScanFolder="onlyScanFolder"
      v-model:ignoreDotFile="ignoreDotFile"
      v-model:ignoreFileList="ignoreFileList"
      v-model:scanDeep="scanDeep"
      v-model:defaultFileName="defaultFileName"
    />

    <!-- TODO 底部 -->
    <div class="info" v-if="treeData?.length > 0">
      <div class="dir" v-if="folderPath">
        <div>{{ $t('sco-miao-mu-lu') }}：{{ folderPath }}</div>
      </div>
      <div>
        <div>{{ $t('zong-ji-treedatalength', [treeData?.length]) }}</div>
        <div v-if="folderNumber > 0">
          <el-icon><FolderChecked /></el-icon>
          <span>{{ $t('wen-jian-jia-foldernumber', [folderNumber]) }}</span>
        </div>
        <div v-if="fileNumber > 0">
          <el-icon><DocumentChecked /></el-icon>
          <span>{{ $t('wen-jian-filenumber', [fileNumber]) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.main-page {
  padding: 14px;
  .operation {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .dir {
    &::after {
      content: '|';
    }
  }

  .no-data {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    border: 1px solid #dee2e6;
    height: 88vh;
    border-radius: 4px;
    font-size: 18px;
    img {
      width: 35%;
    }

    .no-data-btn {
      color: #5a9cf8;
      font-size: 22px;

      &:hover {
        cursor: pointer;
      }
    }
  }

  /* 编辑区 */
  .content {
    display: flex;

    pre {
      color: #333;
    }

    .left {
      flex: 1;
      background-color: #f7f8f9;
      height: 88vh;
      border-radius: 4px;
      border: 1px solid #dee2e6;
      border-right: none;

      .edit-tools {
        display: flex;
        align-items: center;
        width: 100%;
        border-bottom: 1px solid #dee2e6;
        padding: 5px 10px;

        .edit-tool {
          margin-right: 15px;
        }
      }
    }

    .right {
      flex: 1;
      height: 88vh;
      border-radius: 4px;

      background-color: #fff;
      border: 1px solid #dee2e6;

      .preview-tools {
        display: flex;
        align-items: center;
        justify-content: space-between;

        width: 100%;
        border-bottom: 1px solid #dee2e6;
        padding: 5px 10px;
      }
    }

    .tree-scroller {
      margin-top: 20px;
      padding: 0 10px 0 10px;
      height: calc(100% - 100px);
      overflow: auto;
      // 溢出滚动样式
      &::-webkit-scrollbar {
        width: 4px;
        height: 4px;
      }

      &::-webkit-scrollbar-thumb {
        border-radius: 3px;
        background-color: #b7bdc6;
        cursor: pointer;
      }

      &::-webkit-scrollbar-track {
        border-radius: 3px;
        background-color: #f7f8f9;
      }
    }

    .tree-node {
      height: 20px;
      padding-right: 30px;

      &:hover {
        background-color: #99999950;
        cursor: pointer;
      }
    }

    .tree-node-active {
      background-color: #99999950;
      cursor: pointer;
    }

    .folder-icon {
      &:hover {
        cursor: pointer;

        .el-icon {
          color: #5a9cf8;
        }
      }
    }

    .row-info {
      display: inline-flex;
      justify-content: space-between;
      margin-left: 2px;
    }
  }

  /* 底部 */
  .info {
    display: flex;
    align-items: center;
    margin-top: 14px;
    font-size: 14px;
    div {
      margin-right: 14px;
      display: flex;
      align-items: center;
      span {
        margin-left: 3px;
      }
    }
  }
}

.tools-icon {
  margin-right: 24px;
  &:hover {
    color: #5a9cf8;
    cursor: pointer;
  }
}
</style>
