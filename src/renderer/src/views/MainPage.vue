<!--
 * @Version    : v1.00
 * @Author     : itchaox
 * @Date       : 2024-05-04 20:32
 * @LastAuthor : itchaox
 * @LastTime   : 2024-05-05 13:26
 * @desc       : 
-->
<script setup lang="ts">
  import { useScanStore } from '@renderer/stores/scan';

  const scanStore = useScanStore();

  async function importFile() {
    await window.api.fileSelect();
    await window.api.fileSelectReply();
  }
</script>

<template>
  <el-button
    type="primary"
    @click="importFile"
    >扫描</el-button
  >
  <el-button>设置</el-button>

  <div>{{ scanStore.scanResult }}</div>
</template>

<style scoped></style>
