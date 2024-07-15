<!--
 * @Version    : v1.00
 * @Author     : itchaox
 * @Date       : 2024-07-06 11:57
 * @LastAuthor : itchaox
 * @LastTime   : 2024-07-15 12:02
 * @desc       :
-->
<script setup lang="ts">
const { IPC_FOLDER_SELECT, EXPORT_TREE_TEXT } = window.api as any
import { replace as elementReplace } from '../utils/replace.element.js'
import { replace as noteReplace } from '../utils/replace.note.js'

import packageJson from '../../../../package.json'; // 根据你的文件结构调整路径


import { groupBy } from 'lodash'

import width from 'string-width'

import { ref, watch } from 'vue'

const treeData = ref(null)

// 忽略文件类型列表
const extList: any = ref([])

// 忽略文件夹列表
const folderList: any = ref([])

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
    const result = await IPC_FOLDER_SELECT(JSON.stringify(params))
    treeData.value = result

    const grouped = groupBy(result, 'ext')
    extList.value = Object.keys(grouped)

    getPreviewData()
    getIgnoreFolderList()
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
  // 设置弄成一个弹窗操作
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
    defaultFileName: defaultFileName.value
  }
  // ipc 通信需要序列化
  EXPORT_TREE_TEXT(JSON.stringify(treeData.value), JSON.stringify(params))
}

// 删除
function deleteItem(index) {
  console.log(index)
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

document.addEventListener('keydown', function (event) {
  if (event.key === 'Tab') {
    const inputs = document.getElementsByTagName('input')
    const lastInput = inputs[inputs.length - 1]
    if (document.activeElement === lastInput) {
      event.preventDefault() // 阻止默认行为，避免切换到下一个元素
      inputs[0].focus() // 将焦点移到第一个输入框
    }
  }
})

// 预览数据
const previewList = ref([])

// 处理预览区域展示
function getPreviewData() {
  let result = treeData.value

  // 第一步 转换 element 和 note
  result = result?.map((item) => {
    const element = elementReplace('{tree}{name}{ext}', {
      data: item
    })
    const bridge = ''

    const note = item.note
      ? noteReplace(noteFormat.value, {
          data: item
        })
      : ''
    return { element, bridge, note }
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

function inputChange() {
  getPreviewData()
}

watch([bridgeChar, minBridge, noteFormat, showBridge, isRight], () => {
  getPreviewData()
})

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
</script>

<template>
  <div class="main-page">
    <div class="operation">
      <div>
        <el-button type="primary" @click="scan">
          <el-icon><Search /></el-icon>
          <span> 扫描 </span>
        </el-button>
        <el-button type="warning" @click="setCommon">
          <el-icon size="16"><Setting /></el-icon>
          <span> 全局配置 </span>
        </el-button>
      </div>
    </div>
    <el-divider />

    <div class="content">
      <div class="left">
        <h1>编辑区</h1>

        <recycle-scroller
          class="tree-scroller"
          :items="treeData"
          :item-size="18"
          key-field="id"
          v-slot="{ item, index }"
          v-if="treeData"
        >
          <div style="display: flex">
            <!-- 树枝 -->
            <span class="row-tree">
              <pre>{{ item.tree }}</pre>
            </span>
            <!-- 文件信息 -->
            <span style="display: inline-flex; margin-left: 2px">
              <!-- 文件名 -->
              <pre>{{ item.name }}</pre>
              <!-- 扩展名 -->
              <pre v-if="item.ext">{{ item.ext }}</pre>
              <!-- 注释 -->
              <!-- <pre v-if="item.note"> // {{ item.note }}</pre> -->

              <!-- <input type="text" /> -->
              <el-input
                style="margin-left: 5px; height: 20px; width: 120px"
                v-model="item.note"
                size="small"
                placeholder="请输入注释"
                clearable
                :tabindex="index + 1"
                @change="inputChange"
              ></el-input>

              <!-- 暂时不做 -->
              <!-- <el-button link type="danger" @click="deleteItem(index)">删除</el-button> -->
            </span>
          </div>
        </recycle-scroller>
      </div>
      <div class="right">
        <div style="display: flex; align-items: center; justify-content: space-between">
          <div style="display: flex; align-items: center">
            <h1>预览区</h1>
            <el-icon
              class="tools-icon"
              style="margin-left: 2px"
              size="26"
              color="#5e89fb"
              @click="isPreview = true"
              title="预览区配置"
              ><Tools
            /></el-icon>

            <div style="margin-left: 5px">
              <!-- <el-button type="warning" >预览配置</el-button> -->
            </div>
          </div>
          <div>
            <el-button v-if="previewList.length > 0" type="primary" @click="exportFile">
              <el-icon size="18"><Download /></el-icon>
              <span>导出</span>
            </el-button>
            <!-- FIXME 暂时不做 -->
            <!-- <el-button>复制</el-button> -->
          </div>
        </div>
        <!-- <recycle-scroller
          class="tree-scroller"
          :items="previewList"
          :item-size="18"
          key-field="id"
          v-slot="{ item }"
          v-if="previewList.length > 0"
        >
          <pre style="height: 18px; text-align: left">{{ item.value }}</pre>
        </recycle-scroller> -->

        <div class="tree-scroller">
          <pre v-for="item in previewList" :key="item.id">{{ item.value }}</pre>
        </div>
      </div>

      <!-- 预览配置 -->
      <el-drawer v-model="isPreview" direction="ltr" :modal="true" @close="isPreview = false">
        <template #header>
          <h4>预览配置</h4>
        </template>
        <template #default>
          <div class="preview-config">
            <div class="preview-item">
              <div class="preview-label">注释格式化</div>
              <div class="preview-value">
                <el-input v-model="noteFormat" placeholder="请输入格式化字符串"></el-input>
              </div>
            </div>

            <div class="preview-item">
              <div class="preview-label">桥梁最短字符数</div>
              <div class="preview-value">
                <el-input-number
                  v-model="minBridge"
                  placeholder="请输入桥梁最短字符数"
                  :min="0"
                ></el-input-number>
              </div>
            </div>

            <div class="preview-item">
              <div class="preview-label">桥梁填充字符</div>
              <div class="preview-value">
                <el-input v-model="bridgeChar" placeholder="请输入单字节填充字符"></el-input>
              </div>
            </div>

            <div class="preview-item">
              <div class="preview-label">始终显示桥梁</div>
              <div class="preview-value">
                <el-switch size="large" v-model="showBridge"></el-switch>
              </div>
            </div>

            <!-- FIXME 暂时注释 -->
            <!-- <div class="preview-item">
              <div class="preview-label">右侧对齐</div>
              <div class="preview-value">
                <el-switch size="large" v-model="isRight"></el-switch>
              </div>
            </div> -->
          </div>
        </template>
        <!-- <template #footer>
          <div style="flex: auto">
            <el-button @click="cancelPreview">取消</el-button>
            <el-button type="primary" @click="confirmPreview">保存</el-button>
          </div>
        </template> -->
      </el-drawer>

      <!-- 全局配置 -->
      <el-dialog
        v-model="isCommon"
        title="全局配置"
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
                  <span>通用</span>
                </span>
              </template>
              <div>
                <div class="tab-item">
                  <div class="tab-item-label">
                    自动打开文件
                    <el-tooltip effect="dark" content="导出文件后自动打开" placement="top">
                      <el-icon size="16" style="margin-left: 3px"><Warning /></el-icon>
                    </el-tooltip>
                  </div>
                  <div class="tab-item-value"><el-switch v-model="autoOpenFile"></el-switch></div>
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
                  <span>扫描</span>
                </span>
              </template>
              <div>
                <div class="tab-item">
                  <div class="tab-item-label">
                    忽略文件夹
                    <el-tooltip
                      effect="dark"
                      content="忽略不需要扫描的文件夹，避免性能损失甚至程序失去响应，比如：node_modules 文件夹，程序内部已自动忽略 node_modules 文件夹"
                      placement="top"
                    >
                      <el-icon size="16" style="margin-left: 3px"><Warning /></el-icon>
                    </el-tooltip>
                  </div>
                  <div class="tab-item-value">
                    <el-select
                      v-model="ignoreFolderList"
                      placeholder="请选择需要忽略的文件夹"
                      style="width: 325px"
                      multiple
                      collapse-tags
                      :max-collapse-tags="3"
                      filterable
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
                    忽略以 "." 开头的文件夹
                    <el-tooltip
                      effect="dark"
                      content="这类文件夹在 MacOS 和 Linux 上是默认隐藏的文件夹"
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
                    只扫描文件夹
                    <el-tooltip effect="dark" content="忽略所有文件，只扫描文件夹" placement="top">
                      <el-icon size="16" style="margin-left: 3px"><Warning /></el-icon>
                    </el-tooltip>
                  </div>
                  <div class="tab-item-value"><el-switch v-model="onlyScanFolder"></el-switch></div>
                </div>

                <div class="tab-item">
                  <div class="tab-item-label">
                    忽略以 "." 开头的文件
                    <el-tooltip
                      effect="dark"
                      content="这类文件在 MacOS 和 Linux 上是默认隐藏的文件"
                      placement="top"
                    >
                      <el-icon size="16" style="margin-left: 3px"><Warning /></el-icon>
                    </el-tooltip>
                  </div>
                  <div class="tab-item-value"><el-switch v-model="ignoreDotFile"></el-switch></div>
                </div>

                <div class="tab-item">
                  <div class="tab-item-label">
                    忽略文件类型
                    <el-tooltip
                      effect="dark"
                      content="在扫描一次后，会生成此次扫描后的所有文件类型，可以选择忽略不需要的文件类型，以提高扫描效率"
                      placement="top"
                    >
                      <el-icon size="16" style="margin-left: 3px"><Warning /></el-icon>
                    </el-tooltip>
                  </div>
                  <div class="tab-item-value">
                    <el-select
                      v-model="ignoreFileList"
                      placeholder="请选择需要忽略的文件类型"
                      filterable
                      style="width: 325px"
                      multiple
                      collapse-tags
                      :max-collapse-tags="3"
                    >
                      <el-option
                        v-for="item in extList.filter((i) => i)"
                        :key="item"
                        :label="item"
                        :value="item"
                      />
                    </el-select>
                  </div>
                </div>

                <div class="tab-item">
                  <div class="tab-item-label">
                    扫描深度
                    <el-tooltip
                      effect="dark"
                      content="设置扫描目录的深度，0 为所有深度，每递增一个数字则代表扫描深度 +1"
                      placement="top"
                    >
                      <el-icon size="16" style="margin-left: 3px"><Warning /></el-icon>
                    </el-tooltip>
                  </div>
                  <div class="tab-item-value">
                    <el-input-number
                      v-model="scanDeep"
                      placeholder="请输入扫描深度"
                      :min="0"
                    ></el-input-number>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <!-- 导出文本 -->
            <el-tab-pane>
              <template #label>
                <span class="custom-tabs-label">
                  <el-icon><Download /></el-icon>
                  <span>导出文本</span>
                </span>
              </template>
              <div>
                <div class="tab-item">
                  <div style="width: 100px">默认名称</div>
                  <div>
                    <el-input
                      style="width: 380px; font-size: 12px"
                      v-model="defaultFileName"
                      placeholder="请输入默认名称"
                    >
                      <template #append>.txt</template>
                    </el-input>
                  </div>
                </div>
                <!-- <div class="tab-item">
                  <div style="width: 100px">例子</div>
                  <div>Annotree_2024-07-12_08-30-20.txt</div>
                </div> -->
              </div>
            </el-tab-pane>
            <!-- 备份和恢复 -->
            <!-- <el-tab-pane>
              <template #label>
                <span class="custom-tabs-label">
                  <el-icon><CircleCheck /></el-icon>
                  <span>备份和恢复</span>
                </span>
              </template>
              <div>测试</div>
            </el-tab-pane> -->
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
                  <span>关于</span>
                </span>
              </template>
              <div>
                <div class="tab-item">
                  <div class="tab-item-label">当前版本</div>
                  <div class="tab-item-value">v{{ packageJson.version }}</div>
                </div>
                <div class="tab-item">
                  <div class="tab-item-label">开发者</div>
                  <div class="tab-item-value">
                    <el-link type="primary" href="https://github.com/itchaox" target="_blank"
                      >itchaox</el-link
                    >
                  </div>
                </div>
                <div class="tab-item">
                  <div class="tab-item-label">其他信息</div>
                  <div class="tab-item-value">
                    开源

                    <el-link
                      type="primary"
                      href="https://github.com/itchaox/annotree"
                      target="_blank"
                      >GitHub 地址</el-link
                    >
                    ，感谢 Star ⭐️
                  </div>
                </div>
                                <div class="tab-item">
                  <div class="tab-item-label">官方文档</div>
                  <div class="tab-item-value">
                    <el-link
                      type="primary"
                      href="https://annotree.com"
                      target="_blank"
                      >⚡️ 点我查看</el-link
                    >
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-dialog>
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

    .preview-config {
      .preview-item {
        display: flex;
        align-items: center;
        margin-bottom: 20px;

        .preview-label {
          width: 125px;
        }
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
      min-width: 175px;
    }

    .tab-item-value {
      width: 400px;
    }
  }
}
</style>
