/*
 * @Version    : v1.00
 * @Author     : itchaox
 * @Date       : 2024-07-06 11:28
 * @LastAuthor : itchaox
 * @LastTime   : 2024-08-01 09:36
 * @desc       :
 */
import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import fs from 'fs'

function createWindow(): void {
  // FIXME 创建窗口
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // 根据 electron-vite cli 进行渲染器的 HMR。
  // 在开发模式下加载远程 URL，生产模式下加载本地 HTML 文件。
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  // 仅在开发环境下默认打开控制台
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools()
  }
}

// 当 Electron 初始化完成并准备好创建浏览器窗口时将调用此方法。
// 某些 API 只能在此事件发生后使用。
app.whenReady().then(() => {
  // 为 Windows 设置应用程序用户模型 ID
  electronApp.setAppUserModelId('com.electron')

  // 在开发环境下默认通过 F12 打开或关闭开发者工具，
  // 在生产环境下忽略 CommandOrControl + R 的刷新命令。
  // 参见 https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // FIXME 主进程，所以在终端打印信息
  // 渲染进程请求选择扫描的文件夹
  ipcMain.on('IPC_FOLDER_SELECT', async (event) => {
    const window = BrowserWindow.getFocusedWindow()
    const result = await dialog.showOpenDialog(window as any, {
      // 'openDirectory'：允许用户选择文件夹
      // 'createDirectory'：允许用户在对话框中创建新文件夹

      properties: ['openDirectory', 'createDirectory']
    })

    // 检查用户是否点击了确认按钮
    const isDialogConfirmed = !result.canceled

    // 如果用户点击了确认按钮，发送选中的文件夹路径
    if (isDialogConfirmed) {
      const selectedFolderPath = result.filePaths[0]
      event.reply('IPC_FOLDER_SELECT_REPLY', selectedFolderPath)
    }
  })

  /**
   * 渲染进程请求选择保存结果的目录
   */
  ipcMain.on('IPC_EXPORT', async (event, { name, value, openAfterExport, isEggshell }) => {
    const window = BrowserWindow.getFocusedWindow()
    const result = await dialog.showSaveDialog(window as any, {
      defaultPath: name
    })

    // 点击确定按钮
    if (result.canceled === false) {
      await fs.writeFileSync(result.filePath, new Uint8Array(Buffer.from(value)))
      if (openAfterExport) {
        // 导出后直接打开文件
        shell.openPath(result.filePath).then((result) => {
          if (result) {
            console.error('Error opening URL:', result)
          }
        })
      }

      event.reply('IPC_EXPORT_REPLY', {
        isEggshell
      })
    }
  })

  ipcMain.handle('get-system-language', () => {
    return app.getLocale()
  })

  createWindow()

  app.on('activate', function () {
    // 在 macOS 上，当单击 dock 图标并且没有其他窗口打开时，
    // 重新创建一个窗口是常见的行为。
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// 当所有窗口关闭时退出应用程序，但在 macOS 上除外。
// 在 macOS 上，应用程序及其菜单栏通常会保持活动状态，直到用户使用 Cmd + Q 显式退出。
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// 在这个文件中，您可以包含其余应用程序特定主进程代码。
// 您也可以将它们放在单独的文件中，并在此处引入它们。
