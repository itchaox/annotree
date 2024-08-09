<!--
 * @Version    : v1.00
 * @Author     : Wang Chao
 * @Date       : 2024-08-09 16:20
 * @LastAuthor : itchaox
 * @LastTime   : 2024-08-09 23:54
 * @desc       : 全局配置1
-->
<script setup lang="ts">
import { ref } from 'vue'
import packageJson from '../../../../../../package.json'
import { extList } from '../../../constants/constants.js'

// Define models
const isCommon = defineModel('isCommon')
const languageId = defineModel('languageId')
const autoOpenFile = defineModel('autoOpenFile')
const isEggshell = defineModel('isEggshell')
const syncScroll = defineModel('syncScroll')
const showIcon = defineModel('showIcon')
const folderSuffix = defineModel('folderSuffix')
const isCache = defineModel('isCache')
const isConfig = defineModel('isConfig')
const ignoreFolderList = defineModel('ignoreFolderList')
const ignoreDotFolder = defineModel('ignoreDotFolder')
const onlyScanFolder = defineModel('onlyScanFolder')
const ignoreDotFile = defineModel('ignoreDotFile')
const ignoreFileList = defineModel('ignoreFileList')
const scanDeep = defineModel('scanDeep')
const defaultFileName = defineModel('defaultFileName')

defineProps<{
  folderList: any[] // 指定 folderList 是一个字符串数组
}>()

// 语言列表
const languageList = ref([
  {
    id: 'en',
    name: 'English'
  },
  {
    id: 'zh',
    name: '简体中文'
  }
])

const emit = defineEmits(['resetCache'])

function resetCache() {
  emit('resetCache')
}
</script>

<template>
  <div class="home">
    <!-- 全局配置 -->
    <el-dialog
      v-model="isCommon"
      :title="$t('quan-ju-pei-zhi')"
      width="40vw"
      :close-on-click-modal="true"
      :close-on-press-escape="true"
      @close="isCommon = false"
    >
      <div class="dialog-body">
        <el-tabs type="border-card" class="demo-tabs">
          <!-- 通用 -->
          <el-tab-pane>
            <template #label>
              <span class="custom-tabs-label">
                <el-icon><house /></el-icon>
                <span>{{ $t('tong-yong') }}</span>
              </span>
            </template>
            <div>
              <div class="tab-item">
                <div class="tab-item-label">
                  {{ $t('yu-yan') }}
                  <el-tooltip
                    effect="dark"
                    :content="$t('pei-zhi-ruan-jian-xian-shi-yu-yan')"
                    placement="top"
                  >
                    <el-icon size="16" style="margin-left: 3px"><Warning /></el-icon>
                  </el-tooltip>
                </div>
                <div class="tab-item-value">
                  <el-select
                    v-model="languageId"
                    :placeholder="$t('qing-xuan-ze-yu-yan')"
                    style="width: 110px"
                  >
                    <el-option
                      v-for="item in languageList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </div>
              </div>
              <div class="tab-item">
                <div class="tab-item-label">
                  {{ $t('zi-dong-da-kai-wen-jian') }}
                  <el-tooltip
                    effect="dark"
                    :content="$t('dao-chu-wen-jian-hou-zi-dong-da-kai')"
                    placement="top"
                  >
                    <el-icon size="16" style="margin-left: 3px"><Warning /></el-icon>
                  </el-tooltip>
                </div>
                <div class="tab-item-value"><el-switch v-model="autoOpenFile"></el-switch></div>
              </div>
              <div class="tab-item">
                <div class="tab-item-label">
                  {{ $t('dao-chu-hou-zhan-shi-cai-dai') }}
                  <el-tooltip
                    effect="dark"
                    :content="$t('dao-chu-cheng-gong-hou-zi-dong-zhan-shi-cai-dan')"
                    placement="top"
                  >
                    <el-icon size="16" style="margin-left: 3px"><Warning /></el-icon>
                  </el-tooltip>
                </div>
                <div class="tab-item-value"><el-switch v-model="isEggshell"></el-switch></div>
              </div>
              <div class="tab-item">
                <div class="tab-item-label">
                  {{ $t('tong-bu-gun-dong') }}
                  <el-tooltip
                    effect="dark"
                    :content="$t('bian-ji-qu-he-yu-lan-qu-shi-fou-tong-bu-gun-dong')"
                    placement="top"
                  >
                    <el-icon size="16" style="margin-left: 3px"><Warning /></el-icon>
                  </el-tooltip>
                </div>
                <div class="tab-item-value"><el-switch v-model="syncScroll"></el-switch></div>
              </div>
              <div class="tab-item">
                <div class="tab-item-label">
                  {{ $t('xian-shi-tu-biao') }}
                  <el-tooltip
                    effect="dark"
                    :content="$t('shi-fou-xian-shi-wen-jian-jia-he-wen-jian-de-tu-biao')"
                    placement="top"
                  >
                    <el-icon size="16" style="margin-left: 3px"><Warning /></el-icon>
                  </el-tooltip>
                </div>
                <div class="tab-item-value"><el-switch v-model="showIcon"></el-switch></div>
              </div>
              <div class="tab-item">
                <div class="tab-item-label">{{ $t('wen-jian-jia-jie-wei-xian-shi') }}</div>
                <div class="tab-item-value"><el-switch v-model="folderSuffix"></el-switch></div>
              </div>
              <div class="tab-item">
                <div class="tab-item-label">{{ $t('zhong-zhi-fan-wei') }}</div>
                <div class="tab-item-value" style="display: flex; align-items: center">
                  <div style="margin-right: 30px">
                    <el-checkbox v-model="isCache" :label="$t('huan-cun')" />
                    <el-checkbox v-model="isConfig" :label="$t('she-zhi')" />
                  </div>
                  <div>
                    <el-popconfirm
                      :title="$t('que-ren-zhong-zhi-suo-you-shu-ju-ma')"
                      @confirm="resetCache"
                      confirm-button-type="danger"
                      width="210"
                      :confirm-button-text="$t('que-ding')"
                      :cancel-button-text="$t('qu-xiao')"
                    >
                      <template #reference>
                        <el-button type="danger" :disabled="!isCache && !isConfig">
                          <el-icon><Refresh /></el-icon>
                          <span> {{ $t('zhong-zhi') }} </span>
                        </el-button>
                      </template>
                    </el-popconfirm>
                  </div>
                </div>
              </div>
              <!-- FIXME 不生效，暂时注释 -->
              <!-- <div class="tab-item">
                  <div class="tab-item-label">自动打开文件夹</div>
                  <div class="tab-item-value"><el-switch v-model="autoOpenFolder"></el-switch></div>
                </div> -->
            </div>
          </el-tab-pane>
          <!-- FIXME 扫描 -->
          <el-tab-pane>
            <template #label>
              <span class="custom-tabs-label">
                <el-icon><Search /></el-icon>
                <span>{{ $t('sao-miao') }}</span>
              </span>
            </template>
            <div>
              <div class="tab-item">
                <div class="tab-item-label">
                  {{ $t('hu-lve-wen-jian-jia') }}
                  <el-tooltip
                    effect="dark"
                    :content="
                      $t(
                        'hu-lve-bu-xu-yao-sao-miao-de-wen-jian-jia-ti-gao-sao-miao-xiao-shuai-ke-xin-zeng-xu-yao-guo-lv-de-wen-jian-jia-li-ru-macos-xia-wei-builddistwindows-xia-wei-builddist'
                      )
                    "
                    placement="top"
                  >
                    <el-icon size="16" style="margin-left: 3px"><Warning /></el-icon>
                  </el-tooltip>
                </div>
                <div class="tab-item-value">
                  <el-select
                    v-model="ignoreFolderList"
                    :placeholder="$t('qing-xuan-ze-xu-yao-hu-lve-de-wen-jian-jia')"
                    style="width: 325px"
                    multiple
                    collapse-tags
                    :max-collapse-tags="3"
                    filterable
                    default-first-option
                    allow-create
                  >
                    <el-option
                      v-for="item in folderList.filter((i) => i)"
                      :key="item"
                      :label="item"
                      :value="item"
                    />
                  </el-select>
                </div>
              </div>
              <div class="tab-item">
                <div class="tab-item-label">
                  {{ $t('hu-lve-yi-kai-tou-de-wen-jian-jia') }}
                  <el-tooltip
                    effect="dark"
                    :content="
                      $t(
                        'zhe-lei-wen-jian-jia-zai-macos-he-linux-shang-shi-mo-ren-yin-cang-de-wen-jian-jia'
                      )
                    "
                    placement="top"
                  >
                    <el-icon size="16" style="margin-left: 3px"><Warning /></el-icon>
                  </el-tooltip>
                </div>
                <div class="tab-item-value">
                  <el-switch v-model="ignoreDotFolder"></el-switch>
                </div>
              </div>

              <div class="tab-item">
                <div class="tab-item-label">
                  {{ $t('zhi-sao-miao-wen-jian-jia') }}
                  <el-tooltip
                    effect="dark"
                    :content="$t('hu-lve-suo-you-wen-jian-zhi-sao-miao-wen-jian-jia')"
                    placement="top"
                  >
                    <el-icon size="16" style="margin-left: 3px"><Warning /></el-icon>
                  </el-tooltip>
                </div>
                <div class="tab-item-value"><el-switch v-model="onlyScanFolder"></el-switch></div>
              </div>

              <div class="tab-item">
                <div class="tab-item-label">
                  {{ $t('hu-lve-yi-kai-tou-de-wen-jian') }}
                  <el-tooltip
                    effect="dark"
                    :content="
                      $t(
                        'zhe-lei-wen-jian-zai-macos-he-linux-shang-shi-mo-ren-yin-cang-de-wen-jian'
                      )
                    "
                    placement="top"
                  >
                    <el-icon size="16" style="margin-left: 3px"><Warning /></el-icon>
                  </el-tooltip>
                </div>
                <div class="tab-item-value"><el-switch v-model="ignoreDotFile"></el-switch></div>
              </div>

              <div class="tab-item">
                <div class="tab-item-label">
                  {{ $t('hu-lve-wen-jian-lei-xing') }}
                  <el-tooltip
                    effect="dark"
                    :content="
                      $t(
                        'xuan-ze-hu-lve-bu-xu-yao-de-wen-jian-lei-xing-yi-ti-gao-sao-miao-xiao-shuai-ke-xin-zeng-xu-yao-guo-lv-de-wen-jian-lei-xing'
                      )
                    "
                    placement="top"
                  >
                    <el-icon size="16" style="margin-left: 3px"><Warning /></el-icon>
                  </el-tooltip>
                </div>
                <div class="tab-item-value">
                  <el-select
                    v-model="ignoreFileList"
                    :placeholder="$t('qing-xuan-ze-xu-yao-hu-lve-de-wen-jian-lei-xing')"
                    filterable
                    style="width: 325px"
                    multiple
                    collapse-tags
                    default-first-option
                    allow-create
                    :max-collapse-tags="3"
                  >
                    <el-option-group
                      v-for="group in extList"
                      :key="group.label"
                      :label="group.label"
                    >
                      <el-option
                        v-for="item in group.options"
                        :key="item"
                        :label="item"
                        :value="item"
                      />
                    </el-option-group>
                  </el-select>
                </div>
              </div>

              <div class="tab-item">
                <div class="tab-item-label">
                  {{ $t('sao-miao-shen-du') }}
                  <el-tooltip
                    effect="dark"
                    :content="
                      $t(
                        'she-zhi-sao-miao-mu-lu-de-shen-du-0-wei-suo-you-shen-du-mei-di-zeng-yi-ge-shu-zi-ze-dai-biao-sao-miao-shen-du-1'
                      )
                    "
                    placement="top"
                  >
                    <el-icon size="16" style="margin-left: 3px"><Warning /></el-icon>
                  </el-tooltip>
                </div>
                <div class="tab-item-value">
                  <el-input-number v-model="scanDeep" :min="0"></el-input-number>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <!-- 导出文本 -->
          <el-tab-pane>
            <template #label>
              <span class="custom-tabs-label">
                <el-icon><Download /></el-icon>
                <span>{{ $t('dao-chu-wen-ben') }}</span>
              </span>
            </template>
            <div>
              <div class="tab-item">
                <div style="width: 100px">{{ $t('mo-ren-ming-cheng') }}</div>
                <div>
                  <el-input
                    style="width: 380px; font-size: 12px"
                    v-model="defaultFileName"
                    :placeholder="$t('qing-shu-ru-mo-ren-ming-cheng')"
                  >
                    <template #append>.txt</template>
                  </el-input>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <!-- 关于 -->
          <el-tab-pane>
            <template #label>
              <span class="custom-tabs-label">
                <el-icon><WarningFilled /></el-icon>
                <span>{{ $t('guan-yu') }}</span>
              </span>
            </template>
            <div>
              <div class="tab-item">
                <div class="tab-item-label">{{ $t('kai-fa-zhe') }}</div>
                <div class="tab-item-value">
                  <el-link type="primary" href="https://github.com/itchaox" target="_blank"
                    >Wang Chao</el-link
                  >
                </div>
              </div>
              <div class="tab-item">
                <div class="tab-item-label">{{ $t('qi-ta-xin-xi') }}</div>
                <div class="tab-item-value">
                  {{ $t('kai-yuan') }}

                  <el-link
                    type="primary"
                    href="https://github.com/itchaox/annotree"
                    target="_blank"
                    >{{ $t('github-di-zhi') }}</el-link
                  >{{ $t('gan-xie-star') }}
                </div>
              </div>
              <div class="tab-item">
                <div class="tab-item-label">{{ $t('guan-fang-wen-dang') }}</div>
                <div class="tab-item-value">
                  <el-link type="primary" href="https://www.annotree.com" target="_blank">{{
                    $t('dian-wo-cha-kan')
                  }}</el-link>
                </div>
              </div>

              <div class="tab-item-center">
                <img src="../../../assets/images/icon-128.png" alt="" />
                <div class="tab-item-center-title">Annotree</div>
                <div class="tab-item-center-version">v{{ packageJson.version }}</div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.home {
  font-size: 14px;
  /* 全局配置 */
  .dialog-body {
    .custom-tabs-label {
      display: flex;
      align-items: center;
      span {
        margin-left: 5px;
      }
    }
    .tab-item {
      display: flex;
      align-items: center;
      margin-bottom: 10px;

      .tab-item-label {
        display: flex;
        align-items: center;
        margin-right: 10px;
        width: 188px;
      }

      .tab-item-value {
        width: 400px;
      }
    }

    .tab-item-center {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 15px;

      .tab-item-center-title {
        padding: 10px;
        font-size: 24px;
        font-weight: 700;
      }

      .tab-item-center-version {
        font-size: 20px;
        color: #00000090;
      }
    }
  }
}
</style>
