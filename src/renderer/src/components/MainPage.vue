<!--
 * @Version    : v1.00
 * @Author     : itchaox
 * @Date       : 2024-07-06 11:57
 * @LastAuthor : itchaox
 * @LastTime   : 2024-07-11 12:49
 * @desc       :
-->
<script setup lang="ts">
const { IPC_FOLDER_SELECT, EXPORT_TREE_TEXT } = window.api as any
import { ElMessage } from 'element-plus'
import { replace as elementReplace } from '../utils/replace.element.js'
import { replace as noteReplace } from '../utils/replace.note.js'

import width from 'string-width'

import { ref, watch } from 'vue'

const treeData = ref(null)

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
    getPreviewData()
  } catch (error) {
    console.error('Scan failed:', error)
  }
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
    isRight: isRight.value
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

// 预览设置
function previewSet() {
  isPreview.value = true

  // 保存一个副本
  _bridgeChar.value = bridgeChar.value
  _minBridge.value = minBridge.value
  _noteFormat.value = noteFormat.value
  _showBridge.value = showBridge.value
  _isRight.value = isRight.value
}

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

// 预览取消按钮
function cancelPreview() {
  // 确定时不重置数据
  if (!isConfirm.value) {
    bridgeChar.value = _bridgeChar.value
    minBridge.value = _minBridge.value
    noteFormat.value = _noteFormat.value
    showBridge.value = _showBridge.value
    isRight.value = _isRight.value
  }

  isPreview.value = false
  isConfirm.value = false
}

const isConfirm = ref(false)

// 预览确定按钮
function confirmPreview() {
  isPreview.value = false

  isConfirm.value = true

  ElMessage({
    message: '预览配置修改成功',
    type: 'success'
  })
}

// 备注格式化
const noteFormat = ref('// {note}')
const _noteFormat = ref()

// 桥梁最短字符数
const minBridge = ref(4)
const _minBridge = ref()

// 桥梁字符
const bridgeChar = ref('-')
const _bridgeChar = ref('')

// 始终显示桥梁
const showBridge = ref(false)
const _showBridge = ref()

// 右侧对齐
const isRight = ref(false)
const _isRight = ref()

function inputChange() {
  getPreviewData()
}

watch([bridgeChar, minBridge, noteFormat, showBridge, isRight], () => {
  getPreviewData()
})

// 全局配置
const isCommon = ref(false)

// 通用取消
function cancelCommon() {
  isCommon.value = false
}

// 通用保存
function saveCommon() {
  isCommon.value = false
}

// 导出后自动打开文件
const autoOpenFile = ref(false)

// 导出文件后自动打开所在目录
const autoOpenFolder = ref(false)

// 忽略文件夹
const ignoreFolderList = ref([])

const options = [
  {
    value: 'Option1',
    label: 'Option1'
  },
  {
    value: 'Option2',
    label: 'Option2'
  },
  {
    value: 'Option3',
    label: 'Option3'
  },
  {
    value: 'Option4',
    label: 'Option4'
  },
  {
    value: 'Option5',
    label: 'Option5'
  }
]

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
</script>

<template>
  <div class="main-page">
    <div class="operation">
      <div>
        <el-button type="primary" @click="scan">扫描</el-button>
        <el-button type="warning" @click="setCommon">全局配置</el-button>
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
              <!-- 备注 -->
              <!-- <pre v-if="item.note"> // {{ item.note }}</pre> -->

              <!-- <input type="text" /> -->
              <el-input
                style="margin-left: 5px; height: 20px; width: 120px"
                v-model="item.note"
                size="small"
                placeholder="请输入备注"
                clearable
                :tabindex="index + 1"
                @change="inputChange"
              ></el-input>

              <el-button link type="danger" @click="deleteItem(index)">删除</el-button>
            </span>
          </div>
        </recycle-scroller>
      </div>
      <div class="right">
        <div style="display: flex; align-items: center; justify-content: space-between">
          <div style="display: flex; align-items: center">
            <h1>预览区</h1>
            <div>
              <el-button type="warning" @click="previewSet">预览配置</el-button>
            </div>
          </div>
          <div>
            <el-button type="primary" @click="exportFile">导出</el-button>
            <el-button>复制</el-button>
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
      <el-drawer
        v-model="isPreview"
        direction="ltr"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :modal="false"
        @close="cancelPreview"
      >
        <template #header>
          <h4>预览配置</h4>
        </template>
        <template #default>
          <div class="preview-config">
            <div class="preview-item">
              <div class="preview-label">备注格式化</div>
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
                <el-input v-model="bridgeChar" placeholder="请输入桥梁填充字符"></el-input>
              </div>
            </div>

            <div class="preview-item">
              <div class="preview-label">始终显示桥梁</div>
              <div class="preview-value">
                <el-switch size="large" v-model="showBridge"></el-switch>
              </div>
            </div>

            <div class="preview-item">
              <div class="preview-label">右侧对齐</div>
              <div class="preview-value">
                <el-switch size="large" v-model="isRight"></el-switch>
              </div>
            </div>
          </div>
        </template>
        <template #footer>
          <div style="flex: auto">
            <el-button @click="cancelPreview">取消</el-button>
            <el-button type="primary" @click="confirmPreview">保存</el-button>
          </div>
        </template>
      </el-drawer>

      <!-- 全局配置 -->
      <el-dialog
        v-model="isCommon"
        title="全局配置"
        width="32vw"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
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
                  <div class="tab-item-label">自动打开文件</div>
                  <div class="tab-item-value"><el-switch v-model="autoOpenFile"></el-switch></div>
                </div>
                <div class="tab-item">
                  <div class="tab-item-label">自动打开文件夹</div>
                  <div class="tab-item-value"><el-switch v-model="autoOpenFolder"></el-switch></div>
                </div>
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
                  <div class="tab-item-label">忽略文件夹</div>
                  <div class="tab-item-value">
                    <el-select
                      v-model="ignoreFolderList"
                      placeholder="请选择需要忽略的文件夹"
                      style="width: 250px"
                    >
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </div>
                </div>
                <div class="tab-item">
                  <div class="tab-item-label">忽略以 "." 开头的文件夹</div>
                  <div class="tab-item-value">
                    <el-switch v-model="ignoreDotFolder"></el-switch>
                  </div>
                </div>

                <div class="tab-item">
                  <div class="tab-item-label">只扫描文件夹</div>
                  <div class="tab-item-value"><el-switch v-model="onlyScanFolder"></el-switch></div>
                </div>

                <div class="tab-item">
                  <div class="tab-item-label">忽略以 "." 开头的文件</div>
                  <div class="tab-item-value"><el-switch v-model="ignoreDotFile"></el-switch></div>
                </div>

                <div class="tab-item">
                  <div class="tab-item-label">忽略文件类型</div>
                  <div class="tab-item-value">
                    <el-select
                      v-model="ignoreFileList"
                      placeholder="请选择需要忽略的文件类型"
                      style="width: 250px"
                    >
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </div>
                </div>

                <div class="tab-item">
                  <div class="tab-item-label">扫描深度</div>
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
                  <div class="tab-item-label">自动打开文件</div>
                  <div class="tab-item-value"><el-switch v-model="autoOpenFile"></el-switch></div>
                </div>
                <div class="tab-item">
                  <div class="tab-item-label">自动打开文件夹</div>
                  <div class="tab-item-value"><el-switch v-model="autoOpenFolder"></el-switch></div>
                </div>
              </div>
            </el-tab-pane>
            <!-- 备份和恢复 -->
            <el-tab-pane>
              <template #label>
                <span class="custom-tabs-label">
                  <el-icon><CircleCheck /></el-icon>
                  <span>备份和恢复</span>
                </span>
              </template>
              <div>
                <div class="tab-item">
                  <div class="tab-item-label">自动打开文件</div>
                  <div class="tab-item-value"><el-switch v-model="autoOpenFile"></el-switch></div>
                </div>
                <div class="tab-item">
                  <div class="tab-item-label">自动打开文件夹</div>
                  <div class="tab-item-value"><el-switch v-model="autoOpenFolder"></el-switch></div>
                </div>
              </div>
            </el-tab-pane>
            <!-- 重置 -->
            <el-tab-pane>
              <template #label>
                <span class="custom-tabs-label">
                  <el-icon><Refresh /></el-icon>
                  <span>重置</span>
                </span>
              </template>
              <div>
                <div class="tab-item">
                  <div class="tab-item-label">自动打开文件</div>
                  <div class="tab-item-value"><el-switch v-model="autoOpenFile"></el-switch></div>
                </div>
                <div class="tab-item">
                  <div class="tab-item-label">自动打开文件夹</div>
                  <div class="tab-item-value"><el-switch v-model="autoOpenFolder"></el-switch></div>
                </div>
              </div>
            </el-tab-pane>
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
                  <div class="tab-item-value">v1.0.0</div>
                </div>
                <div class="tab-item">
                  <div class="tab-item-label">开发者</div>
                  <div class="tab-item-value">itchao</div>
                </div>
                <div class="tab-item">
                  <div class="tab-item-label">备注</div>
                  <div class="tab-item-value">欢迎 Star，有问题请联系作者</div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
        <template #footer>
          <div>
            <el-button @click="cancelCommon">取消</el-button>
            <el-button type="primary" @click="saveCommon">保存</el-button>
          </div>
        </template>
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

    .left {
      padding: 10px;
      flex: 1;
      background-color: #1ff;
      height: 82vh;
      margin-right: 20px;
      border-radius: 4px;

      .row-tree {
        height: 18px !important;
      }
    }

    .right {
      padding: 10px;
      flex: 1;
      background-color: #88f;
      height: 82vh;
      border-radius: 4px;
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
      margin-right: 10px;
      min-width: 150px;
    }
  }
}
</style>
