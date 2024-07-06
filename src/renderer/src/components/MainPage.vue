<!--
 * @Version    : v1.00
 * @Author     : itchaox
 * @Date       : 2024-07-06 11:57
 * @LastAuthor : itchaox
 * @LastTime   : 2024-07-06 15:25
 * @desc       :
-->
<script setup lang="ts">
const { IPC_FOLDER_SELECT, IPC_FOLDER_SELECT_REPLY } = window.api as any

// 扫描
function scan() {
  IPC_FOLDER_SELECT()
  IPC_FOLDER_SELECT_REPLY()
}
</script>

<template>
  <div class="main-page">
    <el-button type="primary" @click="scan">扫描</el-button>
    <el-button type="warning">设置</el-button>
  </div>
</template>

<style lang="scss" scoped>
.main-page {
  padding: 14px;
}
</style>
