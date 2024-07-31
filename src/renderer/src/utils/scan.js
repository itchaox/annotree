/*
 * @Version    : v1.00
 * @Author     : itchaox
 * @Date       : 2024-04-03 15:45
 * @LastAuthor : itchaox
 * @LastTime   : 2024-08-01 01:02
 * @desc       :
 */
import fs from 'fs'
import path from 'path'
import ignore from 'ignore'

// 读取 .gitignore 文件
const ignoreRules = fs.readFileSync('.gitignore', 'utf8')

// 处理 ignoreRules
const processedRules = ignoreRules
  .split('\n') // 按行分割
  .map((rule) => rule.trim()) // 去除每行的前后空白
  .filter((rule) => rule && !rule.startsWith('#')) // 过滤掉空行和注释行
  .flatMap((rule) => {
    // 如果规则以 '/' 结尾，则添加规则本身去掉 '/' 后的字符串，并换行
    if (rule.endsWith('/')) {
      const baseRule = rule.slice(0, -1) // 去掉末尾的 '/'
      return [`${baseRule}`, rule] // 保持原规则和添加的新规则
    }
    // 否则保持原样，并换行
    return [rule]
  })
  .join('\n') // 将处理后的规则重新组合为字符串，并换行

// 创建 ignore 实例
const ig = ignore().add(processedRules)

/**
 * 返回传入目录的子文件数据
 * @param {Object} param0 {String} folderPath 文件夹路径
 * @param {Object} param0 {Boolean} needCheckIsFolder 判断传入的是否为文件夹
 */
async function scan({
  // 文件夹目录
  folderPath,
  // 忽略文件路径
  ignorePath,
  // 忽略的文件类型
  ignoreExt,
  // 忽略文件
  ignoreFile,
  // 忽略点开头的文件
  ignoreDotStartFile,
  // 忽略点开头的文件夹
  ignoreDotStartFolder,
  // 扫描深度 0 为没有限制
  deep,
  // 当前层级
  levelCurrent = 1,
  // 判断传入的是否为文件夹
  needCheckIsFolder = false,
  // 默认根目录
  rootFolderPath = folderPath
}) {
  let result = []
  // 层级检测
  if (deep !== 0 && levelCurrent > deep) return result
  // 防止拖拽导入的路径不是文件夹，这个判断只在递归的第一次触发
  if (needCheckIsFolder && !(await fs.statSync(folderPath).isDirectory())) return result
  // 检查该路径是否忽略
  function isIgnoreByPath(fileOrFolderPath) {
    let result = false
    for (const rule of ignorePath) {
      if (rule === fileOrFolderPath) result = true
    }
    return result
  }

  // FIXME 这里获取了文件夹的内容信息

  // 获得文件夹的内容
  const files = await fs.readdirSync(folderPath)

  for (const filename of files) {
    // FIXME 处理过滤的情况，如果需要过滤则 continue

    // path
    const filePathFull = path.join(folderPath, filename)
    const filePath = filePathFull.replace(rootFolderPath, '')

    const relativePath = path.relative(rootFolderPath, filePathFull)

    // FIXME 先根据 ignore 来判断， 直接默认忽略就行了
    if (ig.ignores(relativePath)) continue

    // 是否为文件或者文件夹
    const stat = await fs.statSync(filePathFull)
    const isFile = stat.isFile()
    const isDirectory = stat.isDirectory()

    // 是文件的话 如果设置不扫描文件 跳过这个文件
    if (isFile && ignoreFile) continue

    // 判断是否根据路径忽略
    if (isIgnoreByPath(filePath)) continue

    // 解析路径
    const filePathParsed = path.parse(filePath)

    // 忽略点开头的文件
    if (isFile && ignoreDotStartFile && filePathParsed.name[0] === '.') continue

    // 忽略点开头的文件夹
    if (isDirectory && ignoreDotStartFolder && filePathParsed.name[0] === '.') continue

    // 是文件的话 判断是否根文件类型忽略
    if (isFile && ignoreExt.indexOf(filePathParsed.ext) >= 0) continue

    result.push({
      isShow: true,
      isShowElements: true,
      ...stat,
      isFile,
      isDirectory,
      filePath,
      filePathFull,
      ...filePathParsed,
      // 如果是文件夹，其子文件或者子文件夹
      elements: isDirectory
        ? await scan({
            folderPath: filePathFull,
            ignorePath,
            ignoreExt,
            ignoreFile,
            ignoreDotStartFile,
            ignoreDotStartFolder,
            deep,
            levelCurrent: levelCurrent + 1,
            rootFolderPath
          })
        : []
    })
  }
  return result
}

export default scan
