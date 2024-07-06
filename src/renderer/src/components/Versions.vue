<!--
 * @Version    : v1.00
 * @Author     : itchaox
 * @Date       : 2024-07-06 11:28
 * @LastAuthor : itchaox
 * @LastTime   : 2024-07-06 11:36
 * @desc       :
-->
<script setup lang="ts">
import { reactive,ref } from 'vue'

const versions = reactive({ ...window.electron.process.versions })

const name = ref(window.api)
</script>

<template>
  <ul class="versions">
    <li class="electron-version">Electron v{{ versions.electron }}</li>
    <li class="chrome-version">Chromium v{{ versions.chrome }}</li>
    <li class="node-version">Node v{{ versions.node }}</li>
    <li>名字 {{  name }}</li>
  </ul>
</template>
