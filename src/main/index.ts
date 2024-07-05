/*
 * @Version    : v1.00
 * @Author     : itchaox
 * @Date       : 2024-05-04 19:35
 * @LastAuthor : itchaox
 * @LastTime   : 2024-07-05 10:46
 * @desc       :
 */
import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron';
import { join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import icon from '../../resources/icon.png?asset';

function createWindow(): void {
  // 创建一个新的浏览器窗口
  const mainWindow = new BrowserWindow({
    // 宽度
    width: 900,
    // 高度
    height: 670,
    // 初始化时不显示窗口
    show: false,
    // 自动隐藏菜单栏
    autoHideMenuBar: true,
    // 如果运行平台是Linux，则设置图标
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      // 预加载脚本文件路径
      preload: join(__dirname, '../preload/index.js'),
      // 禁用沙盒模式
      sandbox: false,
    },
  });

  // 当窗口准备好显示时，显示窗口
  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });

  // 阻止窗口内打开新链接，改为在默认浏览器中打开
  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  // 基于 electron-vite CLI 的热模块替换（HMR）功能
  // 在开发环境下加载远程 URL，在生产环境下加载本地 HTML 文件
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }
}

// 打开文件管理系统
ipcMain.on('file-select', async (event, arg) => {
  // FIXME 打开系统文件选择器
  const window = BrowserWindow.getFocusedWindow();
  const { canceled, filePaths } = await dialog.showOpenDialog(window, {
    properties: ['openDirectory', 'createDirectory'],
  });

  // 获取到选择好的目录路径，然后再进一步的操作
  const currentFilePath = filePaths[0];
  if (canceled === false) {
    // 返回选择好的目录路径
    event.reply('file-select-reply', currentFilePath);
  }
});

// 当 Electron 完成初始化并准备创建浏览器窗口时，将调用此方法
// 某些 API 只能在此事件发生后使用
app.whenReady().then(() => {
  // 为 Windows 设置应用用户模型 ID
  electronApp.setAppUserModelId('com.electron');

  // 默认情况下，在开发环境中通过 F12 打开或关闭开发者工具
  // 并在生产环境中忽略 CommandOrControl + R
  // 参见 https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  // IPC 测试
  ipcMain.on('ping', () => console.log('pong'));

  createWindow();

  app.on('activate', function () {
    // 在 macOS 上，当点击 Dock 图标并且没有其他窗口打开时，通常会重新创建一个窗口
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// 当所有窗口都关闭时退出应用，除了在 macOS 上，那里通常会保持应用及其菜单栏处于活动状态，直到用户按 Cmd + Q 明确退出
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 在这个文件中，你可以包含应用程序特定的主进程代码
// 你也可以将它们放在单独的文件中，并在这里 require 它们
