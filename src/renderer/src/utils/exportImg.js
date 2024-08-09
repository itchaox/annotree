/*
 * @Version    : v1.00
 * @Author     : itchaox
 * @Date       : 2024-08-10 00:07
 * @LastAuthor : itchaox
 * @LastTime   : 2024-08-10 00:09
 * @desc       :
 */

import html2canvas from 'html2canvas'

// 导出图片
export function exportImg(id) {
  html2canvas(document.querySelector(id), {
    backgroundColor: '#f8f9fa',
    useCORS: true, //支持图片跨域
    scale: 1 //设置放大的倍数
  }).then((canvas) => {
    // 获取当前时间
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0') // 月份从0开始，所以加1，并确保格式为两位数
    const day = String(now.getDate()).padStart(2, '0')
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const seconds = String(now.getSeconds()).padStart(2, '0')

    // 格式化时间字符串
    const formattedDate = `${year}-${month}-${day} ${hours}-${minutes}-${seconds}`

    // 设置下载文件名
    const filename = `Annotree ${formattedDate}.png`

    const img = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.href = img
    link.download = filename
    link.click()
  })
}
