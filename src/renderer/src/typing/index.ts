/**
 * 所有数据类型
 */
export interface AllDataType {
  flatData: FileTreeItem[]
  noFlatData: any
  folderPath: string
}

/**
 * 文件树节点
 */
export interface FileTreeItem {
  id: string
  isDirectory: boolean
  isFile: boolean
  name: string
  ext?: string
  tree: string
  filePath: string
  note?: string
  isShowElements?: boolean
  elements?: FileTreeItem[]
}

/**
 * 缓存笔记列表
 */
export interface CacheNoteListType {
  id: string
  note: string | null
}
