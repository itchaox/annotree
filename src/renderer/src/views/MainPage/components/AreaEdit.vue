<!--
 * @Version    : v1.00
 * @Author     : Wang Chao
 * @Date       : 2024-08-09 16:21
 * @LastAuthor : itchaox
 * @LastTime   : 2024-08-10 00:05
 * @desc       : 编辑区1
-->
<script setup lang="ts">
console.log('ContentEdit.vue')
</script>

<template>
  <div class="home">
    <div class="left">
      <div
        class="edit-tools"
        style="display: flex; align-items: center; justify-content: space-between"
        v-if="treeData.length > 0"
      >
        <div>
          <el-icon
            size="24"
            class="tools-icon"
            @click="refreshNote"
            :title="$t('zhong-zhi-zhu-shi')"
            ><Refresh
          /></el-icon>
        </div>

        <!-- TODO 表情 -->
        <div style="position: relative">
          <el-icon
            size="24"
            :title="$t('xuan-ze-biao-qing')"
            @click.stop="isShowEmoji = !isShowEmoji"
            class="tools-icon"
            ><Star
          /></el-icon>
          <Picker
            @click.stop="isShowEmoji = true"
            v-if="isShowEmoji"
            style="position: absolute; top: 45px; left: 20px; z-index: 2"
            :data="emojiIndex"
            set="google"
            @select="selectEmoji"
            :emojiSize="26"
            :emojiTooltip="true"
            :showPreview="false"
            :i18n="{
              search: t('p1'),
              notfound: t('p2'),
              categories: {
                search: t('p3'),
                recent: t('p4'),
                smileys: t('p5'),
                people: t('p6'),
                nature: t('p7'),
                foods: t('p8'),
                activity: t('p9'),
                places: t('p10'),
                objects: t('p11'),
                symbols: t('p12'),
                flags: t('p13'),
                custom: t('p14')
              }
            }"
          />
        </div>
      </div>

      <div @scroll="handleScroll(scrollLeft, scrollRight)" ref="scrollLeft" class="tree-scroller">
        <div
          v-for="(item, index) in treeData"
          :class="{
            'tree-node-active': isShiftTab ? currentIndex - 1 === index : currentIndex + 1 === index
          }"
          :key="item.id"
          class="tree-node"
          @click="nodeClick(index)"
        >
          <div style="display: flex">
            <div style="display: flex; flex: 1">
              <div
                class="folder-icon"
                style="width: 15px"
                v-if="item?.isDirectory"
                @click="foldNode(item)"
              >
                <el-icon color="#00000088" v-if="item.isShowElements"><CaretBottom /></el-icon>
                <el-icon color="#00000088" v-else><CaretRight /></el-icon>
              </div>
              <div v-else style="width: 15px"></div>
              <!-- 树枝 -->
              <span class="row-tree">
                <pre>{{ item.tree }}</pre>
              </span>
              <!-- 文件信息 -->
              <span class="row-info">
                <!-- 文件名 -->
                <div style="display: flex">
                  <pre>{{ showIcon ? (item?.isDirectory ? '📁 ' : '📄 ') : '' }}</pre>
                  <pre>{{ item.name }}</pre>
                  <!-- 扩展名 -->
                  <pre v-if="item.ext">{{ item.ext }}</pre>
                </div>
              </span>
            </div>

            <div>
              <!-- 注释 -->
              <el-input
                style="height: 20px; width: 120px; margin-right: 2px"
                v-model="item.note"
                size="small"
                :placeholder="$t('qing-shu-ru-zhu-shi')"
                clearable
                :tabindex="index + 1"
                @change="inputChange(item)"
                @input="handleInputChange(item)"
              ></el-input>

              <el-button link type="danger" @click="removeNode(item)"
                ><el-icon><Delete /></el-icon
              ></el-button>
            </div>
          </div>
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
