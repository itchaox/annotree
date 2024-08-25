/*
 * @Version    : v1.00
 * @Author     : Wang Chao
 * @Date       : 2024-08-25 18:45
 * @LastAuthor : Wang Chao
 * @LastTime   : 2024-08-25 18:45
 * @desc       : 排序文件路径
 */

export function sortFilePaths(arr) {
  return arr.sort((a, b) => {
    // 如果两个路径在同一个层级，先判断是否是文件夹
    const aIsDir = a.isDirectory
    const bIsDir = b.isDirectory

    // 文件夹在前，文件在后
    if (aIsDir && !bIsDir) {
      return -1 // a 是文件夹，排在前
    }
    if (!aIsDir && bIsDir) {
      return 1 // b 是文件夹，排在前
    }

    // 如果两者都是文件夹或文件，则按字母顺序排序
    // return a.filePath.localeCompare(b.filePath)

    // 提取数字和字母部分
    const aParts = a.filePath.match(/(\d+|\D+)/g) || []
    const bParts = b.filePath.match(/(\d+|\D+)/g) || []

    for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
      const aPart = aParts[i] || ''
      const bPart = bParts[i] || ''

      // 如果都是数字部分，则按数字比较
      if (!isNaN(aPart) && !isNaN(bPart)) {
        const diff = parseInt(aPart) - parseInt(bPart)
        if (diff !== 0) return diff
      } else {
        // 如果不是数字部分，则按字母比较
        const diff = aPart.localeCompare(bPart)
        if (diff !== 0) return diff
      }
    }

    // 如果所有部分都相等，则返回 0
    return 0
  })
}
