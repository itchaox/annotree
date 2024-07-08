<!--
 * @Version    : v1.00
 * @Author     : itchaox
 * @Date       : 2024-07-06 11:57
 * @LastAuthor : itchaox
 * @LastTime   : 2024-07-07 00:12
 * @desc       :
-->
<script setup lang="ts">
const { IPC_FOLDER_SELECT, IPC_FOLDER_SELECT_REPLY } = window.api as any

// 扫描
function scan() {
  IPC_FOLDER_SELECT()
  IPC_FOLDER_SELECT_REPLY()
}

// 设置
function set() {
  // 设置弄成一个弹窗操作
}

// 导出
function exportFile() {
  console.log('导出操作')
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
      <div class="left">编辑区</div>
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
