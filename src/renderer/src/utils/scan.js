/*
 * @Version    : v1.00
 * @Author     : itchaox
 * @Date       : 2024-04-03 15:45
 * @LastAuthor : itchaox
 * @LastTime   : 2024-07-06 16:33
 * @desc       :
 */
import fs, { readFileSync } from 'fs'
import path from 'path'
import ignore from 'ignore'

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

  // 读取 .gitignore 文件
  const gitignorePath = path.join(rootFolderPath, '.gitignore')
  let ig
  try {
    const gitignoreContent = readFileSync(gitignorePath, 'utf8')
    ig = ignore().add(gitignoreContent)
  } catch (err) {
    // 如果没有找到 .gitignore 文件或者读取失败，创建一个空的 ignore 对象
    ig = ignore()
  }


  // FIXME 这里获取了文件夹的内容信息

  // 获得文件夹的内容
  const files = await fs.readdirSync(folderPath)

  for (const filename of files) {
    // path
    const filePathFull = path.join(folderPath, filename)
    const filePath = filePathFull.replace(rootFolderPath, '')
    // 是否为文件或者文件夹
    const stat = await fs.statSync(filePathFull)
    const isFile = stat.isFile()
    const isDirectory = stat.isDirectory()
    const relativePath = path.relative(rootFolderPath, filePathFull)

    // 是文件的话 如果设置不扫描文件 跳过这个文件
    if (isFile && ignoreFile) continue

    // 判断是否根据路径忽略
    if (isIgnoreByPath(filePath)) continue

    // 判断是否根据 .gitignore 忽略
    if (ig.ignores(relativePath)) continue

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
