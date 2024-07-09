<!--
 * @Version    : v1.00
 * @Author     : itchaox
 * @Date       : 2024-07-06 11:57
 * @LastAuthor : itchaox
 * @LastTime   : 2024-07-09 10:24
 * @desc       :
-->
<script setup lang="ts">
const { IPC_FOLDER_SELECT } = window.api as any

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
}

function check() {
  console.log('Current tree data:', treeData.value)
}
</script>

<template>
  <div class="main-page">
    <div class="operation">
      <div>
        <el-button type="primary" @click="scan">扫描</el-button>
        <el-button type="warning" @click="set">设置</el-button>
      </div>
      <div><el-button type="primary" @click="exportFile">导出</el-button></div>
    </div>
    <el-divider />

    <div class="content">
      <div class="left" @click="check">
        <div>编辑区</div>

        <!-- <div>{{ treeData }}</div> -->

        <recycle-scroller
          :items="treeData"
          :item-size="18"
          key-field="id"
          v-slot="{ item, index }"
          class="list"
        >
          <div class="display: flex">
            <!-- 树枝 -->
            <span>
              <pre style="width: 100px">{{ item.tree }}</pre>
            </span>
            <!-- 文件信息 -->
            <span style="display: inline-flex">
              <!-- 文件名 -->
              <pre>{{ item.name }}</pre>
              <!-- 扩展名 -->
              <pre v-if="item.ext">{{ item.ext }}</pre>
              <!-- 备注 -->
              <pre v-if="item.note"> // {{ item.note }}</pre>

              <input type="text" />
            </span>
          </div>
        </recycle-scroller>
      </div>
      <div class="right">预览区</div>
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
      height: 85vh;
      margin-right: 20px;
      border-radius: 4px;
    }

    .right {
      padding: 10px;
      flex: 1;
      background-color: pink;
      height: 85vh;
      border-radius: 4px;
    }
  }
}
</style>
