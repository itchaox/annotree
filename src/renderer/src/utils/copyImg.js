/*
 * @Version    : v1.00
 * @Author     : itchaox
 * @Date       : 2024-08-10 00:10
 * @LastAuthor : Wang Chao
 * @LastTime   : 2024-09-19 16:21
 * @desc       :
 */

import html2canvas from 'html2canvas'

export function copyImg(id) {
  const i18n = window.i18n
  const { t } = i18n.global

  html2canvas(document.querySelector(id), {
    backgroundColor: '#f8f9fa',
    useCORS: true, //支持图片跨域
    scale: 1 //设置放大的倍数
  }).then((canvas) => {
    canvas.toBlob(async (blob) => {
      try {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
        ElMessage({
          message: t('tu-pian-yi-fu-zhi-dao-jian-tie-ban'),
          type: 'success',
          duration: 1500,
          showClose: true
        })
      } catch (err) {
        console.error('无法复制图片到剪贴板!', err)
      }
    }, 'image/png')
  })
}
