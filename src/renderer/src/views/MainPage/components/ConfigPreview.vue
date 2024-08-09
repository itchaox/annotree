<!--
 * @Version    : v1.00
 * @Author     : Wang Chao
 * @Date       : 2024-08-09 16:20
 * @LastAuthor : itchaox
 * @LastTime   : 2024-08-09 23:33
 * @desc       : 预览配置1
-->
<script setup lang="ts">
const isPreview = defineModel('isPreview')
const noteFormat = defineModel('noteFormat')
const minBridge = defineModel('minBridge')
const bridgeChar = defineModel('bridgeChar')
const showBridge = defineModel('showBridge')
</script>

<template>
  <div class="config-preview">
    <!-- 预览配置 -->
    <el-drawer v-model="isPreview" direction="ltr" :modal="true" @close="isPreview = false">
      <template #header>
        <h4>{{ $t('yu-lan-pei-zhi') }}</h4>
      </template>
      <template #default>
        <div class="preview-config">
          <div class="preview-item">
            <div class="preview-label">{{ $t('zhu-shi-ge-shi-hua') }}</div>
            <div class="preview-value">
              <el-input
                v-model="noteFormat"
                :placeholder="$t('qing-shu-ru-ge-shi-hua-zi-fu-chuan')"
              ></el-input>
            </div>
          </div>

          <div class="preview-item">
            <div class="preview-label">{{ $t('qiao-liang-zui-duan-zi-fu-shu') }}</div>
            <div class="preview-value">
              <el-input-number
                v-model="minBridge"
                :placeholder="$t('qing-shu-ru-qiao-liang-zui-duan-zi-fu-shu')"
                :min="0"
              ></el-input-number>
            </div>
          </div>

          <div class="preview-item">
            <div class="preview-label">{{ $t('qiao-liang-tian-chong-zi-fu') }}</div>
            <div class="preview-value">
              <el-input
                v-model="bridgeChar"
                :placeholder="$t('qing-shu-ru-dan-zi-jie-tian-chong-zi-fu')"
                :maxLength="1"
              ></el-input>
            </div>
          </div>

          <div class="preview-item">
            <div class="preview-label">{{ $t('shi-zhong-xian-shi-qiao-liang') }}</div>
            <div class="preview-value">
              <el-switch size="large" v-model="showBridge"></el-switch>
            </div>
          </div>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<style lang="scss" scoped>
.config-preview {
  /* 预览配置 */
  .preview-config {
    .preview-item {
      display: flex;
      align-items: center;
      margin-bottom: 20px;

      .preview-label {
        width: 125px;
      }

      .preview-value {
        margin-left: 15px;
      }
    }
  }
}
</style>
