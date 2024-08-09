<!--
 * @Version    : v1.00
 * @Author     : Wang Chao
 * @Date       : 2024-08-09 16:21
 * @LastAuthor : itchaox
 * @LastTime   : 2024-08-10 00:06
 * @desc       : 预览区1
-->
<script setup lang="ts">
console.log('ContentPreview.vue')
</script>

<template>
  <div class="home">
    <div class="right">
      <div class="preview-tools" v-if="previewList.length > 0">
        <div style="display: flex; align-items: center">
          <el-icon
            class="tools-icon"
            size="24"
            @click="isPreview = true"
            :title="$t('yu-lan-qu-pei-zhi')"
            ><Setting
          /></el-icon>
        </div>
        <div>
          <el-icon class="tools-icon" size="24" @click="copyTree" :title="$t('fu-zhi-wen-ben')"
            ><CopyDocument
          /></el-icon>

          <el-icon class="tools-icon" size="24" @click="exportFile" :title="$t('dao-chu-wen-ben')"
            ><Download
          /></el-icon>

          <el-icon class="tools-icon" size="24" @click="copyImg" :title="$t('fu-zhi-tu-pian')"
            ><Picture
          /></el-icon>

          <el-icon class="tools-icon" @click="exportImg" size="24" :title="$t('dao-chu-tu-pian')"
            ><Camera
          /></el-icon>
        </div>
      </div>

      <div class="tree-scroller" ref="scrollRight" @scroll="handleScroll(scrollRight, scrollLeft)">
        <div id="capture">
          <pre class="tree-node" v-for="item in previewList" :key="item.id">{{ item.value }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home {
  font-size: 14px;
}
</style>
