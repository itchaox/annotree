/*
 * @Version    : v1.00
 * @Author     : itchaox
 * @Date       : 2024-08-10 00:22
 * @LastAuthor : itchaox
 * @LastTime   : 2024-08-10 00:25
 * @desc       :
 */

// 复制树
export async function copyTree(list, toClipboard) {
  // 直接拿到处理后的tree
  const i18n = window.i18n
  const { t } = i18n.global

  // 显示图标
  const result = list.map((item) => item?.value)

  // 换行分割数组至字符串
  const data = result.join('\n')

  try {
    // 复制
    await toClipboard(data)
    ElMessage({
      message: t('copySuccess'),
      type: 'success',
      duration: 1500,
      showClose: true
    })
    // 复制成功
  } catch (e) {
    // 复制失败
  }
}
