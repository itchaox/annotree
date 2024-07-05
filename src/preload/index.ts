/*
 * @Version    : v1.00
 * @Author     : itchaox
 * @Date       : 2024-05-04 19:35
 * @LastAuthor : itchaox
 * @LastTime   : 2024-05-05 13:26
 * @desc       :
 */
import { contextBridge, ipcRenderer } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';
import scan from '../utils/scan';

import { useScanStore } from '@/renderer/src/stores/scan';

const scanStore = useScanStore();

// Custom APIs for renderer
const api = {
  fileSelect: (title) => ipcRenderer.send('file-select', title),
  fileSelectReply: () =>
    ipcRenderer.on('file-select-reply', async (event, folderPath) => {
      let res = await scan({
        folderPath,
        ignorePath: [],
        ignoreExt: [],
        ignoreFile: false,
        ignoreDotStartFile: false,
        ignoreDotStartFolder: false,
        deep: 0,
      });

      scanStore.scanResult = res;
      console.log('Selected folder:', res);
    }),
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('api', api);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
}
