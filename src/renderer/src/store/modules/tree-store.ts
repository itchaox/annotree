/*
 * @Version    : v1.00
 * @Author     : yanglong
 * @Date       : 2023-05-17 13:55
 * @LastAuthor : itchaox
 * @LastTime   : 2024-07-09 09:41
 * @desc       :
 */

import { store } from '../index'
import { defineStore } from 'pinia'

export const useTreeStore = defineStore({
  id: 'treeStore',
  state: (): any => ({
    data: {}
  }),
  actions: {
    setData(data) {
      this.data = data
    }
  }
})

export function useTreeStoreHook() {
  return useTreeStore(store)
}
