<!--
 * @Version    : v1.00
 * @Author     : itchaox
 * @Date       : 2024-07-06 11:57
 * @LastAuthor : itchaox
 * @LastTime   : 2024-07-28 00:51
 * @desc       :
-->
<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { replace as elementReplace } from '../utils/replace.element.js'
import { replace as noteReplace } from '../utils/replace.note.js'
import translateFlat from '../utils/translate.flat.js'
import data from 'emoji-mart-vue-fast/data/all.json'

import 'emoji-mart-vue-fast/css/emoji-mart.css'
import { Picker, EmojiIndex } from 'emoji-mart-vue-fast/src'
const emojiIndex = ref(new EmojiIndex(data))

import { set } from 'lodash'
import { extList } from '../constants/constants.js'

import packageJson from '../../../../package.json'

import width from 'string-width'

import { nextTick, onMounted, ref, watch, watchEffect } from 'vue'
import useClipboard from 'vue-clipboard3'

import { useI18n } from 'vue-i18n'

import { i18n } from '../locales/i18n.js'

const { IPC_FOLDER_SELECT, EXPORT_TREE_TEXT, localStorage, getSystemLanguage } = window.api as any

const { t } = useI18n()

const { toClipboard } = useClipboard()

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

// 判断是否为中文
function isChinese(languageCode) {
  return languageCode.toLowerCase().startsWith('zh')
}

// 语言列表
const languageList = ref([
  // {
  //   id: 'system',
  //   name: t('gen-sui-xi-tong')
  // },
  {
    id: 'en',
    name: 'English'
  },
  {
    id: 'zh',
    name: '简体中文'
  }
])

// 语言
const languageId = ref('system')

onMounted(async () => {
  loadLocalStorage()

  // 切换至系统语言
  let systemLanguage
  if (languageId.value === 'system') {
    systemLanguage = isChinese(await getSystemLanguage()) ? 'zh' : 'en'
    languageId.value = systemLanguage
    i18n.global.locale = systemLanguage
  }
})

// 切换语言
watch([languageId], async () => {
  // 切换至系统语言
  let systemLanguage
  if (languageId.value === 'system') {
    systemLanguage = isChinese(await getSystemLanguage()) ? 'zh' : 'en'
    languageId.value = systemLanguage
    i18n.global.locale = systemLanguage
  } else {
    i18n.global.locale = languageId.value
  }
})

// 加载本地存储的数据
const loadLocalStorage = () => {
  // 通用
  const common = JSON.parse(localStorage.getItem('annotree-common'))
  if (common) {
    languageId.value = common.languageId ?? 'system'
    autoOpenFile.value = common.autoOpenFile ?? true
    isEggshell.value = common.isEggshell ?? true
    syncScroll.value = common.syncScroll ?? true
    showIcon.value = common.showIcon ?? true
  }

  // 扫描
  const scan = JSON.parse(localStorage.getItem('annotree-scan'))
  if (scan) {
    ;(ignoreDotFile.value = scan.ignoreDotFile ?? false),
      (ignoreDotFolder.value = scan.ignoreDotFolder ?? false),
      (onlyScanFolder.value = scan.onlyScanFolder ?? false),
      (scanDeep.value = scan.scanDeep ?? 0),
      (ignoreFolderList.value = scan.ignoreFolderList ?? []),
      (ignoreFileList.value = scan.ignoreFileList ?? [])
  }

  // 导出
  const exportConfig = JSON.parse(localStorage.getItem('annotree-exportConfig'))
  if (exportConfig) {
    defaultFileName.value =
      exportConfig.defaultFileName ?? 'Annotree_{YYYY}-{MM}-{DD}_{HH}-{mm}-{ss}'
  }

  // 预览区
  const preview = JSON.parse(localStorage.getItem('annotree-preview'))
  if (preview) {
    bridgeChar.value = preview.bridgeChar ?? '─'
    minBridge.value = preview.minBridge ?? 4
    noteFormat.value = preview.noteFormat ?? ' // {note}'
    showBridge.value = preview.showBridge ?? false
  }
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
      } else {
        console.error('No input elements found on the page.')
      }
    }, 0)
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

// 设置
function setCommon() {
  isCommon.value = true
}

// 导出
function exportFile() {
  const params = {
    bridgeChar: bridgeChar.value,
    minBridge: minBridge.value,
    noteFormat: noteFormat.value,
    showBridge: showBridge.value,
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

    return bridgeChar.value.repeat(length)
  }

  return ''
}

// 获取最大宽度
function getMaxWidth(result) {
  // 第一步 转换 element 和 note
  // const result = data.map((item) => {
  //   const element = elementReplace('{tree}{name}{ext}', {
  //     data: item
  //   })
  //   const bridge = ''

  //   const note = item.note
  //     ? noteReplace(noteFormat.value, {
  //         data: item
  //       })
  //     : ''
  //   return { element, bridge, note }
  // })

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

// tab 聚焦下一个输入框；shift + tab 聚焦上一个输入框；
document.addEventListener('keydown', function (event) {
  nextTick(() => {
    if (event.key === 'Tab') {
      const inputs = document.querySelectorAll('input')
      const firstInput = inputs[0]
      const lastInput = inputs[inputs.length - 1]
      const activeElement = document.activeElement

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

      const currentIndex = Array.from(inputs).indexOf(activeElement)

      if (event.shiftKey) {
        // Shift + Tab
        event.preventDefault()
        if (activeElement === firstInput) {
          lastInput.focus() // 从第一个跳到最后一个

          if (scrollLeft.value) {
            // 确保滚动条到底部
            setTimeout(() => {
              scrollLeft.value.scrollTop = scrollLeft.value.scrollHeight
            }, 10)
          }
        } else {
          inputs[currentIndex - 1].focus() // 焦点移到上一个输入框
        }
      } else {
        // Tab
        event.preventDefault()
        if (activeElement === lastInput) {
          firstInput.focus() // 从最后一个跳到第一个
        } else {
          inputs[currentIndex + 1].focus() // 焦点移到下一个输入框
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
      ? noteReplace(noteFormat.value, {
          data: item
        })
      : ''
    return { element, bridge, note, type: item?.isFile ? 'file' : 'folder' }
  })

  const max = getMaxWidth(result)

  // 补齐桥梁
  result = result.map((item) => ({ ...item, bridge: bridgeAuto(item, max) }))

  // 转换为字符串
  // result = result.map((e) => `${e.element}${e.bridge}${e.note}`)
  result = result.map((e) => ({
    value: `${e.element}${e.bridge}${e.note}`,
    id: Math.random()
  }))

  previewList.value = result
}

// 显示预览配置
const isPreview = ref(false)

// 注释格式化
const noteFormat = ref(' // {note}')

// 桥梁最短字符数
const minBridge = ref(4)

// 桥梁字符
const bridgeChar = ref('-')

// 始终显示桥梁
const showBridge = ref(false)

// 右侧对齐
const isRight = ref(false)

function inputChange(item) {
  //  缓存 note
  cacheNoteList.value = cacheNoteList.value.map((i) => {
    if (i?.id === item.id) {
      return {
        id: i?.id,
        note: item.note
      }
    } else {
      return i
    }
  })

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
watch([autoOpenFile, isEggshell, syncScroll, showIcon, languageId], () => {
  //  存储数据
  localStorage.setItem(
    'annotree-common',
    JSON.stringify({
      autoOpenFile: autoOpenFile.value,
      isEggshell: isEggshell.value,
      syncScroll: syncScroll.value,
      showIcon: showIcon.value,
      languageId: languageId.value
    })
  )
})

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
watch([bridgeChar, minBridge, noteFormat, showBridge, isRight, showIcon], () => {
  //  存储数据
  localStorage.setItem(
    'annotree-preview',
    JSON.stringify({
      bridgeChar: bridgeChar.value,
      minBridge: minBridge.value,
      noteFormat: noteFormat.value,
      showBridge: showBridge.value
    })
  )

  getPreviewData()
})

// 更新 emoji
function selectEmoji(emoji) {
  emojisOutput.value = emoji.native

  copy()
}

// 重置数据
function refreshData() {
  treeData.value = []
  previewList.value = []
  folderPath.value = ''
  ElMessage({
    message: t('zhong-zhi-shu-ju-cheng-gong'),
    type: 'success',
    duration: 1500,
    showClose: true
  })
}

// 重置注释
function refreshNote() {
  treeData.value = treeData.value.map((item) => ({
    ...item,
    note: ''
  }))

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

// 复制树
async function copyTree() {
  // 直接拿到处理后的tree

  // 显示图标
  const result = previewList.value.map((item) => item?.value)

  // 换行分割数组至字符串
  const data = result.join('\n')

  try {
    // 复制
    await toClipboard(data)
    ElMessage({
      message: t('copySuccess'),
      type: 'success',
      duration: 1500,
      showClose: true
    })
    // 复制成功
  } catch (e) {
    // 复制失败
  }
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
</script>

<template>
  <div class="main-page" @click="isShowEmoji = false">
    <div class="operation">
      <div>
        <el-button type="primary" @click="scan">
          <el-icon><Search /></el-icon>
          <span> {{ $t('sao-miao') }} </span>
        </el-button>
        <el-button type="warning" @click="setCommon">
          <el-icon size="16"><Setting /></el-icon>
          <span> {{ $t('quan-ju-pei-zhi') }} </span>
        </el-button>
      </div>
    </div>

    <el-divider />

    <div class="dir" v-if="folderPath">
      <div>{{ $t('sco-miao-mu-lu') }}：{{ folderPath }}</div>
    </div>

    <!-- 内容区 -->
    <div class="content">
      <div class="left">
        <div style="display: flex; align-items: center; justify-content: space-between">
          <h1>{{ $t('bian-ji-qu') }}</h1>
          <div class="edit-tools" v-if="treeData.length > 0">
            <div class="edit-tool">
              <el-button type="danger" @click="refreshData">
                <el-icon><Refresh /></el-icon>
                <span> {{ $t('zhong-zhi-shu-ju') }} </span>
              </el-button>
            </div>
            <div class="edit-tool">
              <el-button @click="refreshNote">
                <el-icon><Refresh /></el-icon>
                <span> {{ $t('zhong-zhi-zhu-shi') }} </span>
              </el-button>
            </div>

            <div style="position: relative">
              <el-button type="warning" @click.stop="isShowEmoji = !isShowEmoji"
                >🎉 {{ $t('xuan-ze-biao-qing') }}</el-button
              >
              <Picker
                @click.stop="isShowEmoji = true"
                v-if="isShowEmoji"
                style="position: absolute; top: 45px; right: 0; z-index: 2"
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
        </div>

        <div @scroll="handleScroll(scrollLeft, scrollRight)" ref="scrollLeft" class="tree-scroller">
          <div v-for="(item, index) in treeData" :key="item.id">
            <div style="display: flex">
              <div
                class="folder-icon"
                style="width: 15px"
                v-if="item?.isDirectory"
                @click="foldNode(item)"
              >
                <el-icon color="#00000090" v-if="item.isShowElements"><CaretBottom /></el-icon>
                <el-icon color="#00000090" v-else><CaretRight /></el-icon>
              </div>
              <div v-else style="width: 15px"></div>
              <!-- 树枝 -->
              <span class="row-tree">
                <pre>{{ item.tree }}</pre>
              </span>
              <!-- 文件信息 -->
              <span style="display: inline-flex; margin-left: 2px">
                <!-- <img
                src="https://fonts.gstatic.com/s/i/materialicons/file_present/v6/24px.svg"
                alt=""
              /> -->
                <!-- 文件名 -->
                <pre>{{ showIcon ? (item?.isDirectory ? '📁 ' : '📄 ') : '' }}</pre>
                <pre>{{ item.name }}</pre>
                <!-- 扩展名 -->
                <pre v-if="item.ext">{{ item.ext }}</pre>
                <!-- 注释 -->
                <el-input
                  style="margin-left: 5px; height: 20px; width: 120px"
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
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="right">
        <div style="display: flex; align-items: center; justify-content: space-between">
          <div style="display: flex; align-items: center">
            <h1>{{ $t('yu-lan-qu') }}</h1>
            <el-icon
              class="tools-icon"
              style="margin-left: 2px"
              size="26"
              color="#5e89fb"
              @click="isPreview = true"
              :title="$t('yu-lan-qu-pei-zhi')"
              ><Tools
            /></el-icon>
          </div>
          <div v-if="previewList.length > 0">
            <el-button @click="copyTree" type="success">
              <el-icon size="18"><CopyDocument /></el-icon>
              <span>{{ $t('fu-zhi') }}</span>
            </el-button>

            <el-button type="primary" @click="exportFile">
              <el-icon size="18"><Download /></el-icon>
              <span>{{ $t('dao-chu') }}</span>
            </el-button>
          </div>
        </div>

        <div
          class="tree-scroller"
          ref="scrollRight"
          @scroll="handleScroll(scrollRight, scrollLeft)"
        >
          <pre v-for="item in previewList" :key="item.id">{{ item.value }}</pre>
        </div>
      </div>

      <!-- 预览配置 -->
      <el-drawer v-model="isPreview" direction="ltr" :modal="true" @close="isPreview = false">
        <template #header>
          <h4>{{ $t('yu-lan-pei-zhi') }}</h4>
        </template>
        <template #default>
          <div class="preview-config">
            <div class="preview-item">
              <div class="preview-label">{{ $t('zhu-shi-ge-shi-hua') }}</div>
              <div class="preview-value">
                <el-input
                  v-model="noteFormat"
                  :placeholder="$t('qing-shu-ru-ge-shi-hua-zi-fu-chuan')"
                ></el-input>
              </div>
            </div>

            <div class="preview-item">
              <div class="preview-label">{{ $t('qiao-liang-zui-duan-zi-fu-shu') }}</div>
              <div class="preview-value">
                <el-input-number
                  v-model="minBridge"
                  :placeholder="$t('qing-shu-ru-qiao-liang-zui-duan-zi-fu-shu')"
                  :min="0"
                ></el-input-number>
              </div>
            </div>

            <div class="preview-item">
              <div class="preview-label">{{ $t('qiao-liang-tian-chong-zi-fu') }}</div>
              <div class="preview-value">
                <el-input
                  v-model="bridgeChar"
                  :placeholder="$t('qing-shu-ru-dan-zi-jie-tian-chong-zi-fu')"
                ></el-input>
              </div>
            </div>

            <div class="preview-item">
              <div class="preview-label">{{ $t('shi-zhong-xian-shi-qiao-liang') }}</div>
              <div class="preview-value">
                <el-switch size="large" v-model="showBridge"></el-switch>
              </div>
            </div>
          </div>
        </template>
      </el-drawer>

      <!-- 全局配置 -->
      <el-dialog
        v-model="isCommon"
        :title="$t('quan-ju-pei-zhi')"
        width="40vw"
        :close-on-click-modal="true"
        :close-on-press-escape="true"
        @close="isCommon = false"
      >
        <div class="dialog-body">
          <el-tabs type="border-card" class="demo-tabs">
            <!-- 通用 -->
            <el-tab-pane>
              <template #label>
                <span class="custom-tabs-label">
                  <el-icon><house /></el-icon>
                  <span>{{ $t('tong-yong') }}</span>
                </span>
              </template>
              <div>
                <div class="tab-item">
                  <div class="tab-item-label">
                    {{ $t('yu-yan') }}
                    <el-tooltip
                      effect="dark"
                      :content="$t('pei-zhi-ruan-jian-xian-shi-yu-yan')"
                      placement="top"
                    >
                      <el-icon size="16" style="margin-left: 3px"><Warning /></el-icon>
                    </el-tooltip>
                  </div>
                  <div class="tab-item-value">
                    <el-select
                      v-model="languageId"
                      :placeholder="$t('qing-xuan-ze-yu-yan')"
                      style="width: 110px"
                    >
                      <el-option
                        v-for="item in languageList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                  </div>
                </div>
                <div class="tab-item">
                  <div class="tab-item-label">
                    {{ $t('zi-dong-da-kai-wen-jian') }}
                    <el-tooltip
                      effect="dark"
                      :content="$t('dao-chu-wen-jian-hou-zi-dong-da-kai')"
                      placement="top"
                    >
                      <el-icon size="16" style="margin-left: 3px"><Warning /></el-icon>
                    </el-tooltip>
                  </div>
                  <div class="tab-item-value"><el-switch v-model="autoOpenFile"></el-switch></div>
                </div>
                <div class="tab-item">
                  <div class="tab-item-label">
                    {{ $t('dao-chu-hou-zhan-shi-cai-dai') }}
                    <el-tooltip
                      effect="dark"
                      :content="$t('dao-chu-cheng-gong-hou-zi-dong-zhan-shi-cai-dan')"
                      placement="top"
                    >
                      <el-icon size="16" style="margin-left: 3px"><Warning /></el-icon>
                    </el-tooltip>
                  </div>
                  <div class="tab-item-value"><el-switch v-model="isEggshell"></el-switch></div>
                </div>
                <div class="tab-item">
                  <div class="tab-item-label">
                    {{ $t('tong-bu-gun-dong') }}
                    <el-tooltip
                      effect="dark"
                      :content="$t('bian-ji-qu-he-yu-lan-qu-shi-fou-tong-bu-gun-dong')"
                      placement="top"
                    >
                      <el-icon size="16" style="margin-left: 3px"><Warning /></el-icon>
                    </el-tooltip>
                  </div>
                  <div class="tab-item-value"><el-switch v-model="syncScroll"></el-switch></div>
                </div>
                <div class="tab-item">
                  <div class="tab-item-label">
                    {{ $t('xian-shi-tu-biao') }}
                    <el-tooltip
                      effect="dark"
                      :content="$t('shi-fou-xian-shi-wen-jian-jia-he-wen-jian-de-tu-biao')"
                      placement="top"
                    >
                      <el-icon size="16" style="margin-left: 3px"><Warning /></el-icon>
                    </el-tooltip>
                  </div>
                  <div class="tab-item-value"><el-switch v-model="showIcon"></el-switch></div>
                </div>
                <!-- FIXME 不生效，暂时注释 -->
                <!-- <div class="tab-item">
                  <div class="tab-item-label">自动打开文件夹</div>
                  <div class="tab-item-value"><el-switch v-model="autoOpenFolder"></el-switch></div>
                </div> -->
              </div>
            </el-tab-pane>
            <!-- 扫描 -->
            <el-tab-pane>
              <template #label>
                <span class="custom-tabs-label">
                  <el-icon><Search /></el-icon>
                  <span>{{ $t('sao-miao') }}</span>
                </span>
              </template>
              <div>
                <div class="tab-item">
                  <div class="tab-item-label">
                    {{ $t('hu-lve-wen-jian-jia') }}
                    <el-tooltip
                      effect="dark"
                      :content="
                        $t(
                          'hu-lve-bu-xu-yao-sao-miao-de-wen-jian-jia-ti-gao-sao-miao-xiao-shuai-ke-xin-zeng-xu-yao-guo-lv-de-wen-jian-jia-li-ru-macos-xia-wei-builddistwindows-xia-wei-builddist'
                        )
                      "
                      placement="top"
                    >
                      <el-icon size="16" style="margin-left: 3px"><Warning /></el-icon>
                    </el-tooltip>
                  </div>
                  <div class="tab-item-value">
                    <el-select
                      v-model="ignoreFolderList"
                      :placeholder="$t('qing-xuan-ze-xu-yao-hu-lve-de-wen-jian-jia')"
                      style="width: 325px"
                      multiple
                      collapse-tags
                      :max-collapse-tags="3"
                      filterable
                      default-first-option
                      allow-create
                    >
                      <el-option
                        v-for="item in folderList.filter((i) => i)"
                        :key="item"
                        :label="item"
                        :value="item"
                      />
                    </el-select>
                  </div>
                </div>
                <div class="tab-item">
                  <div class="tab-item-label">
                    {{ $t('hu-lve-yi-kai-tou-de-wen-jian-jia') }}
                    <el-tooltip
                      effect="dark"
                      :content="
                        $t(
                          'zhe-lei-wen-jian-jia-zai-macos-he-linux-shang-shi-mo-ren-yin-cang-de-wen-jian-jia'
                        )
                      "
                      placement="top"
                    >
                      <el-icon size="16" style="margin-left: 3px"><Warning /></el-icon>
                    </el-tooltip>
                  </div>
                  <div class="tab-item-value">
                    <el-switch v-model="ignoreDotFolder"></el-switch>
                  </div>
                </div>

                <div class="tab-item">
                  <div class="tab-item-label">
                    {{ $t('zhi-sao-miao-wen-jian-jia') }}
                    <el-tooltip
                      effect="dark"
                      :content="$t('hu-lve-suo-you-wen-jian-zhi-sao-miao-wen-jian-jia')"
                      placement="top"
                    >
                      <el-icon size="16" style="margin-left: 3px"><Warning /></el-icon>
                    </el-tooltip>
                  </div>
                  <div class="tab-item-value"><el-switch v-model="onlyScanFolder"></el-switch></div>
                </div>

                <div class="tab-item">
                  <div class="tab-item-label">
                    {{ $t('hu-lve-yi-kai-tou-de-wen-jian') }}
                    <el-tooltip
                      effect="dark"
                      :content="
                        $t(
                          'zhe-lei-wen-jian-zai-macos-he-linux-shang-shi-mo-ren-yin-cang-de-wen-jian'
                        )
                      "
                      placement="top"
                    >
                      <el-icon size="16" style="margin-left: 3px"><Warning /></el-icon>
                    </el-tooltip>
                  </div>
                  <div class="tab-item-value"><el-switch v-model="ignoreDotFile"></el-switch></div>
                </div>

                <div class="tab-item">
                  <div class="tab-item-label">
                    {{ $t('hu-lve-wen-jian-lei-xing') }}
                    <el-tooltip
                      effect="dark"
                      :content="
                        $t(
                          'xuan-ze-hu-lve-bu-xu-yao-de-wen-jian-lei-xing-yi-ti-gao-sao-miao-xiao-shuai-ke-xin-zeng-xu-yao-guo-lv-de-wen-jian-lei-xing'
                        )
                      "
                      placement="top"
                    >
                      <el-icon size="16" style="margin-left: 3px"><Warning /></el-icon>
                    </el-tooltip>
                  </div>
                  <div class="tab-item-value">
                    <el-select
                      v-model="ignoreFileList"
                      :placeholder="$t('qing-xuan-ze-xu-yao-hu-lve-de-wen-jian-lei-xing')"
                      filterable
                      style="width: 325px"
                      multiple
                      collapse-tags
                      default-first-option
                      allow-create
                      :max-collapse-tags="3"
                    >
                      <el-option-group
                        v-for="group in extList"
                        :key="group.label"
                        :label="group.label"
                      >
                        <el-option
                          v-for="item in group.options"
                          :key="item"
                          :label="item"
                          :value="item"
                        />
                      </el-option-group>
                    </el-select>
                  </div>
                </div>

                <div class="tab-item">
                  <div class="tab-item-label">
                    {{ $t('sao-miao-shen-du') }}
                    <el-tooltip
                      effect="dark"
                      :content="
                        $t(
                          'she-zhi-sao-miao-mu-lu-de-shen-du-0-wei-suo-you-shen-du-mei-di-zeng-yi-ge-shu-zi-ze-dai-biao-sao-miao-shen-du-1'
                        )
                      "
                      placement="top"
                    >
                      <el-icon size="16" style="margin-left: 3px"><Warning /></el-icon>
                    </el-tooltip>
                  </div>
                  <div class="tab-item-value">
                    <el-input-number v-model="scanDeep" :min="0"></el-input-number>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <!-- 导出文本 -->
            <el-tab-pane>
              <template #label>
                <span class="custom-tabs-label">
                  <el-icon><Download /></el-icon>
                  <span>{{ $t('dao-chu-wen-ben') }}</span>
                </span>
              </template>
              <div>
                <div class="tab-item">
                  <div style="width: 100px">{{ $t('mo-ren-ming-cheng') }}</div>
                  <div>
                    <el-input
                      style="width: 380px; font-size: 12px"
                      v-model="defaultFileName"
                      :placeholder="$t('qing-shu-ru-mo-ren-ming-cheng')"
                    >
                      <template #append>.txt</template>
                    </el-input>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <!-- 重置 -->
            <!-- <el-tab-pane>
              <template #label>
                <span class="custom-tabs-label">
                  <el-icon><Refresh /></el-icon>
                  <span>重置</span>
                </span>
              </template>
              <div>测试</div>
            </el-tab-pane> -->
            <!-- 关于 -->
            <el-tab-pane>
              <template #label>
                <span class="custom-tabs-label">
                  <el-icon><WarningFilled /></el-icon>
                  <span>{{ $t('guan-yu') }}</span>
                </span>
              </template>
              <div>
                <div class="tab-item">
                  <div class="tab-item-label">{{ $t('dang-qian-ban-ben') }}</div>
                  <div class="tab-item-value">v{{ packageJson.version }}</div>
                </div>
                <div class="tab-item">
                  <div class="tab-item-label">{{ $t('kai-fa-zhe') }}</div>
                  <div class="tab-item-value">
                    <el-link type="primary" href="https://github.com/itchaox" target="_blank"
                      >itchaox</el-link
                    >
                  </div>
                </div>
                <div class="tab-item">
                  <div class="tab-item-label">{{ $t('qi-ta-xin-xi') }}</div>
                  <div class="tab-item-value">
                    {{ $t('kai-yuan') }}

                    <el-link
                      type="primary"
                      href="https://github.com/itchaox/annotree"
                      target="_blank"
                      >{{ $t('github-di-zhi') }}</el-link
                    >{{ $t('gan-xie-star') }}
                  </div>
                </div>
                <div class="tab-item">
                  <div class="tab-item-label">{{ $t('guan-fang-wen-dang') }}</div>
                  <div class="tab-item-value">
                    <el-link type="primary" href="https://annotree.com" target="_blank">{{
                      $t('dian-wo-cha-kan')
                    }}</el-link>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-dialog>
    </div>

    <div class="info" v-if="treeData?.length > 0">
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
</template>

<style lang="scss" scoped>
.main-page {
  padding: 14px;
  .operation {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .dir {
    font-size: 14px;
    margin-bottom: 10px;
  }

  .content {
    display: flex;

    pre {
      color: #333;
    }

    .left {
      padding: 10px;
      flex: 1;
      background-color: #f8f9fa;
      height: 83vh;
      margin-right: 20px;
      border-radius: 4px;
      border: 1px solid #dee2e6;

      .edit-tools {
        display: flex;
        align-items: center;
        .edit-tool {
          margin-right: 15px;
        }
      }
    }

    .right {
      padding: 10px;
      flex: 1;
      height: 83vh;
      border-radius: 4px;

      background-color: #f8f9fa;
      border: 1px solid #dee2e6;

      .tools-icon {
        &:hover {
          cursor: pointer;
        }
      }
    }

    .tree-scroller {
      height: calc(100% - 100px);
      overflow: auto;
    }

    .folder-icon {
      &:hover {
        cursor: pointer;

        .el-icon {
          color: #5a9cf8;
        }
      }
    }

    .preview-config {
      .preview-item {
        display: flex;
        align-items: center;
        margin-bottom: 20px;

        .preview-label {
          width: 125px;
        }

        .preview-value {
          margin-left: 15px;
        }
      }
    }
  }

  .info {
    display: flex;
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

.dialog-body {
  .custom-tabs-label {
    display: flex;
    align-items: center;
    span {
      margin-left: 5px;
    }
  }
  .tab-item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;

    .tab-item-label {
      display: flex;
      align-items: center;
      margin-right: 10px;
      width: 185px;
    }

    .tab-item-value {
      width: 400px;
    }
  }
}
</style>
