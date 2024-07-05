/*
 * @Version    : v1.00
 * @Author     : itchaox
 * @Date       : 2024-05-05 13:12
 * @LastAuthor : itchaox
 * @LastTime   : 2024-05-05 13:33
 * @desc       : 扫描相关
 */

import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useScanStore = defineStore('scan', () => {
  // 扫描结果
  const scanResult = ref([]);

  function setScanResult(data) {
    scanResult.value = data;
  }

  return {
    scanResult,
    setScanResult,
  };
});
