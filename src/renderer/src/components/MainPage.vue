<!--
 * @Version    : v1.00
 * @Author     : itchaox
 * @Date       : 2024-07-06 11:57
 * @LastAuthor : itchaox
 * @LastTime   : 2024-07-10 10:19
 * @desc       :
-->
<script setup lang="ts">
const { IPC_FOLDER_SELECT, EXPORT_TREE_TEXT } = window.api as any
import width from 'string-width'

import { ref } from 'vue'

const treeData = ref(null)

// 扫描
async function scan() {
  try {
    // 更新数据
    const result = await IPC_FOLDER_SELECT()
    treeData.value = result
    console.log('Scan completed, data:', treeData.value)
    console.log('最大宽度', getMaxWidth(treeData.value))
  } catch (error) {
    console.error('Scan failed:', error)
  }
}

// 设置
function set() {
  // 设置弄成一个弹窗操作
}

// 导出
function exportFile() {
  console.log('导出操作')
  // ipc 通信需要序列化
  EXPORT_TREE_TEXT(JSON.stringify(treeData.value))
}

// 删除
function deleteItem(index) {
  console.log(index)
}

// 获取最大宽度
function getMaxWidth(result) {
  console.log('🚀  result:', result)
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
  _previewFormat.value = previewFormat.value
  _showBridge.value = showBridge.value
  _isRight.value = isRight.value
}

// 显示预览配置
const isPreview = ref(false)

// 预览取消按钮
function cancelPreview() {
  isPreview.value = false

  bridgeChar.value = _bridgeChar.value
  minBridge.value = _minBridge.value
  previewFormat.value = _previewFormat.value
  showBridge.value = _showBridge.value
  isRight.value = _isRight.value
}

// 预览确定按钮
function confirmPreview() {
  console.log('previewFormat', previewFormat)
  isPreview.value = false
}

// 备注格式化
const previewFormat = ref('// {note}')
const _previewFormat = ref()

// 桥梁最短字符数
const minBridge = ref(0)
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
</script>

<template>
  <div class="main-page">
    <div class="operation">
      <div>
        <el-button type="primary" @click="scan">扫描</el-button>
        <el-button type="warning" @click="set">设置</el-button>
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
        <recycle-scroller
          class="tree-scroller"
          :items="treeData"
          :item-size="18"
          key-field="id"
          v-slot="{ item }"
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
              <pre v-if="item.note" style="color: rgba(255, 94, 94, 0.8)"> // {{ item.note }}</pre>
            </span>
          </div>
        </recycle-scroller>
      </div>

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
                <el-input v-model="previewFormat" placeholder="请输入格式化字符串"></el-input>
              </div>
            </div>

            <div class="preview-item">
              <div class="preview-label">桥梁最短字符数</div>
              <div class="preview-value">
                <el-input-number
                  v-model="minBridge"
                  placeholder="请输入桥梁最短字符数"
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
            <el-button type="primary" @click="confirmPreview">确定</el-button>
          </div>
        </template>
      </el-drawer>
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
</style>
