<!--
 * @Version    : v1.00
 * @Author     : itchaox
 * @Date       : 2024-07-06 11:57
 * @LastAuthor : itchaox
 * @LastTime   : 2024-07-09 12:50
 * @desc       :
-->
<script setup lang="ts">
const { IPC_FOLDER_SELECT, EXPORT_TREE_TEXT } = window.api as any

import { ref } from 'vue'

const treeData = ref(null)

// 扫描
async function scan() {
  try {
    // 更新数据
    const result = await IPC_FOLDER_SELECT()
    treeData.value = result
    console.log('Scan completed, data:', treeData.value)
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

function check() {
  console.log('Current tree data:', treeData.value)
}

// 删除
function deleteItem(index) {
  console.log(index)
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
      <div class="left" @click="check">
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
          <h1>预览区</h1>
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
  }
}
</style>
