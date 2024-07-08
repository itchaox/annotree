/*
 * @Version    : v1.00
 * @Author     : itchaox
 * @Date       : 2024-07-08 23:36
 * @LastAuthor : itchaox
 * @LastTime   : 2024-07-08 23:36
 * @desc       :
 */
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

const store = createPinia()
store.use(
  createPersistedState({
    storage: sessionStorage,
    auto: true
  })
)

export { store }
